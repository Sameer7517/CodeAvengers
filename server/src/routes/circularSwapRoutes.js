import express from 'express';
import {
  getCycleSuggestions,
  proposeCycle,
  respondToProposal,
  getUserProposals,
  getProposalDetail,
  confirmStepHandover,
  cancelProposal
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
router.post('/proposals/:id/handover', confirmStepHandover);
router.post('/proposals/:id/cancel', cancelProposal);

export default router;
