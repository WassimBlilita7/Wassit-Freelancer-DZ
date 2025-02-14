import express from "express";
import { applyToPost, createPost, getAllPosts, getPostById } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllPosts);
router.post("/createPost",protect, createPost);
router.get("/:id", getPostById);
router.post("/:id/apply", protect, applyToPost);

export default router;