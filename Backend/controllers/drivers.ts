import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  createDriver,
  deleteDriver,
  getDriverById,
  listDispatchDrivers,
  listDrivers,
  updateDriver,
} from "../services/driverService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

// @desc    Get all drivers (with filtering and search)
// @route   GET /api/drivers
// @access  Private (Safety Officer, Fleet Manager)
export const getDrivers = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };
    const drivers = await listDrivers({ status, search });
    return res.json(drivers);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get eligible drivers for dispatch selection
// @route   GET /api/drivers/dispatch-selection
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
export const getDispatchDrivers = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const drivers = await listDispatchDrivers();
    return res.json(drivers);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get a single driver profile
// @route   GET /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
export const getDriver = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const driver = await getDriverById(String(req.params.id));
    return res.json(driver);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Create driver profile
// @route   POST /api/drivers
// @access  Private (Safety Officer, Fleet Manager)
export const createNewDriver = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const driver = await createDriver(req.body);
    return res.status(201).json(driver);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Update driver profile
// @route   PUT /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
export const updateDriverProfile = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const driver = await updateDriver(String(req.params.id), req.body);
    return res.json(driver);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Delete driver profile
// @route   DELETE /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
export const deleteDriverProfile = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const result = await deleteDriver(String(req.params.id));
    return res.json(result);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};
