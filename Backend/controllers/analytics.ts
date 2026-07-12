import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  getDashboardAnalytics,
  getReportCsv,
  getReportAnalytics,
  getReportPdf,
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

export const exportReportsCsv = async (
  req: AuthRequest,
  res: Response
): Promise<void | Response> => {
  try {
    const csv = await getReportCsv();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="transitops-reports.csv"');
    return res.send(csv);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportReportsPdf = async (
  req: AuthRequest,
  res: Response
): Promise<void | Response> => {
  try {
    const pdf = await getReportPdf();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="transitops-reports.pdf"');
    return res.send(pdf);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
