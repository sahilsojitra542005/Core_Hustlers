import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  cancelTrip,
  completeTrip,
  createTrip,
  dispatchTrip,
  getTripsCsv,
  getTripsPdf,
  getTripById,
  listTrips,
} from "../services/tripService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

// @desc    Get all trips (with filters & population)
// @route   GET /api/trips
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
export const getTrips = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };
    const trips = await listTrips({ status, search });
    return res.json(trips);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

export const exportTripsCsv = async (
  req: AuthRequest,
  res: Response
): Promise<void | Response> => {
  try {
    const csv = await getTripsCsv();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="transitops-trips.csv"');
    return res.send(csv);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

export const exportTripsPdf = async (
  req: AuthRequest,
  res: Response
): Promise<void | Response> => {
  try {
    const pdf = await getTripsPdf();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="transitops-trips.pdf"');
    return res.send(pdf);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
export const getTrip = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const trip = await getTripById(String(req.params.id));
    return res.json(trip);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Create a trip (Draft)
// @route   POST /api/trips
// @access  Private (Dispatcher)
export const createTripDraft = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const trip = await createTrip(req.body);
    return res.status(201).json(trip);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Dispatch a trip (requires vehicle & driver, enforces rules)
// @route   PUT /api/trips/:id/dispatch
// @access  Private (Dispatcher)
export const dispatchTripHandler = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const trip = await dispatchTrip(String(req.params.id), req.body);
    return res.json(trip);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Complete a trip (records final stats, creates logs, restores status)
// @route   PUT /api/trips/:id/complete
// @access  Private (Dispatcher)
export const completeTripHandler = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const trip = await completeTrip(String(req.params.id), req.body);
    return res.json(trip);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Cancel a trip (restores driver & vehicle status)
// @route   PUT /api/trips/:id/cancel
// @access  Private (Dispatcher)
export const cancelTripHandler = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const trip = await cancelTrip(String(req.params.id));
    return res.json(trip);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};
