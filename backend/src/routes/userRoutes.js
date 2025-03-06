import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserSkills } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user skills and interests
router.put('/update-skills',protect , updateUserSkills);

export default router;