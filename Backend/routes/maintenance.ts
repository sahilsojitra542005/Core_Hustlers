import express, { Response } from "express";
import MaintenanceLog from "../models/MaintenanceLog.js";
import Vehicle from "../models/Vehicle.js";
import Expense from "../models/Expense.js";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";

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
      const logs = await MaintenanceLog.find()
        .populate("vehicle")
        .sort({ createdAt: -1 });
      return res.json(logs);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    const { vehicleId, maintenanceType, cost, startDate, description, status } = req.body;

    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const logStatus = status || "Active";

      const log = await MaintenanceLog.create({
        vehicle: vehicleId,
        maintenanceType,
        cost,
        startDate: startDate || new Date(),
        status: logStatus,
        description,
      });

      // Update vehicle status
      if (logStatus === "Active") {
        vehicle.status = "In Shop";
        await vehicle.save();
      } else if (logStatus === "Closed") {
        if (vehicle.status !== "Retired") {
          vehicle.status = "Available";
          await vehicle.save();
        }

        // Write expense record when closed
        await Expense.create({
          vehicle: vehicle._id,
          maintenanceCost: cost,
          toll: 0,
          other: 0,
          date: new Date(),
          description: `Linked maintenance: ${maintenanceType}`,
        });
      }

      return res.status(201).json(log);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    const { status, endDate, cost, maintenanceType, description } = req.body;

    try {
      const log = await MaintenanceLog.findById(req.params.id);
      if (!log) {
        return res.status(404).json({ message: "Maintenance log not found" });
      }

      const vehicle = await Vehicle.findById(log.vehicle);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle associated with log not found" });
      }

      const oldStatus = log.status;
      const newStatus = status || log.status;

      if (cost !== undefined) log.cost = cost;
      if (maintenanceType !== undefined) log.maintenanceType = maintenanceType;
      if (description !== undefined) log.description = description;
      if (endDate !== undefined) log.endDate = endDate;
      log.status = newStatus;

      // Check transition
      if (oldStatus === "Active" && newStatus === "Closed") {
        log.endDate = endDate || new Date();
        if (vehicle.status !== "Retired") {
          vehicle.status = "Available";
          await vehicle.save();
        }

        // Automatically push an Expense record when maintenance is closed
        await Expense.create({
          vehicle: vehicle._id,
          maintenanceCost: log.cost,
          toll: 0,
          other: 0,
          date: log.endDate,
          description: `Linked maintenance: ${log.maintenanceType}`,
        });
      } else if (oldStatus === "Closed" && newStatus === "Active") {
        vehicle.status = "In Shop";
        await vehicle.save();
      }

      const updatedLog = await log.save();
      return res.json(updatedLog);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
