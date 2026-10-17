import { circularSwapStore } from '../services/circularSwapStore.js';

/**
 * Discovers circular swap suggestions (2-way and 3-way cycles)
 * Transparent matching algorithm based on available listings and desired preferences.
 */
export const getCycleSuggestions = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.query.userId || null;
    const category = req.query.category || null;

    const result = await circularSwapStore.findCycles({ userId, category });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching cycle suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error discovering circular swap cycles',
      error: error.message
    });
  }
};

/**
 * Initiates a formal circular swap proposal from a suggestion.
 * Sets initiator to 'accepted' and sends explicit consent requests to others.
 */
export const proposeCycle = async (req, res) => {
  try {
    const { cycleData } = req.body;
    if (!cycleData) {
      return res.status(400).json({
        success: false,
        message: 'cycleData is required to propose a circular loop'
      });
    }

    const proposal = await circularSwapStore.proposeCycle({
      cycleData,
      initiatorUser: req.user
    });

    res.status(201).json({
      success: true,
      message: 'Circular swap proposal initiated. Awaiting explicit consent from all participants.',
      data: proposal
    });
  } catch (error) {
    console.error('Error creating circular proposal:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to initiate circular proposal'
    });
  }
};

/**
 * Participant responds to proposal ('accepted' or 'declined')
 * If declined: cancelled without reservation.
 * If all accept: revalidates item availability before finalizing exchange.
 */
export const respondToProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, note } = req.body;

    if (!decision) {
      return res.status(400).json({
        success: false,
        message: 'Decision ("accepted" or "declined") is required'
      });
    }

    const updatedProposal = await circularSwapStore.respondToProposal({
      proposalId: id,
      user: req.user,
      decision,
      note
    });

    res.json({
      success: true,
      message: `Proposal response registered: ${decision}`,
      data: updatedProposal
    });
  } catch (error) {
    console.error('Error responding to proposal:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit proposal response'
    });
  }
};

/**
 * Retrieves proposals for current user
 */
export const getUserProposals = async (req, res) => {
  try {
    const proposals = await circularSwapStore.getProposalsForUser(req.user.id || req.user._id);
    res.json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    console.error('Error fetching user proposals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving circular proposals',
      error: error.message
    });
  }
};

/**
 * Retrieves single proposal detail
 */
export const getProposalDetail = async (req, res) => {
  try {
    const proposal = await circularSwapStore.getProposalById(req.params.id);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Circular proposal not found'
      });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Error fetching proposal detail:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving proposal details',
      error: error.message
    });
  }
};
