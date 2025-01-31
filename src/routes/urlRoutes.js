import express from "express";
import { createShortUrl, redirectUrl } from "../controllers/urlController.js";
import { authenticateJWT, createUrlLimiter } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:alias", redirectUrl);
router.post("/shorten", authenticateJWT, createUrlLimiter, createShortUrl);

export default router;
