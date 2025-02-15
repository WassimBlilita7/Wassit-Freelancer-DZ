import express from "express";
import { applyToPost, createPost, deletePost, getAllPosts, getPostById, updateApplicationStatus, updatePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllPosts);
router.post("/createPost",protect, createPost);
router.get("/:id", getPostById);
router.post("/:id/apply", protect, applyToPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:postId/applications/:applicationId", protect, updateApplicationStatus);


export default router;