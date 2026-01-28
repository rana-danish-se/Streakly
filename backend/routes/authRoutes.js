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
  googleAuth,
  verifyEmail,
  resendOTP,
  uploadProfilePic
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/update-profile', protect, updateProfile);
router.put('/profile-picture', protect, uploadFile.single('image'), uploadProfilePic);

export default router;
