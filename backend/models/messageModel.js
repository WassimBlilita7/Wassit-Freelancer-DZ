import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *         - content
 *       properties:
 *         sender:
 *           type: string
 *           description: ID of the user sending the message
 *         receiver:
 *           type: string
 *           description: ID of the user receiving the message
 *         content:
 *           type: string
 *           description: Content of the message
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of attached files
 *         isRead:
 *           type: boolean
 *           default: false
 *           description: Whether the message has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    type: String
  }],
  read: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;