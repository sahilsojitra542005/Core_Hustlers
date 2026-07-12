import express, { Response } from "express";
import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";
import Vehicle from "../models/Vehicle.js";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// FUEL LOGS
// ==========================================

// @desc    Get all fuel logs
// @route   GET /api/expenses/fuel
// @access  Private (Financial Analyst, Fleet Manager)
router.get(
  "/fuel",
  protect,
  authorize("Financial Analyst", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const fuelLogs = await FuelLog.find()
        .populate("vehicle")
        .sort({ date: -1 });
      return res.json(fuelLogs);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Create a fuel log
// @route   POST /api/expenses/fuel
// @access  Private (Financial Analyst)
router.post(
  "/fuel",
  protect,
  authorize("Financial Analyst"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const { vehicleId, liters, cost, date } = req.body;

    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const log = await FuelLog.create({
        vehicle: vehicleId,
        liters,
        cost,
        date: date || new Date(),
      });

      return res.status(201).json(log);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// ==========================================
// OTHER EXPENSES (TOLLS & MISC)
// ==========================================

// @desc    Get all other expenses
// @route   GET /api/expenses/other
// @access  Private (Financial Analyst, Fleet Manager)
router.get(
  "/other",
  protect,
  authorize("Financial Analyst", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const expenses = await Expense.find()
        .populate("vehicle")
        .populate("trip")
        .sort({ date: -1 });
      return res.json(expenses);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Create other expense manually
// @route   POST /api/expenses/other
// @access  Private (Financial Analyst)
router.post(
  "/other",
  protect,
  authorize("Financial Analyst"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const { tripId, vehicleId, toll, other, date, description } = req.body;

    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const expense = await Expense.create({
        trip: tripId || null,
        vehicle: vehicleId,
        toll: toll || 0,
        other: other || 0,
        maintenanceCost: 0,
        date: date || new Date(),
        description,
      });

      return res.status(201).json(expense);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get total operational cost summary
// @route   GET /api/expenses/summary
// @access  Private (Financial Analyst, Fleet Manager)
router.get(
  "/summary",
  protect,
  authorize("Financial Analyst", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const fuelTotalResult = await FuelLog.aggregate([
        { $group: { _id: null, total: { $sum: "$cost" } } },
      ]);
      const fuelTotal = fuelTotalResult[0]?.total || 0;

      const expenseTotalResult = await Expense.aggregate([
        {
          $group: {
            _id: null,
            totalToll: { $sum: "$toll" },
            totalOther: { $sum: "$other" },
            totalMaint: { $sum: "$maintenanceCost" },
          },
        },
      ]);

      const tollTotal = expenseTotalResult[0]?.totalToll || 0;
      const otherTotal = expenseTotalResult[0]?.totalOther || 0;
      const maintTotal = expenseTotalResult[0]?.totalMaint || 0;

      const grandTotal = fuelTotal + tollTotal + otherTotal + maintTotal;

      return res.json({
        fuelTotal,
        tollTotal,
        otherTotal,
        maintTotal,
        grandTotal,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
