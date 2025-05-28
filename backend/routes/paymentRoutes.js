import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { initiatePayment, verifyPayment, getPaymentStatus, getPaymentHistory, downloadPaymentReceipt } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", protect, initiatePayment);
router.post("/verify", protect, verifyPayment);
router.get("/:postId/status", protect, getPaymentStatus);
router.get("/history", protect, getPaymentHistory);
router.get("/:paymentId/receipt", protect, downloadPaymentReceipt);

export default router; 