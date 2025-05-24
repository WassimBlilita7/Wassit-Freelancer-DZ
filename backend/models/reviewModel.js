// models/reviewModel.js
import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - client
 *         - freelancer
 *         - post
 *         - rating
 *       properties:
 *         client:
 *           type: string
 *           description: ID of the client who wrote the review
 *         freelancer:
 *           type: string
 *           description: ID of the freelancer being reviewed
 *         post:
 *           type: string
 *           description: ID of the post associated with the review
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given by the client (1-5)
 *         comment:
 *           type: string
 *           description: Detailed review comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */

const reviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au client qui a laissé l'avis
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au freelancer évalué
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Référence à l'offre associée
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;