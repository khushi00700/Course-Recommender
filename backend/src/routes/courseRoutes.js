import express from 'express';
import { getRecommendedCourses , getAllCourses } from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all courses
router.get('/', getAllCourses);

// Get recommended courses
router.get('/recommendations', authMiddleware, getRecommendedCourses);

export default router;