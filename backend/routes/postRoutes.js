import express from "express";
import { createPost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Liste des posts");
});

router.post("/createPost",protect, createPost);

export default router;