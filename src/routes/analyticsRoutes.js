import express from "express";
import {
  getAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
} from "../controllers/analyticsController.js";
import { authenticateJWT } from "../middlewares/auth.js";
import { analyticsLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

// Apply rate limiting and authentication middleware to all analytics routes
router.use("/analytics/*", authenticateJWT, analyticsLimiter);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics related to short URLs
 */

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific shortened URL
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The short alias of the URL
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data for the URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 100
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 80
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-01-01"
 *                       count:
 *                         type: integer
 *                         example: 50
 *       404:
 *         description: URL not found
 */

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic to get analytics for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data for the topic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 200
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 150
 *       404:
 *         description: Topic not found
 */

/**
 * @swagger
 * /api/analytics/analytics/overall:
 *   get:
 *     summary: Get overall analytics for all URLs
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 1000
 *                 totalUniqueUsers:
 *                   type: integer
 *                   example: 800
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-01-01"
 *                       count:
 *                         type: integer
 *                         example: 200
 */

router.get("/:alias", authenticateJWT, getAnalytics);
router.get("/topic/:topic", authenticateJWT, getTopicAnalytics);
router.get("/analytics/overall", getOverallAnalytics);

export default router;
