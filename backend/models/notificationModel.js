import mongoose from "mongoose";

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
    enum: ["application_accepted", "new_application", "application_accepted_by_client"], 
    required: true,
  },
  message: {
    type: String,
    required: true, 
  },
  isRead: {
    type: Boolean,
    default: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;