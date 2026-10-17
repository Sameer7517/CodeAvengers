import express from 'express';
import {
  getCycleSuggestions,
  proposeCycle,
  respondToProposal,
  getUserProposals,
  getProposalDetail
} from '../controllers/circularSwapController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / optionally authenticated discovery endpoint
router.get('/suggestions', optionalAuth, getCycleSuggestions);

// Authenticated circular proposal workflows
router.use(protect);
router.get('/proposals', getUserProposals);
router.get('/proposals/:id', getProposalDetail);
router.post('/propose', proposeCycle);
router.post('/proposals/:id/respond', respondToProposal);

export default router;
