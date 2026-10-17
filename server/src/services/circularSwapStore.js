import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { CircularProposal } from '../models/CircularProposal.js';
import { ExchangeRequest } from '../models/ExchangeRequest.js';
import { isDatabaseConnected } from '../config/db.js';
import { listingStore } from './listingStore.js';
import { notificationStore } from './notificationStore.js';
import { inMemoryUserStore } from './inMemoryUserStore.js';
import { exchangeStore } from './exchangeStore.js';
import { findCircularCycles, checkAffinity } from './cycleDetectionAlgorithm.js';

class CircularSwapStore {
  constructor() {
    this.memoryProposals = [];
  }

  /**
   * Evaluates if itemGiver wants itemCandidate based on desiredItems keywords, tags, or categories.
   * Produces a transparent reason string and score.
   */
  evaluateAffinity(giverItem, candidateItem) {
    const giverOwnerId = (giverItem.owner?._id || giverItem.owner || giverItem.seller?.id || '').toString();
    const candidateOwnerId = (candidateItem.owner?._id || candidateItem.owner || candidateItem.seller?.id || '').toString();

    // Prevent matching with own items
    if (giverOwnerId && candidateOwnerId && giverOwnerId === candidateOwnerId) {
      return { matched: false };
    }

    const desiredText = (giverItem.desiredItems || '').toLowerCase().trim();
    const candidateTitle = (candidateItem.title || '').toLowerCase();
    const candidateCategory = (candidateItem.category || '').toLowerCase();
    const candidateDesc = (candidateItem.description || '').toLowerCase();
    const candidateTags = (candidateItem.tags || []).map(t => t.toLowerCase());

    // 1. Direct Keyword / Phrase Matching from desiredItems
    if (desiredText.length > 0) {
      // Split on common delimiters: commas, 'or', 'and', '/'
      const searchTokens = desiredText
        .split(/[,/]|(\bor\b)|(\band\b)/i)
        .map(t => (t ? t.trim().toLowerCase() : ''))
        .filter(t => t.length > 2 && !['or', 'and', 'the', 'for', 'with', 'any'].includes(t));

      for (const token of searchTokens) {
        if (candidateTitle.includes(token)) {
          return {
            matched: true,
            score: 95,
            reason: `Direct keyword match: "${token}" found in "${candidateItem.title}"`
          };
        }
        if (candidateTags.some(tag => tag.includes(token) || token.includes(tag))) {
          return {
            matched: true,
            score: 90,
            reason: `Topic match: "${token}" matches tag on "${candidateItem.title}"`
          };
        }
        if (candidateCategory.includes(token) || token.includes(candidateCategory)) {
          return {
            matched: true,
            score: 85,
            reason: `Category match: Desired "${token}" matches category "${candidateItem.category}"`
          };
        }
        if (candidateDesc.includes(token)) {
          return {
            matched: true,
            score: 75,
            reason: `Description match: Desired "${token}" mentioned in listing details`
          };
        }
      }
    }

    // 2. Category Synergies for Swap-type items (Textbooks <-> Textbooks, Lab Gear <-> Electronics, etc.)
    if (giverItem.listingType === 'swap' || giverItem.listingType === 'trade') {
      if (candidateItem.listingType === 'swap' || candidateItem.listingType === 'trade' || candidateItem.listingType === 'sell') {
        if (giverItem.category === candidateItem.category) {
          return {
            matched: true,
            score: 65,
            reason: `Academic department synergy: Both items are in "${candidateItem.category}"`
          };
        }
        // Common collegiate cross-swaps: textbooks <-> electronics or lab-gear <-> stationery
        const isAcademicSwap = 
          (giverItem.category === 'textbooks' && candidateItem.category === 'electronics') ||
          (giverItem.category === 'electronics' && candidateItem.category === 'textbooks') ||
          (giverItem.category === 'lab-gear' && candidateItem.category === 'stationery') ||
          (giverItem.category === 'stationery' && candidateItem.category === 'lab-gear');

        if (isAcademicSwap) {
          return {
            matched: true,
            score: 60,
            reason: `Cross-department STEM exchange: ${giverItem.category} ↔ ${candidateItem.category}`
          };
        }
      }
    }

    return { matched: false };
  }

  /**
   * Retrieves active available items from DB or Memory.
   */
  async getAvailableCandidateItems() {
    let items = [];

    if (isDatabaseConnected()) {
      try {
        items = await Listing.find({ status: 'available' })
          .populate('owner', 'name avatar department campus karmaScore isCollegeVerified')
          .lean();
      } catch (err) {
        console.warn('DB getAvailableCandidateItems fallback:', err.message);
      }
    }

    if (items.length === 0 && listingStore.memoryListings) {
      items = listingStore.memoryListings.filter(i => (i.status || 'available') === 'available');
    }

    return items.map(item => {
      const ownerObj = item.owner || {};
      const sellerObj = item.seller || {};
      const ownerId = (ownerObj._id || ownerObj.id || sellerObj.id || item.owner || '').toString();
      const ownerName = ownerObj.name || sellerObj.name || 'Campus Student';
      const ownerAvatar = ownerObj.avatar || sellerObj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
      const ownerDept = ownerObj.department || sellerObj.department || 'General Studies';
      const ownerCampus = ownerObj.campus || sellerObj.campus || item.campus || 'Main Campus';

      return {
        id: (item._id || item.id).toString(),
        _id: item._id,
        title: item.title,
        category: item.category,
        condition: item.condition,
        listingType: item.listingType,
        desiredItems: item.desiredItems || '',
        price: item.price || item.sellingPrice || 0,
        originalPrice: item.originalPrice || 40,
        co2SavedKg: Number(item.co2SavedKg) || 8.5,
        imageUrl: item.imageUrl || (item.images && item.images[0]) || '',
        tags: item.tags || [],
        description: item.description || '',
        status: item.status || 'available',
        seller: {
          id: ownerId,
          name: ownerName,
          avatar: ownerAvatar,
          department: ownerDept,
          campus: ownerCampus
        }
      };
    });
  }

  /**
   * Checks if any item is already committed to an active circular swap proposal (pending_consent or confirmed).
   */
  async getActiveProposalForItemIds(itemIds) {
    const stringItemIds = itemIds.map(id => id.toString());
    if (isDatabaseConnected()) {
      try {
        const found = await CircularProposal.findOne({
          items: { $in: stringItemIds },
          status: { $in: ['pending_consent', 'confirmed'] }
        }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('DB active proposal check fallback:', err.message);
      }
    }

    return (
      this.memoryProposals.find(p =>
        ['pending_consent', 'confirmed'].includes(p.status) &&
        p.items?.some(it => stringItemIds.includes((it._id || it.id || it).toString()))
      ) || null
    );
  }

  /**
   * Identifies 2-way and 3-way circular swap cycles among available items.
   * Returns cycles as transparent suggestions only.
   */
  async findCycles({ userId = null, category = null } = {}) {
    const items = await this.getAvailableCandidateItems();
    if (items.length < 2) {
      return {
        totalCycles: 0,
        cycles: [],
        notice: 'Not enough available listings in the marketplace to form exchange loops. Add listings with desired items to discover circular cycles.'
      };
    }

    // Run modular cycle detection algorithm for both 2-way and 3-way circular loops
    let discoveredCycles = findCircularCycles(items, { minLength: 2, maxLength: 3 });

    // Sort by efficiencyScore descending, then totalCo2SavedKg descending
    let sortedCycles = discoveredCycles.sort((a, b) => {
      if (b.efficiencyScore !== a.efficiencyScore) return b.efficiencyScore - a.efficiencyScore;
      return b.totalCo2SavedKg - a.totalCo2SavedKg;
    });

    // If userId provided, filter or prioritize cycles involving this user
    if (userId) {
      const userStr = userId.toString();
      sortedCycles = sortedCycles.sort((a, b) => {
        const aHasUser = a.participants.some(p => p.id === userStr);
        const bHasUser = b.participants.some(p => p.id === userStr);
        if (aHasUser && !bHasUser) return -1;
        if (!aHasUser && bHasUser) return 1;
        return 0;
      });
    }

    // Filter by category if requested
    if (category && category !== 'all') {
      sortedCycles = sortedCycles.filter(c =>
        c.steps.some(s => s.item.category === category)
      );
    }

    return {
      totalCycles: sortedCycles.length,
      cycles: sortedCycles,
      notice: 'Cycles are prospective suggestions generated from marketplace preferences. Explicit consent from each student is required before any items are exchanged.'
    };
  }

  /**
   * Creates a formal proposal for a suggested cycle.
   * STRICT SAFETY: Does NOT automatically accept or reserve items.
   * Sets initiator consent to 'accepted', others to 'pending'.
   */
  async proposeCycle({ cycleData, initiatorUser }) {
    if (!cycleData || !cycleData.steps || cycleData.steps.length < 2) {
      throw new Error('Invalid cycle data provided for circular proposal');
    }

    const initiatorId = (initiatorUser._id || initiatorUser.id || initiatorUser).toString();
    const participantIds = [
      ...new Set(
        cycleData.steps.flatMap(s => [
          s.fromStudent.id || s.fromStudent._id,
          s.toStudent.id || s.toStudent._id
        ])
      )
    ].filter(Boolean);

    // Verify initiator is one of the participants
    if (!participantIds.includes(initiatorId)) {
      throw new Error('You must be a participant in the circular cycle to initiate a proposal');
    }

    const itemIds = cycleData.steps.map(s => (s.item.id || s.item._id).toString());

    // Safety check: Prevent an item from being committed to multiple active circular swaps simultaneously
    const conflicting = await this.getActiveProposalForItemIds(itemIds);
    if (conflicting) {
      throw new Error('Cannot initiate cycle: One or more items are already committed to an active circular swap proposal');
    }

    // Revalidate items are currently available before creating proposal
    const availableItems = await this.getAvailableCandidateItems();
    const availableIdSet = new Set(availableItems.map(i => i.id));
    for (const itemId of itemIds) {
      if (!availableIdSet.has(itemId)) {
        throw new Error(`Cannot initiate cycle: item "${itemId}" is no longer available in the marketplace`);
      }
    }

    // Map participant consents
    const consents = participantIds.map(pId => {
      const isInitiator = pId === initiatorId;
      const studentInfo =
        cycleData.participants?.find(p => p.id === pId) ||
        cycleData.steps.find(s => s.fromStudent.id === pId)?.fromStudent ||
        {};

      return {
        userId: pId,
        userName: studentInfo.name || (isInitiator ? initiatorUser.name : 'Participant Student'),
        userAvatar: studentInfo.avatar || (isInitiator ? initiatorUser.avatar : ''),
        userDepartment: studentInfo.department || (isInitiator ? initiatorUser.department : 'General Studies'),
        status: isInitiator ? 'accepted' : 'pending',
        respondedAt: isInitiator ? new Date() : null,
        note: isInitiator ? 'Proposal initiated with automatic consent' : ''
      };
    });

    const proposalSteps = cycleData.steps.map(s => ({
      fromUserId: (s.fromStudent.id || s.fromStudent._id).toString(),
      fromUserName: s.fromStudent.name,
      fromUserAvatar: s.fromStudent.avatar || '',
      toUserId: (s.toStudent.id || s.toStudent._id).toString(),
      toUserName: s.toStudent.name,
      toUserAvatar: s.toStudent.avatar || '',
      itemId: (s.item.id || s.item._id).toString(),
      itemTitle: s.item.title,
      itemCategory: s.item.category || '',
      itemImageUrl: s.item.imageUrl || '',
      itemCo2Kg: Number(s.item.co2SavedKg) || 0,
      matchReason: s.reason || '',
      handoverConfirmed: false,
      handoverConfirmedAt: null
    }));

    let proposalRecord = null;

    if (isDatabaseConnected()) {
      try {
        const created = await CircularProposal.create({
          cycleType: cycleData.cycleType || '3-way',
          initiator: initiatorId,
          participants: participantIds,
          items: itemIds,
          steps: proposalSteps,
          consents,
          status: 'pending_consent',
          totalCo2SavedKg: cycleData.totalCo2SavedKg || 0,
          totalDollarsSaved: cycleData.totalDollarsSaved || 0,
          summaryText: cycleData.summary || ''
        });
        proposalRecord = created.toJSON();
      } catch (err) {
        console.warn('DB proposal creation fallback:', err.message);
      }
    }

    if (!proposalRecord) {
      proposalRecord = {
        id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        cycleType: cycleData.cycleType || '3-way',
        initiator: initiatorId,
        participants: participantIds,
        items: itemIds,
        steps: proposalSteps,
        consents,
        status: 'pending_consent',
        totalCo2SavedKg: cycleData.totalCo2SavedKg || 0,
        totalDollarsSaved: cycleData.totalDollarsSaved || 0,
        summaryText: cycleData.summary || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.memoryProposals.unshift(proposalRecord);
    }

    // Send notifications to all other participants requesting explicit consent
    for (const pId of participantIds) {
      if (pId !== initiatorId) {
        await notificationStore.create({
          recipient: pId,
          sender: initiatorId,
          type: 'exchange_request',
          title: `🔄 Circular Swap Proposal (${proposalRecord.cycleType})`,
          message: `${initiatorUser.name} proposed an exchange cycle involving your listing. Review the loop and accept or decline.`
        });
      }
    }

    return proposalRecord;
  }

  /**
   * Submits a participant's consent response ('accepted' or 'declined').
   * Revalidates items upon full acceptance before finalizing.
   */
  async respondToProposal({ proposalId, user, decision, note = '' }) {
    const userId = (user._id || user.id || user).toString();
    const normalizedDecision = decision.toLowerCase().trim();

    if (!['accepted', 'declined'].includes(normalizedDecision)) {
      throw new Error('Decision must be either "accepted" or "declined"');
    }

    let proposal = null;

    if (isDatabaseConnected()) {
      try {
        proposal = await CircularProposal.findById(proposalId);
      } catch (err) {
        console.warn('DB proposal fetch fallback:', err.message);
      }
    }

    if (!proposal) {
      proposal = this.memoryProposals.find(p => p.id === proposalId || p._id?.toString() === proposalId);
    }

    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== 'pending_consent') {
      throw new Error(`Proposal is no longer pending consent (current status: ${proposal.status})`);
    }

    const consentIndex = proposal.consents.findIndex(
      c => (c.userId?._id || c.userId || '').toString() === userId
    );

    if (consentIndex === -1) {
      throw new Error('You are not a registered participant in this circular swap proposal');
    }

    // Update participant's consent record
    proposal.consents[consentIndex].status = normalizedDecision;
    proposal.consents[consentIndex].respondedAt = new Date();
    proposal.consents[consentIndex].note = note;

    // Handle Decline: immediately marks proposal as declined, no items reserved
    if (normalizedDecision === 'declined') {
      proposal.status = 'declined';
      if (proposal.save) await proposal.save();

      // Notify all other participants of decline
      const otherParticipants = proposal.participants.filter(
        p => (p._id || p).toString() !== userId
      );
      for (const otherId of otherParticipants) {
        await notificationStore.create({
          recipient: otherId,
          sender: userId,
          type: 'request_rejected',
          title: '❌ Circular Swap Cancelled',
          message: `${user.name} declined the circular swap proposal. No items were reserved or modified.`
        });
      }

      return proposal.toJSON ? proposal.toJSON() : proposal;
    }

    // Handle Accept: check if ALL participants have now accepted
    const allAccepted = proposal.consents.every(c => c.status === 'accepted');

    if (!allAccepted) {
      // Partial acceptance, save and notify initiator
      if (proposal.save) await proposal.save();

      await notificationStore.create({
        recipient: proposal.initiator,
        sender: userId,
        type: 'request_accepted',
        title: '👍 Circular Swap Progress',
        message: `${user.name} accepted the circular exchange proposal! Waiting on remaining participants.`
      });

      return proposal.toJSON ? proposal.toJSON() : proposal;
    }

    // ALL PARTICIPANTS HAVE ACCEPTED:
    // MANDATORY REVALIDATION: Verify every item is currently available
    const availableItems = await this.getAvailableCandidateItems();
    const availableIdSet = new Set(availableItems.map(i => i.id));
    const itemIds = proposal.steps.map(s => s.itemId);

    for (const itemId of itemIds) {
      if (!availableIdSet.has(itemId)) {
        // Item is no longer available! Expire the proposal and do not finalize
        proposal.status = 'expired';
        proposal.revalidationError = `Item "${itemId}" is no longer available. Exchange cycle cancelled without modification.`;
        if (proposal.save) await proposal.save();

        for (const pId of proposal.participants) {
          await notificationStore.create({
            recipient: pId,
            sender: userId,
            type: 'request_cancelled',
            title: '⚠️ Circular Swap Expired',
            message: `One of the items in the loop is no longer available. The cycle has been safely cancelled.`
          });
        }

        return proposal.toJSON ? proposal.toJSON() : proposal;
      }
    }

    // ALL ITEMS ARE VERIFIED AVAILABLE:
    // Finalize the circular exchange!
    proposal.status = 'confirmed';

    // 1. Update all items to 'completed'
    for (const step of proposal.steps) {
      try {
        await listingStore.updateStatus(step.itemId, 'completed', step.fromUserId);
      } catch (err) {
        console.warn('Listing status completion update warning:', err.message);
      }

      // Record completed exchange request for metrics tracking
      try {
        await exchangeStore.create({
          listingId: step.itemId,
          requesterId: step.toUserId,
          type: 'swap',
          message: `Completed circular loop exchange: ${step.matchReason}`,
          status: 'completed'
        });
      } catch (e) {
        // Exchange logging fallback
      }
    }

    // 2. Award Eco-Karma & Increment Items Reused for all participants
    for (const participantId of proposal.participants) {
      const pIdStr = (participantId._id || participantId).toString();
      try {
        if (isDatabaseConnected()) {
          await User.findByIdAndUpdate(pIdStr, {
            $inc: {
              karmaScore: 35,
              itemsReused: 1,
              co2DivertedKg: Math.round(proposal.totalCo2SavedKg / proposal.participants.length)
            }
          });
        }
      } catch (err) {
        console.warn('User karma reward fallback:', err.message);
      }

      // 3. Send celebratory completion notification
      await notificationStore.create({
        recipient: pIdStr,
        sender: proposal.initiator,
        type: 'exchange_completed',
        title: '🎉 Circular Loop Finalized!',
        message: `All participants accepted! Your circular loop averted ${proposal.totalCo2SavedKg}kg of CO₂ and earned +35 Eco-Karma!`
      });
    }

    if (proposal.save) await proposal.save();

    return proposal.toJSON ? proposal.toJSON() : proposal;
  }

  /**
   * Retrieves active proposals involving a user.
   */
  async getProposalsForUser(userId) {
    const userStr = (userId._id || userId.id || userId).toString();
    let proposals = [];

    if (isDatabaseConnected()) {
      try {
        proposals = await CircularProposal.find({
          participants: userStr
        })
          .sort({ createdAt: -1 })
          .populate('initiator', 'name avatar department')
          .lean();
      } catch (err) {
        console.warn('DB getProposalsForUser fallback:', err.message);
      }
    }

    if (proposals.length === 0) {
      proposals = this.memoryProposals.filter(p =>
        p.participants.some(pId => (pId._id || pId).toString() === userStr)
      );
    }

    return proposals.map(p => ({
      ...p,
      id: (p._id || p.id).toString()
    }));
  }

  /**
   * Retrieves single proposal by ID.
   */
  async getProposalById(proposalId) {
    let proposal = null;

    if (isDatabaseConnected()) {
      try {
        proposal = await CircularProposal.findById(proposalId)
          .populate('initiator', 'name avatar department')
          .lean();
      } catch (err) {}
    }

    if (!proposal) {
      proposal = this.memoryProposals.find(p => (p._id || p.id).toString() === proposalId);
    }

    return proposal ? { ...proposal, id: (proposal._id || proposal.id).toString() } : null;
  }

  /**
   * Confirms item handover for a specific step in a confirmed circular swap.
   * When all steps have confirmed handovers, the proposal transitions to 'completed'.
   */
  async confirmStepHandover({ proposalId, user, stepIndex, itemId }) {
    const userId = (user._id || user.id || user).toString();

    let proposal = null;
    if (isDatabaseConnected()) {
      try {
        proposal = await CircularProposal.findById(proposalId);
      } catch (err) {
        console.warn('DB confirmStepHandover fetch fallback:', err.message);
      }
    }

    if (!proposal) {
      proposal = this.memoryProposals.find(p => (p._id || p.id).toString() === proposalId);
    }

    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== 'confirmed' && proposal.status !== 'completed') {
      throw new Error(`Handovers can only be confirmed for confirmed proposals (current status: ${proposal.status})`);
    }

    // Determine target step index
    let targetIdx = -1;
    if (stepIndex !== undefined && stepIndex !== null && !isNaN(Number(stepIndex))) {
      targetIdx = Number(stepIndex);
    } else if (itemId) {
      targetIdx = proposal.steps.findIndex(s => s.itemId === itemId.toString());
    } else {
      targetIdx = proposal.steps.findIndex(s => s.toUserId === userId && !s.handoverConfirmed);
    }

    if (targetIdx < 0 || targetIdx >= proposal.steps.length) {
      throw new Error('Invalid step specified for handover confirmation');
    }

    const step = proposal.steps[targetIdx];

    // Authorization check: User must be recipient, giver, initiator, or verified loop participant
    const isRecipient = step.toUserId === userId;
    const isGiver = step.fromUserId === userId;
    const isInitiator = (proposal.initiator?._id || proposal.initiator || '').toString() === userId;
    const isParticipant = proposal.participants.some(p => (p._id || p).toString() === userId);

    if (!isRecipient && !isGiver && !isInitiator && !isParticipant) {
      throw new Error('You are not authorized to confirm handover for this transfer step');
    }

    // Update handover flag
    step.handoverConfirmed = true;
    step.handoverConfirmedAt = new Date();

    // Ensure item status is updated to completed
    try {
      await listingStore.updateStatus(step.itemId, 'completed', step.fromUserId);
    } catch (err) {
      // Non-fatal if already completed
    }

    // Check if ALL steps are now confirmed
    const allHandoversDone = proposal.steps.every(s => s.handoverConfirmed);
    if (allHandoversDone) {
      proposal.status = 'completed';

      // Send completion notifications to all participants
      for (const pId of proposal.participants) {
        const pIdStr = (pId._id || pId).toString();
        await notificationStore.create({
          recipient: pIdStr,
          sender: (proposal.initiator._id || proposal.initiator).toString(),
          type: 'exchange_completed',
          title: '🌟 Circular Swap Cycle Fully Completed!',
          message: `All item handovers in your circular loop are complete! Thank you for advancing circular campus sustainability!`
        });
      }
    }

    if (proposal.save) await proposal.save();

    return proposal.toJSON ? proposal.toJSON() : proposal;
  }

  /**
   * Safely cancels/declines an active circular proposal and releases all reservations cleanly.
   */
  async cancelProposal({ proposalId, user }) {
    const userId = (user._id || user.id || user).toString();
    let proposal = null;
    if (isDatabaseConnected()) {
      try {
        proposal = await CircularProposal.findById(proposalId);
      } catch (err) {
        console.warn('DB cancelProposal fallback:', err.message);
      }
    }
    if (!proposal) {
      proposal = this.memoryProposals.find(p => (p._id || p.id).toString() === proposalId);
    }
    if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

    const isParticipant = proposal.participants.some(p => (p._id || p).toString() === userId);
    if (!isParticipant) throw new Error('Not authorized to cancel this circular proposal');

    if (proposal.status === 'completed') {
      throw new Error('Cannot cancel a completed exchange cycle');
    }

    proposal.status = 'declined';
    if (proposal.save) await proposal.save();

    // Notify participants
    for (const pId of proposal.participants) {
      const pIdStr = (pId._id || pId).toString();
      if (pIdStr !== userId) {
        await notificationStore.create({
          recipient: pIdStr,
          sender: userId,
          type: 'request_rejected',
          title: '❌ Circular Swap Cancelled',
          message: `${user.name || 'A participant'} cancelled the circular swap proposal. No items were reserved or modified.`
        });
      }
    }

    return proposal.toJSON ? proposal.toJSON() : proposal;
  }
}

export const circularSwapStore = new CircularSwapStore();
