import rateLimit from "express-rate-limit";

export const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many URL creations from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many analytics requests, please try again later",
});
