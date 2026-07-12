import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getGlobalSettings, updateGlobalSettings } from "../controllers/settings.js";

const router = express.Router();

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (Admin Only)
router.get(
  "/",
  protect,
  authorize("Admin"),
  getGlobalSettings
);

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Admin Only)
router.put(
  "/",
  protect,
  authorize("Admin"),
  updateGlobalSettings
);

export default router;
