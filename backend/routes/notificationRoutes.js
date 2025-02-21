
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markNotificationAsRead);

export default router;