import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Offer:
 *       type: object
 *       required:
 *         - post
 *         - freelancer
 *         - amount
 *         - deliveryTime
 *       properties:
 *         post:
 *           type: string
 *           description: ID of the post this offer is for
 *         freelancer:
 *           type: string
 *           description: ID of the freelancer making the offer
 *         amount:
 *           type: number
 *           description: Proposed amount for the project
 *         deliveryTime:
 *           type: number
 *           description: Estimated delivery time in days
 *         description:
 *           type: string
 *           description: Detailed description of the offer
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           default: pending
 *           description: Current status of the offer
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of attached files
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

const offerSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryTime: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    attachments: [{
        type: String
    }]
}, {
    timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer; 