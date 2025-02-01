import express from "express";
import { createShortUrl, redirectUrl } from "../controllers/urlController.js";
import { authenticateJWT } from "../middlewares/auth.js";
import { createUrlLimiter } from "../middlewares/rateLimit.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: URL
 *   description: Operations related to URL shortening and redirection
 */

/**
 * @swagger
 * /api/url/{alias}:
 *   get:
 *     summary: Redirects to the original URL
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The short alias of the URL
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully redirected to the original URL
 *       404:
 *         description: URL not found
 */
router.get("/:alias", redirectUrl);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/url/shorten:
 *   post:
 *     summary: Create a new short URL
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://www.example.com"
 *               customAlias:
 *                 type: string
 *                 example: "example"
 *               topic:
 *                 type: string
 *                 example: "Tech"
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "http://localhost:5000/example"
 *                 createdAt:
 *                   type: string
 *                   example: "2025-02-01T12:00:00Z"
 *       400:
 *         description: Invalid URL or alias already exists
 */
router.post("/shorten", authenticateJWT, createUrlLimiter, createShortUrl);

export default router;
