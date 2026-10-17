import mongoose from 'mongoose';
import { ExchangeRequest } from '../models/ExchangeRequest.js';
import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { listingStore } from './listingStore.js';
import { notificationStore } from './notificationStore.js';

class ExchangeStore {
  constructor() {
    this.memoryRequests = [];
  }

  /**
   * Helper to normalize user ID
   */
  _getUserId(user) {
    if (!user) return null;
    return (user._id || user.id || user).toString();
  }

  /**
   * Helper to populate an in-memory request object
   */
  async _populateMemoryRequest(req) {
    const populated = { ...req };

    // Populate target listing
    if (populated.listing) {
      const l = await listingStore.getById(populated.listing);
      populated.listing = l || { id: populated.listing, title: 'Item Listing' };
    }

    // Populate offered listing if swap
    if (populated.offeredListing) {
      const ol = await listingStore.getById(populated.offeredListing);
      populated.offeredListing = ol || { id: populated.offeredListing, title: 'Offered Item' };
    }

    return populated;
  }

  /**
   * Submit a new exchange request (Swap, Give Away, or Sell inquiry)
   */
  async create({ listingId, offeredListingId, proposedMeetingTime, proposedSpot, message }, user) {
    if (!user) {
      const err = new Error('Authentication required to submit an exchange request');
      err.status = 401;
      throw err;
    }

    const requesterId = this._getUserId(user);

    // 1. Fetch and validate target listing
    const targetListing = await listingStore.getById(listingId);
    if (!targetListing) {
      const err = new Error('Target listing not found');
      err.status = 404;
      throw err;
    }

    // Check availability
    if (targetListing.status !== 'available') {
      const err = new Error(`Item is currently ${targetListing.status} and cannot receive new exchange requests.`);
      err.status = 400;
      err.code = 'ITEM_UNAVAILABLE';
      throw err;
    }

    // Prevent self-requests
    const targetOwnerId = (targetListing.owner?._id || targetListing.owner || targetListing.seller?.id || '').toString();
    if (targetOwnerId && targetOwnerId === requesterId) {
      const err = new Error('You cannot submit an exchange request for your own listing.');
      err.status = 400;
      err.code = 'SELF_REQUEST_FORBIDDEN';
      throw err;
    }

    // 2. Validate request type and offered item
    const rawType = (targetListing.listingType || 'sell').toLowerCase();
    let exchangeType = 'sell';
    if (rawType === 'swap' || rawType === 'trade') exchangeType = 'swap';
    else if (rawType === 'giveaway' || rawType === 'free') exchangeType = 'giveaway';

    let validatedOfferedId = null;

    if (exchangeType === 'swap') {
      if (!offeredListingId) {
        const err = new Error('A swap exchange requires offering one of your available items.');
        err.status = 400;
        err.code = 'OFFERED_ITEM_REQUIRED';
        throw err;
      }

      const offeredListing = await listingStore.getById(offeredListingId);
      if (!offeredListing) {
        const err = new Error('The offered swap item was not found.');
        err.status = 404;
        throw err;
      }

      const offeredOwnerId = (offeredListing.owner?._id || offeredListing.owner || offeredListing.seller?.id || '').toString();
      if (offeredOwnerId !== requesterId) {
        const err = new Error('You can only offer items from your own active listings.');
        err.status = 403;
        err.code = 'NOT_OFFERED_ITEM_OWNER';
        throw err;
      }

      if (offeredListing.status !== 'available') {
        const err = new Error(`Your offered item "${offeredListing.title}" is currently ${offeredListing.status} and cannot be offered.`);
        err.status = 400;
        err.code = 'OFFERED_ITEM_UNAVAILABLE';
        throw err;
      }

      validatedOfferedId = (offeredListing._id || offeredListing.id).toString();
    }

    // 3. Prevent duplicate active requests
    const activeRequests = await this.getAll({
      userId: requesterId,
      role: 'outgoing'
    });

    const hasDuplicate = activeRequests.some(
      r => (r.listing?.id === listingId || r.listing?._id?.toString() === listingId || r.listing === listingId) &&
           (r.status === 'pending' || r.status === 'accepted')
    );

    if (hasDuplicate) {
      const err = new Error('You already have an active request for this item. Please check your dashboard.');
      err.status = 409;
      err.code = 'DUPLICATE_ACTIVE_REQUEST';
      throw err;
    }

    const meetingSpot = proposedSpot?.trim() || targetListing.location?.campusSpot || 'Main Library Safe Zone';
    const meetingTime = proposedMeetingTime?.trim() || 'Flexible this week';

    // 4. Persist in Database or Memory
    if (isDatabaseConnected()) {
      try {
        const createdReq = await ExchangeRequest.create({
          listing: targetListing._id || targetListing.id,
          owner: targetOwnerId || user._id,
          requester: requesterId,
          type: exchangeType,
          offeredListing: validatedOfferedId,
          proposedMeetingTime: meetingTime,
          proposedSpot: meetingSpot,
          message: message?.trim() || '',
          status: 'pending',
          statusHistory: [
            {
              status: 'pending',
              changedBy: requesterId,
              note: 'Request created',
              timestamp: new Date()
            }
          ]
        });

        const populated = await ExchangeRequest.findById(createdReq._id)
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        // Send in-app notification to listing owner
        await notificationStore.create({
          recipient: targetOwnerId,
          sender: requesterId,
          type: 'request_received',
          exchangeRequest: createdReq._id,
          listing: targetListing._id || targetListing.id,
          title: `New ${exchangeType.toUpperCase()} Request: ${targetListing.title}`,
          message: `${user.name} proposed a meetup at ${meetingSpot}. Note: "${message?.trim() || 'Ready to exchange'}"`
        });

        return {
          ...populated,
          id: populated._id.toString()
        };
      } catch (err) {
        console.warn('DB ExchangeRequest create notice, falling back:', err.message);
      }
    }

    // In-Memory Fallback
    const memoryObj = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      listing: targetListing,
      owner: {
        id: targetOwnerId || 'usr-owner',
        name: targetListing.seller?.name || 'Campus Student',
        avatar: targetListing.seller?.avatar || user.avatar,
        department: targetListing.seller?.department || 'General Studies',
        year: targetListing.seller?.year || 'Student',
        isCollegeVerified: !!targetListing.seller?.isCollegeVerified
      },
      requester: {
        id: requesterId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        department: user.department || 'General Studies',
        year: user.year || 'Student',
        isCollegeVerified: !!user.isCollegeVerified
      },
      type: exchangeType,
      offeredListing: validatedOfferedId ? await listingStore.getById(validatedOfferedId) : null,
      proposedMeetingTime: meetingTime,
      proposedSpot: meetingSpot,
      message: message?.trim() || '',
      status: 'pending',
      ownerConfirmedHandover: false,
      requesterConfirmedHandover: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'pending',
          changedBy: requesterId,
          note: 'Request created',
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.memoryRequests.unshift(memoryObj);

    // Send in-app notification to listing owner
    await notificationStore.create({
      recipient: targetOwnerId,
      sender: requesterId,
      type: 'request_received',
      exchangeRequest: memoryObj.id,
      listing: targetListing.id,
      title: `New ${exchangeType.toUpperCase()} Request: ${targetListing.title}`,
      message: `${user.name} proposed a meetup at ${meetingSpot}. Note: "${message?.trim() || 'Ready to exchange'}"`
    });

    return memoryObj;
  }

  /**
   * Get requests filtered by user and role ('incoming' | 'outgoing' | 'all')
   */
  async getAll({ userId, role = 'all', status } = {}) {
    const userIdStr = this._getUserId(userId);

    if (isDatabaseConnected()) {
      try {
        const query = {};

        if (userIdStr) {
          if (role === 'incoming') {
            query.owner = userIdStr;
          } else if (role === 'outgoing') {
            query.requester = userIdStr;
          } else {
            query.$or = [{ owner: userIdStr }, { requester: userIdStr }];
          }
        }

        if (status && status !== 'all') {
          query.status = status;
        }

        const items = await ExchangeRequest.find(query)
          .sort({ createdAt: -1 })
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        return items.map(item => ({
          ...item,
          id: item._id.toString()
        }));
      } catch (err) {
        console.warn('DB ExchangeRequest query fallback:', err.message);
      }
    }

    // In-Memory Filtering
    return this.memoryRequests.filter(item => {
      const ownerId = (item.owner?.id || item.owner?._id || item.owner || '').toString();
      const reqId = (item.requester?.id || item.requester?._id || item.requester || '').toString();

      if (userIdStr) {
        if (role === 'incoming' && ownerId !== userIdStr) return false;
        if (role === 'outgoing' && reqId !== userIdStr) return false;
        if (role === 'all' && ownerId !== userIdStr && reqId !== userIdStr) return false;
      }

      if (status && status !== 'all' && item.status !== status) return false;

      return true;
    });
  }

  /**
   * Get single request details with authorization
   */
  async getById(id, user) {
    const userIdStr = this._getUserId(user);

    if (isDatabaseConnected()) {
      try {
        const item = await ExchangeRequest.findById(id)
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        if (item) {
          const ownerId = item.owner?._id?.toString() || item.owner?.toString();
          const reqId = item.requester?._id?.toString() || item.requester?.toString();

          if (userIdStr && ownerId !== userIdStr && reqId !== userIdStr) {
            const err = new Error('Not authorized to view this exchange request');
            err.status = 403;
            throw err;
          }

          return { ...item, id: item._id.toString() };
        }
      } catch (err) {
        if (err.status) throw err;
      }
    }

    const item = this.memoryRequests.find(r => r.id === id || r._id?.toString() === id);
    if (!item) {
      const err = new Error('Exchange request not found');
      err.status = 404;
      throw err;
    }

    const ownerId = (item.owner?.id || item.owner?._id || item.owner || '').toString();
    const reqId = (item.requester?.id || item.requester?._id || item.requester || '').toString();

    if (userIdStr && ownerId !== userIdStr && reqId !== userIdStr) {
      const err = new Error('Not authorized to view this exchange request');
      err.status = 403;
      throw err;
    }

    return item;
  }

  /**
   * Owner accepts a pending exchange request (reserves target & offered items)
   */
  async accept(id, user) {
    if (!user) {
      const err = new Error('Authentication required to accept requests');
      err.status = 401;
      throw err;
    }

    const userIdStr = this._getUserId(user);
    const request = await this.getById(id, user);

    const ownerId = (request.owner?.id || request.owner?._id || request.owner || '').toString();
    if (ownerId !== userIdStr) {
      const err = new Error('Not authorized: Only the listing owner can accept this request');
      err.status = 403;
      throw err;
    }

    if (request.status !== 'pending') {
      const err = new Error(`Cannot accept request: request is already ${request.status}`);
      err.status = 400;
      throw err;
    }

    const targetListingId = (request.listing?._id || request.listing?.id || request.listing).toString();
    const targetListing = await listingStore.getById(targetListingId);

    // Prevent conflicting reservations
    if (!targetListing || targetListing.status !== 'available') {
      const err = new Error('Cannot accept: The listing is no longer available or is already reserved.');
      err.status = 409;
      err.code = 'LISTING_ALREADY_RESERVED';
      throw err;
    }

    // If swap: verify offered item is also still available
    let offeredListingId = null;
    if (request.type === 'swap' && request.offeredListing) {
      offeredListingId = (request.offeredListing?._id || request.offeredListing?.id || request.offeredListing).toString();
      const offeredListing = await listingStore.getById(offeredListingId);
      if (!offeredListing || offeredListing.status !== 'available') {
        const err = new Error('Cannot accept: The offered swap item is no longer available.');
        err.status = 400;
        err.code = 'OFFERED_ITEM_NOT_AVAILABLE';
        throw err;
      }
    }

    // 1. Reserve target listing
    await listingStore.internalUpdateStatus(targetListingId, 'reserved');

    // 2. Reserve offered listing if swap
    if (offeredListingId) {
      await listingStore.internalUpdateStatus(offeredListingId, 'reserved');
    }

    // 3. Update request status to accepted
    if (isDatabaseConnected()) {
      try {
        const updated = await ExchangeRequest.findByIdAndUpdate(
          id,
          {
            $set: { status: 'accepted' },
            $push: {
              statusHistory: {
                status: 'accepted',
                changedBy: userIdStr,
                note: 'Proposal accepted by owner; items reserved',
                timestamp: new Date()
              }
            }
          },
          { new: true }
        )
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        // Notify requester
        const requesterId = (request.requester?._id || request.requester?.id || request.requester).toString();
        await notificationStore.create({
          recipient: requesterId,
          sender: userIdStr,
          type: 'request_accepted',
          exchangeRequest: id,
          listing: targetListingId,
          title: `Proposal Accepted: ${targetListing.title}`,
          message: `${user.name} accepted your proposal! Items are reserved. Scheduled for: ${request.proposedMeetingTime}.`
        });

        return { ...updated, id: updated._id.toString() };
      } catch (err) {
        console.warn('DB ExchangeRequest accept fallback:', err.message);
      }
    }

    // In-memory update
    const index = this.memoryRequests.findIndex(r => r.id === id || r._id?.toString() === id);
    if (index !== -1) {
      this.memoryRequests[index] = {
        ...this.memoryRequests[index],
        status: 'accepted',
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(this.memoryRequests[index].statusHistory || []),
          {
            status: 'accepted',
            changedBy: userIdStr,
            note: 'Proposal accepted by owner; items reserved',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }

    // Notify requester
    const requesterId = (request.requester?._id || request.requester?.id || request.requester).toString();
    await notificationStore.create({
      recipient: requesterId,
      sender: userIdStr,
      type: 'request_accepted',
      exchangeRequest: id,
      listing: targetListingId,
      title: `Proposal Accepted: ${targetListing.title}`,
      message: `${user.name} accepted your proposal! Items are reserved. Scheduled for: ${request.proposedMeetingTime}.`
    });

    return this.memoryRequests[index];
  }

  /**
   * Owner rejects a pending exchange request
   */
  async reject(id, user, reason = '') {
    if (!user) {
      const err = new Error('Authentication required to decline requests');
      err.status = 401;
      throw err;
    }

    const userIdStr = this._getUserId(user);
    const request = await this.getById(id, user);

    const ownerId = (request.owner?.id || request.owner?._id || request.owner || '').toString();
    if (ownerId !== userIdStr) {
      const err = new Error('Not authorized: Only the listing owner can decline this request');
      err.status = 403;
      throw err;
    }

    if (request.status !== 'pending') {
      const err = new Error(`Cannot decline request: request is already ${request.status}`);
      err.status = 400;
      throw err;
    }

    const targetListingId = (request.listing?._id || request.listing?.id || request.listing).toString();

    if (isDatabaseConnected()) {
      try {
        const updated = await ExchangeRequest.findByIdAndUpdate(
          id,
          {
            $set: { status: 'rejected' },
            $push: {
              statusHistory: {
                status: 'rejected',
                changedBy: userIdStr,
                note: reason || 'Declined by seller',
                timestamp: new Date()
              }
            }
          },
          { new: true }
        )
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        // Notify requester
        const requesterId = (request.requester?._id || request.requester?.id || request.requester).toString();
        await notificationStore.create({
          recipient: requesterId,
          sender: userIdStr,
          type: 'request_rejected',
          exchangeRequest: id,
          listing: targetListingId,
          title: `Proposal Declined: ${request.listing?.title || 'Campus Item'}`,
          message: reason ? `Seller note: "${reason}"` : 'The seller was unable to accept your proposal at this time.'
        });

        return { ...updated, id: updated._id.toString() };
      } catch (err) {
        console.warn('DB ExchangeRequest reject fallback:', err.message);
      }
    }

    // In-memory update
    const index = this.memoryRequests.findIndex(r => r.id === id || r._id?.toString() === id);
    if (index !== -1) {
      this.memoryRequests[index] = {
        ...this.memoryRequests[index],
        status: 'rejected',
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(this.memoryRequests[index].statusHistory || []),
          {
            status: 'rejected',
            changedBy: userIdStr,
            note: reason || 'Declined by seller',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }

    const requesterId = (request.requester?._id || request.requester?.id || request.requester).toString();
    await notificationStore.create({
      recipient: requesterId,
      sender: userIdStr,
      type: 'request_rejected',
      exchangeRequest: id,
      listing: targetListingId,
      title: `Proposal Declined: ${request.listing?.title || 'Campus Item'}`,
      message: reason ? `Seller note: "${reason}"` : 'The seller was unable to accept your proposal at this time.'
    });

    return this.memoryRequests[index];
  }

  /**
   * Requester cancels their pending exchange request
   */
  async cancel(id, user) {
    if (!user) {
      const err = new Error('Authentication required to cancel request');
      err.status = 401;
      throw err;
    }

    const userIdStr = this._getUserId(user);
    const request = await this.getById(id, user);

    const requesterId = (request.requester?.id || request.requester?._id || request.requester || '').toString();
    if (requesterId !== userIdStr) {
      const err = new Error('Not authorized: Only the requesting student can cancel this request');
      err.status = 403;
      throw err;
    }

    if (request.status !== 'pending') {
      const err = new Error(`Cannot cancel request: request is already ${request.status}`);
      err.status = 400;
      throw err;
    }

    const targetListingId = (request.listing?._id || request.listing?.id || request.listing).toString();
    const ownerId = (request.owner?.id || request.owner?._id || request.owner || '').toString();

    if (isDatabaseConnected()) {
      try {
        const updated = await ExchangeRequest.findByIdAndUpdate(
          id,
          {
            $set: { status: 'cancelled' },
            $push: {
              statusHistory: {
                status: 'cancelled',
                changedBy: userIdStr,
                note: 'Cancelled by requester',
                timestamp: new Date()
              }
            }
          },
          { new: true }
        )
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        // Notify owner
        await notificationStore.create({
          recipient: ownerId,
          sender: userIdStr,
          type: 'request_cancelled',
          exchangeRequest: id,
          listing: targetListingId,
          title: `Request Cancelled: ${request.listing?.title || 'Campus Item'}`,
          message: `${user.name} cancelled their exchange request.`
        });

        return { ...updated, id: updated._id.toString() };
      } catch (err) {
        console.warn('DB ExchangeRequest cancel fallback:', err.message);
      }
    }

    // In-memory update
    const index = this.memoryRequests.findIndex(r => r.id === id || r._id?.toString() === id);
    if (index !== -1) {
      this.memoryRequests[index] = {
        ...this.memoryRequests[index],
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(this.memoryRequests[index].statusHistory || []),
          {
            status: 'cancelled',
            changedBy: userIdStr,
            note: 'Cancelled by requester',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }

    // Notify owner
    await notificationStore.create({
      recipient: ownerId,
      sender: userIdStr,
      type: 'request_cancelled',
      exchangeRequest: id,
      listing: targetListingId,
      title: `Request Cancelled: ${request.listing?.title || 'Campus Item'}`,
      message: `${user.name} cancelled their exchange request.`
    });

    return this.memoryRequests[index];
  }

  /**
   * Confirm handover and mark exchange as completed
   */
  async complete(id, user) {
    if (!user) {
      const err = new Error('Authentication required to complete exchange');
      err.status = 401;
      throw err;
    }

    const userIdStr = this._getUserId(user);
    const request = await this.getById(id, user);

    const ownerId = (request.owner?.id || request.owner?._id || request.owner || '').toString();
    const requesterId = (request.requester?.id || request.requester?._id || request.requester || '').toString();

    if (userIdStr !== ownerId && userIdStr !== requesterId) {
      const err = new Error('Not authorized: Only participants can complete this exchange');
      err.status = 403;
      throw err;
    }

    if (request.status !== 'accepted') {
      const err = new Error(`Cannot complete exchange: request must be accepted first (currently ${request.status})`);
      err.status = 400;
      throw err;
    }

    const targetListingId = (request.listing?._id || request.listing?.id || request.listing).toString();
    const offeredListingId = request.offeredListing ? (request.offeredListing?._id || request.offeredListing?.id || request.offeredListing).toString() : null;

    // 1. Mark target listing as completed
    await listingStore.internalUpdateStatus(targetListingId, 'completed');

    // 2. Mark offered listing as completed if swap
    if (offeredListingId) {
      await listingStore.internalUpdateStatus(offeredListingId, 'completed');
    }

    // 3. Award Eco-Karma to both students in database if connected
    if (isDatabaseConnected()) {
      try {
        await User.findByIdAndUpdate(ownerId, {
          $inc: { karmaScore: 50, itemsReused: 1 }
        });
        await User.findByIdAndUpdate(requesterId, {
          $inc: { karmaScore: 50, itemsReused: 1 }
        });
      } catch (err) {
        console.warn('Karma award DB fallback:', err.message);
      }
    }

    // 4. Update request status to completed
    if (isDatabaseConnected()) {
      try {
        const updated = await ExchangeRequest.findByIdAndUpdate(
          id,
          {
            $set: {
              status: 'completed',
              completedAt: new Date(),
              ownerConfirmedHandover: true,
              requesterConfirmedHandover: true
            },
            $push: {
              statusHistory: {
                status: 'completed',
                changedBy: userIdStr,
                note: `Handover confirmed and completed by ${user.name}`,
                timestamp: new Date()
              }
            }
          },
          { new: true }
        )
          .populate('listing')
          .populate('offeredListing')
          .populate('owner', 'name email avatar department year campus isCollegeVerified karmaScore')
          .populate('requester', 'name email avatar department year campus isCollegeVerified karmaScore')
          .lean();

        // Send celebration notifications to both
        await notificationStore.create({
          recipient: ownerId,
          sender: userIdStr,
          type: 'handover_completed',
          exchangeRequest: id,
          listing: targetListingId,
          title: '🎉 Campus Exchange Completed!',
          message: `Handover confirmed for "${request.listing?.title}". You earned +50 Eco-Karma!`
        });

        await notificationStore.create({
          recipient: requesterId,
          sender: userIdStr,
          type: 'handover_completed',
          exchangeRequest: id,
          listing: targetListingId,
          title: '🎉 Campus Exchange Completed!',
          message: `Handover confirmed for "${request.listing?.title}". You earned +50 Eco-Karma!`
        });

        return { ...updated, id: updated._id.toString() };
      } catch (err) {
        console.warn('DB ExchangeRequest complete fallback:', err.message);
      }
    }

    // In-memory update
    const index = this.memoryRequests.findIndex(r => r.id === id || r._id?.toString() === id);
    if (index !== -1) {
      this.memoryRequests[index] = {
        ...this.memoryRequests[index],
        status: 'completed',
        completedAt: new Date().toISOString(),
        ownerConfirmedHandover: true,
        requesterConfirmedHandover: true,
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(this.memoryRequests[index].statusHistory || []),
          {
            status: 'completed',
            changedBy: userIdStr,
            note: `Handover confirmed and completed by ${user.name}`,
            timestamp: new Date().toISOString()
          }
        ]
      };
    }

    // Send notifications
    await notificationStore.create({
      recipient: ownerId,
      sender: userIdStr,
      type: 'handover_completed',
      exchangeRequest: id,
      listing: targetListingId,
      title: '🎉 Campus Exchange Completed!',
      message: `Handover confirmed for "${request.listing?.title}". You earned +50 Eco-Karma!`
    });

    await notificationStore.create({
      recipient: requesterId,
      sender: userIdStr,
      type: 'handover_completed',
      exchangeRequest: id,
      listing: targetListingId,
      title: '🎉 Campus Exchange Completed!',
      message: `Handover confirmed for "${request.listing?.title}". You earned +50 Eco-Karma!`
    });

    return this.memoryRequests[index];
  }
}

export const exchangeStore = new ExchangeStore();
