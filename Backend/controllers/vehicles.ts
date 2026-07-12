import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listDispatchVehicles,
  listVehicles,
  updateVehicle,
} from "../services/vehicleService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

// @desc    Get all vehicles (with filters & search)
// @route   GET /api/vehicles
// @access  Private (Fleet Manager, Dispatcher, Financial Analyst)
export const getVehicles = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const { type, status, region, search } = req.query as {
      type?: string;
      status?: string;
      region?: string;
      search?: string;
    };
    const vehicles = await listVehicles({ type, status, region, search });
    return res.json(vehicles);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get only available vehicles for Dispatch selection
// @route   GET /api/vehicles/dispatch-selection
// @access  Private (Dispatcher, Fleet Manager)
export const getDispatchVehicles = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const vehicles = await listDispatchVehicles();
    return res.json(vehicles);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private (Fleet Manager, Dispatcher, Financial Analyst)
export const getVehicle = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const vehicle = await getVehicleById(String(req.params.id));
    return res.json(vehicle);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private (Fleet Manager)
export const createNewVehicle = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const vehicle = await createVehicle(req.body);
    return res.status(201).json(vehicle);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Fleet Manager)
export const updateVehicleDetails = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const vehicle = await updateVehicle(String(req.params.id), req.body);
    return res.json(vehicle);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Fleet Manager)
export const deleteVehicleProfile = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const result = await deleteVehicle(String(req.params.id));
    return res.json(result);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};
