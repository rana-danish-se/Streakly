import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  googleAuth
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// Protected routes (require authentication)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/update-profile', protect, updateProfile);

export default router;
