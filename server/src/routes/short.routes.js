import express from "express";
import {
  createShortUrl,
  getUrl,
  getUrlStats,
} from "../controllers/short.controller.js";

const router = express.Router();

// POST /api/v2/shorten - Create short URL
router.post("/shorten", createShortUrl);

// GET /api/v2/stats/:alias - Get link statistics
router.get("/stats/:alias", getUrlStats);

// GET /api/v2/:alias - Redirect to original URL (must be last)
router.get("/:alias", getUrl);

export default router;
