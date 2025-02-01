import express from "express";
import { googleAuth, googleCallback } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Google Login
 *   description: Google Login
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiates Google OAuth authentication
 *     description: Redirects to Google for OAuth authentication.
 *     tags: [Google Login]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get("/google", googleAuth);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google after successful authentication.
 *     tags: [Google Login]
 *     parameters:
 *       - name: code
 *         in: query
 *         description: The authorization code returned by Google after successful login.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful authentication and user info
 *       400:
 *         description: Invalid or missing code
 */

router.get("/google/callback", googleCallback);

export default router;
