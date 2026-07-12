import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getGlobalSettings, updateGlobalSettings } from "../controllers/settings.js";

const router = express.Router();

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (All Roles)
router.get(
  "/",
  protect,
  getGlobalSettings
);

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Fleet Manager)
router.put(
  "/",
  protect,
  authorize("Fleet Manager"),
  updateGlobalSettings
);

export default router;
