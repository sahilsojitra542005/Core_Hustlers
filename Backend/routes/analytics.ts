import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  exportReportsCsv,
  exportReportsPdf,
  getDashboard,
  getReports,
} from "../controllers/analytics.js";

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
  authorize("Financial Analyst", "Fleet Manager"),
  getReports
);

router.get(
  "/reports/export.csv",
  protect,
  authorize("Financial Analyst", "Fleet Manager"),
  exportReportsCsv
);

router.get(
  "/reports/export.pdf",
  protect,
  authorize("Financial Analyst", "Fleet Manager"),
  exportReportsPdf
);

export default router;
