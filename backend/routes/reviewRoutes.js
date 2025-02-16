import express from 'express';
import { addReview, deleteReview, getFreelancerReviews, updateReview } from '../controllers/reviewContoller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/" , protect , addReview);
router.get('/freelancer/:freelancerId', getFreelancerReviews); 
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;