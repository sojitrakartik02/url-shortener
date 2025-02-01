import express from "express";
import {
  getAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
} from "../controllers/analyticsController.js";
import { authenticateJWT } from "../middlewares/auth.js";
import { analyticsLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();
router.get("/analytics/*", authenticateJWT, analyticsLimiter);
router.get("/:alias", authenticateJWT, getAnalytics);
router.get("/topic/:topic", authenticateJWT, getTopicAnalytics);
router.get("/analytics/overall", authenticateJWT, getOverallAnalytics);

export default router;
