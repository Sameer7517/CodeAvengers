import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  verifyCollege, 
  logout 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/verify-college', protect, verifyCollege);

export default router;
