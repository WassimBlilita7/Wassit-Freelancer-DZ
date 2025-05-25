import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - recipient
 *         - type
 *         - message
 *       properties:
 *         recipient:
 *           type: string
 *           description: ID of the user receiving the notification
 *         type:
 *           type: string
 *           enum: [offer, message, system, new_application, application_accepted, application_accepted_by_client, project_submitted, project_completed]
 *           description: Type of notification
 *         message:
 *           type: string
 *           description: Content of the notification
 *         relatedId:
 *           type: string
 *           description: ID of the related entity (offer, message, etc.)
 *         isRead:
 *           type: boolean
 *           default: false
 *           description: Whether the notification has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", 
    required: true,
  },
  type: {
    type: String,
    enum: ["offer", "message", "system", "new_application", "application_accepted", "application_accepted_by_client", "project_submitted", "project_completed"], 
    required: true,
  },
  message: {
    type: String,
    required: true, 
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type'
  },
  isRead: {
    type: Boolean,
    default: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;