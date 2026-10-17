import express from 'express';
import { 
  getListings, 
  getListingById, 
  createListing, 
  getCategories 
} from '../controllers/listingController.js';
import { optionalAuth } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

router.get('/', getListings);
router.get('/categories', getCategories);
router.get('/:id', getListingById);
router.post('/', optionalAuth, createListing);

export default router;
