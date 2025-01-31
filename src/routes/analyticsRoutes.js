import express from "express";
import {
  getAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
} from "../controllers/analyticsController.js";
import { analyticsLimiter, authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();
router.get("/analytics/*", authenticateJWT, analyticsLimiter);
router.get("/analytics/:alias", authenticateJWT, getAnalytics);
router.get("/analytics/topic/:topic", authenticateJWT, getTopicAnalytics);
router.get("/analytics/overall", authenticateJWT, getOverallAnalytics);

export default router;
