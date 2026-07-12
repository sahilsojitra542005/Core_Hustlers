import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  getDashboardAnalytics,
  getReportAnalytics,
} from "../services/analyticsService.js";

// @desc    Get dashboard KPIs and recent trips (supports filters)
// @route   GET /api/analytics/dashboard
// @access  Private (Dispatcher, Safety Officer, Fleet Manager, Financial Analyst)
export const getDashboard = async (req: AuthRequest, res: Response): Promise<void | Response> => {
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
};

// @desc    Get reports & analytics page metrics
// @route   GET /api/analytics/reports
// @access  Private (Financial Analyst, Fleet Manager)
export const getReports = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const reports = await getReportAnalytics();
    return res.json(reports);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
