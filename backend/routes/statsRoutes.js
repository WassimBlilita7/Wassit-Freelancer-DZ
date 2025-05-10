import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getClientStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/client", protect, getClientStats);

export default router; 