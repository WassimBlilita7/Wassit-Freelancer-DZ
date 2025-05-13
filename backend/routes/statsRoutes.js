import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getClientStats, getClientStatsByUsername } from "../controllers/statsController.js";

const router = express.Router();

router.get("/client", protect, getClientStats);
router.get("/client/:username", getClientStatsByUsername);

export default router; 