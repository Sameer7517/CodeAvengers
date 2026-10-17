import express from 'express';
import { 
  getListings, 
  getListingById, 
  createListing, 
  updateListing,
  updateListingStatus,
  deleteListing,
  requestExchange,
  getCategories 
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// Public discovery routes
router.get('/', getListings);
router.get('/categories', getCategories);
router.get('/:id', getListingById);

// Exchange proposal route (validates availability status)
router.post('/:id/request-exchange', optionalAuth, requestExchange);

// Protected authenticated routes (enforce ownership)
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.patch('/:id/status', protect, updateListingStatus);
router.delete('/:id', protect, deleteListing);

export default router;
