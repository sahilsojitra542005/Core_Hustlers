import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getFuelLogs,
  createFuelLogHandler,
  getOtherExpenses,
  createOtherExpenseHandler,
  getExpenseSummaryHandler,
} from "../controllers/expenses.js";

const router = express.Router();

// @desc    Get all fuel logs
// @route   GET /api/expenses/fuel
// @access  Private (Financial Analyst)
router.get(
  "/fuel",
  protect,
  authorize("Financial Analyst"),
  getFuelLogs
);

// @desc    Create a fuel log
// @route   POST /api/expenses/fuel
// @access  Private (Financial Analyst)
router.post(
  "/fuel",
  protect,
  authorize("Financial Analyst"),
  createFuelLogHandler
);

// @desc    Get all other expenses
// @route   GET /api/expenses/other
// @access  Private (Financial Analyst)
router.get(
  "/other",
  protect,
  authorize("Financial Analyst"),
  getOtherExpenses
);

// @desc    Create other expense manually
// @route   POST /api/expenses/other
// @access  Private (Financial Analyst)
router.post(
  "/other",
  protect,
  authorize("Financial Analyst"),
  createOtherExpenseHandler
);

// @desc    Get total operational cost summary
// @route   GET /api/expenses/summary
// @access  Private (Financial Analyst)
router.get(
  "/summary",
  protect,
  authorize("Financial Analyst"),
  getExpenseSummaryHandler
);

export default router;
