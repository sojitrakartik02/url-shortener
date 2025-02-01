import express from "express";
import { createShortUrl, redirectUrl } from "../controllers/urlController.js";
import { authenticateJWT } from "../middlewares/auth.js";
import {createUrlLimiter} from '../middlewares/rateLimit.js'
const router = express.Router();

router.get("/:alias", redirectUrl);
router.post("/shorten", authenticateJWT, createUrlLimiter, createShortUrl);

export default router;
