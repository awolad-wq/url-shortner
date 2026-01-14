import express from "express";
import {
  checkUrlHealth,
  createShortUrl,
  deleteLink,
  getAllLinks,
  getUrl,
  getUrlStats,
  getUserLinks,
  getUserStats,
  updateLink,
} from "../controllers/short.controller.js";
import { authenticate, optionalAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/shorten", optionalAuth, createShortUrl);

// User routes
router.get("/user/links", authenticate, getUserLinks);
router.get("/user/stats", authenticate, getUserStats);

// Admin routes
router.get("/admin/links", authenticate, requireRole("ADMIN"), getAllLinks);

// Alias-specific routes (LAST)
router.get("/:alias/stats", optionalAuth, getUrlStats);
router.post("/:alias/check", authenticate, checkUrlHealth);
router.patch("/:alias", authenticate, updateLink);
router.delete("/:alias", authenticate, deleteLink);
router.get("/:alias", getUrl);



export default router;
