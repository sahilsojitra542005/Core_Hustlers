import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getDashboard, getReports } from "../controllers/analytics.js";

const router = express.Router();

// @desc    Get dashboard KPIs and recent trips (supports filters)
// @route   GET /api/analytics/dashboard
// @access  Private (Dispatcher, Financial Analyst)
router.get(
  "/dashboard",
  protect,
  authorize("Dispatcher", "Financial Analyst"),
  getDashboard
);

// @desc    Get reports & analytics page metrics
// @route   GET /api/analytics/reports
// @access  Private (Financial Analyst)
router.get(
  "/reports",
  protect,
  authorize("Financial Analyst"),
  getReports
);

export default router;
