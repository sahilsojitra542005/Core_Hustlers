import express, { Response } from "express";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";
import {
  createMaintenanceLog,
  listMaintenanceLogs,
  updateMaintenanceLog,
} from "../services/maintenanceService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

const router = express.Router();

// @desc    Get all maintenance logs
// @route   GET /api/maintenance
// @access  Private (Fleet Manager, Dispatcher, Financial Analyst)
router.get(
  "/",
  protect,
  authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const logs = await listMaintenanceLogs();
      return res.json(logs);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Create a maintenance log (and set vehicle to In Shop)
// @route   POST /api/maintenance
// @access  Private (Fleet Manager)
router.post(
  "/",
  protect,
  authorize("Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const log = await createMaintenanceLog(req.body);
      return res.status(201).json(log);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Update a maintenance log (e.g. close maintenance, updates vehicle status)
// @route   PUT /api/maintenance/:id
// @access  Private (Fleet Manager)
router.put(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const log = await updateMaintenanceLog(String(req.params.id), req.body);
      return res.json(log);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

export default router;
