import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getClientStats, getClientStatsByUsername, getFreelancerStats, getFreelancerStatsByUsername } from "../controllers/statsController.js";

const router = express.Router();

/**
 * @swagger
 * /stats/client:
 *   get:
 *     summary: Get client statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalOffers:
 *                       type: number
 *                     activeOffers:
 *                       type: number
 *                     completedOffers:
 *                       type: number
 *                     totalBudget:
 *                       type: number
 *                     totalFreelancers:
 *                       type: number
 *                     activeFreelancers:
 *                       type: number
 *       403:
 *         description: Not authorized
 */
router.get("/client", protect, getClientStats);

/**
 * @swagger
 * /stats/client/{username}:
 *   get:
 *     summary: Get client statistics by username
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalOffers:
 *                       type: number
 *                     activeOffers:
 *                       type: number
 *                     completedOffers:
 *                       type: number
 *                     totalBudget:
 *                       type: number
 *                     totalFreelancers:
 *                       type: number
 *                     activeFreelancers:
 *                       type: number
 *       404:
 *         description: Client not found
 */
router.get("/client/:username", getClientStatsByUsername);

/**
 * @swagger
 * /stats/freelancer:
 *   get:
 *     summary: Get freelancer statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Freelancer statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalOffers:
 *                       type: number
 *                     activeOffers:
 *                       type: number
 *                     completedOffers:
 *                       type: number
 *                     totalBudget:
 *                       type: number
 *                     totalFreelancers:
 *                       type: number
 *                     activeFreelancers:
 *                       type: number
 *       403:
 *         description: Not authorized
 */
router.get("/freelancer", protect, getFreelancerStats);

/**
 * @swagger
 * /stats/freelancer/{username}:
 *   get:
 *     summary: Get freelancer statistics by username
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Freelancer statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalOffers:
 *                       type: number
 *                     activeOffers:
 *                       type: number
 *                     completedOffers:
 *                       type: number
 *                     totalBudget:
 *                       type: number
 *                     totalFreelancers:
 *                       type: number
 *                     activeFreelancers:
 *                       type: number
 *       404:
 *         description: Freelancer not found
 */
router.get("/freelancer/:username", getFreelancerStatsByUsername);

export default router; 