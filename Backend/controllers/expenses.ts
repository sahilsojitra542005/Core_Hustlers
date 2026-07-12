import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  createFuelLog,
  createOtherExpense,
  getExpenseSummary,
  listFuelLogs,
  listOtherExpenses,
} from "../services/expenseService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

// @desc    Get all fuel logs
// @route   GET /api/expenses/fuel
// @access  Private (Financial Analyst, Fleet Manager)
export const getFuelLogs = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const fuelLogs = await listFuelLogs();
    return res.json(fuelLogs);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Create a fuel log
// @route   POST /api/expenses/fuel
// @access  Private (Financial Analyst)
export const createFuelLogHandler = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const log = await createFuelLog(req.body);
    return res.status(201).json(log);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get all other expenses
// @route   GET /api/expenses/other
// @access  Private (Financial Analyst, Fleet Manager)
export const getOtherExpenses = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const expenses = await listOtherExpenses();
    return res.json(expenses);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Create other expense manually
// @route   POST /api/expenses/other
// @access  Private (Financial Analyst)
export const createOtherExpenseHandler = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const expense = await createOtherExpense(req.body);
    return res.status(201).json(expense);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get total operational cost summary
// @route   GET /api/expenses/summary
// @access  Private (Financial Analyst, Fleet Manager)
export const getExpenseSummaryHandler = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const summary = await getExpenseSummary();
    return res.json(summary);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};
