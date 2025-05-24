import express from "express";
import { applyToPost, createPost, deletePost, getAllPosts, getPostById, searchPosts, updateApplicationStatus, updateFreelancerApplication, updatePost, submitFinalization, acceptFinalization, getAcceptedPostsForFreelancer, rejectFinalization } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload, uploadCV, uploadProjectFiles } from "../utils/upload.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */
router.get("/",protect, getAllPosts);

/**
 * @swagger
 * /api/v1/post/createPost:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - skillsRequired
 *               - budget
 *               - duration
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               skillsRequired:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: number
 *               duration:
 *                 type: string
 *                 enum: [1j, 7j, 15j, 1mois, 3mois, 6mois, +1an]
 *               category:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/createPost",protect, upload.single('picture'), createPost);

/**
 * @swagger
 * /api/v1/post/accepted:
 *   get:
 *     summary: Get accepted posts for freelancer
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accepted posts
 */
router.get("/accepted", protect, getAcceptedPostsForFreelancer);

/**
 * @swagger
 * /api/v1/post/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /api/v1/post/{id}/apply:
 *   post:
 *     summary: Apply to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cv
 *               - coverLetter
 *               - bidAmount
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *               coverLetter:
 *                 type: string
 *               bidAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       400:
 *         description: Invalid input
 */
router.post("/:id/apply", protect, uploadCV.single('cv'), applyToPost);

/**
 * @swagger
 * /api/v1/post/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               skillsRequired:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: number
 *               duration:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect,upload.single('picture'), updatePost);

/**
 * @swagger
 * /api/v1/post/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deletePost);

/**
 * @swagger
 * /api/v1/post/{postId}/applications/{applicationId}:
 *   put:
 *     summary: Update application status
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *     responses:
 *       200:
 *         description: Application status updated successfully
 */
router.put("/:postId/applications/:applicationId", protect, updateApplicationStatus);

/**
 * @swagger
 * /api/v1/post/{postId}/applications/{applicationId}/update:
 *   put:
 *     summary: Update freelancer application
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               bidAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Application updated successfully
 */
router.put("/:postId/applications/:applicationId/update", protect, updateFreelancerApplication);

/**
 * @swagger
 * /api/v1/post/search:
 *   post:
 *     summary: Search posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.post("/search", protect, searchPosts);

/**
 * @swagger
 * /api/v1/post/{id}/finalize:
 *   post:
 *     summary: Submit project finalization
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Project submitted successfully
 */
router.post("/:id/finalize", protect, uploadProjectFiles.array('files', 5), submitFinalization);

/**
 * @swagger
 * /api/v1/post/{id}/accept-finalization:
 *   put:
 *     summary: Accept project finalization
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project accepted successfully
 */
router.put("/:id/accept-finalization", protect, acceptFinalization);

/**
 * @swagger
 * /api/v1/post/{id}/reject-finalization:
 *   put:
 *     summary: Reject project finalization
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project rejected successfully
 */
router.put("/:id/reject-finalization", protect, rejectFinalization);

export default router;