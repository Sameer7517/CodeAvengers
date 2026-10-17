import express from 'express';
import { 
  getListings, 
  getListingById, 
  createListing, 
  getCategories 
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.get('/categories', getCategories);
router.get('/:id', getListingById);
router.post('/', createListing);

export default router;
