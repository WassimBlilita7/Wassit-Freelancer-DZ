import express from "express";
import { applyToPost, createPost, deletePost, getAllPosts, getPostById, searchPosts, updateApplicationStatus, updateFreelancerApplication, updatePost, submitFinalization, acceptFinalization, getAcceptedPostsForFreelancer } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload, uploadCV, uploadProjectFiles } from "../utils/upload.js";
const router = express.Router();

router.get("/",protect, getAllPosts);
router.post("/createPost",protect, upload.single('picture'), createPost);
router.get("/accepted", protect, getAcceptedPostsForFreelancer);
router.get("/:id", getPostById);
router.post("/:id/apply", protect, uploadCV.single('cv'), applyToPost);
router.put("/:id", protect,upload.single('picture'), updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:postId/applications/:applicationId", protect, updateApplicationStatus);
router.put("/:postId/applications/:applicationId/update", protect, updateFreelancerApplication);
router.post("/search", protect, searchPosts);
router.post("/:id/finalize", protect, uploadProjectFiles.array('files', 5), submitFinalization);
router.put("/:id/accept-finalization", protect, acceptFinalization);

export default router;