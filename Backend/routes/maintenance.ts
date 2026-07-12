import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getMaintenanceLogs,
  createMaintenanceLogHandler,
  updateMaintenanceLogHandler,
} from "../controllers/maintenance.js";

const router = express.Router();

// @desc    Get all maintenance logs
// @route   GET /api/maintenance
// @access  Private (Fleet Manager)
router.get(
  "/",
  protect,
  authorize("Fleet Manager"),
  getMaintenanceLogs
);

// @desc    Create a maintenance log (and set vehicle to In Shop)
// @route   POST /api/maintenance
// @access  Private (Fleet Manager)
router.post(
  "/",
  protect,
  authorize("Fleet Manager"),
  createMaintenanceLogHandler
);

// @desc    Update a maintenance log (e.g. close maintenance, updates vehicle status)
// @route   PUT /api/maintenance/:id
// @access  Private (Fleet Manager)
router.put(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  updateMaintenanceLogHandler
);

export default router;
