import express from "express";
import { deleteMessage, getConversation, markAsRead, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect,sendMessage);
router.get('/conversation/:userId', protect, getConversation);
router.put('/:messageId/read', protect, markAsRead);
router.delete('/:messageId', protect, deleteMessage);



export default router;