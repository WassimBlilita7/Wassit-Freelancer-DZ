import express from "express";
import { deleteMessage, getConversation, markAsRead, sendMessage, getUserConversations } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect,sendMessage);
router.get('/conversation/:userId', protect, getConversation);
router.put('/:messageId/read', protect, markAsRead);
router.delete('/:messageId', protect, deleteMessage);
router.get('/conversations', protect, getUserConversations);



export default router;