import express, { Response } from "express";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";
import {
  getDashboardAnalytics,
  getReportAnalytics,
} from "../services/analyticsService.js";

const router = express.Router();

// @desc    Get dashboard KPIs and recent trips (supports filters)
// @route   GET /api/analytics/dashboard
// @access  Private (Dispatcher, Safety Officer, Fleet Manager, Financial Analyst)
router.get(
  "/dashboard",
  protect,
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const { vehicleType, region } = req.query as {
        vehicleType?: string;
        region?: string;
      };
      const dashboard = await getDashboardAnalytics({ vehicleType, region });
      return res.json(dashboard);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get reports & analytics page metrics
// @route   GET /api/analytics/reports
// @access  Private (Financial Analyst, Fleet Manager)
router.get(
  "/reports",
  protect,
  authorize("Financial Analyst", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const reports = await getReportAnalytics();
      return res.json(reports);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
