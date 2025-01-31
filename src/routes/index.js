import { Router } from "express";
import authRoutes from "./authRoutes.js";
import urlRoutes from "./urlRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/url", urlRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
