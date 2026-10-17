import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createExchangeRequest,
  getExchangeRequests,
  getExchangeRequestById,
  acceptExchangeRequest,
  rejectExchangeRequest,
  cancelExchangeRequest,
  completeExchangeRequest
} from '../controllers/exchangeController.js';

const router = express.Router();

// All exchange endpoints require authenticated student JWT
router.use(protect);

router.route('/')
  .post(createExchangeRequest)
  .get(getExchangeRequests);

router.route('/:id')
  .get(getExchangeRequestById);

router.patch('/:id/accept', acceptExchangeRequest);
router.patch('/:id/reject', rejectExchangeRequest);
router.patch('/:id/cancel', cancelExchangeRequest);
router.patch('/:id/complete', completeExchangeRequest);

export default router;
