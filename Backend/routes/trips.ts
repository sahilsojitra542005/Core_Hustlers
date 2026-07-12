import express, { Response } from "express";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";
import {
  cancelTrip,
  completeTrip,
  createTrip,
  dispatchTrip,
  getTripById,
  listTrips,
} from "../services/tripService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

const router = express.Router();

// @desc    Get all trips (with filters & population)
// @route   GET /api/trips
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
router.get(
  "/",
  protect,
  authorize("Dispatcher", "Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const { status, search } = req.query as { status?: string; search?: string };
      const trips = await listTrips({ status, search });
      return res.json(trips);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
router.get(
  "/:id",
  protect,
  authorize("Dispatcher", "Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const trip = await getTripById(String(req.params.id));
      return res.json(trip);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Create a trip (Draft)
// @route   POST /api/trips
// @access  Private (Dispatcher)
router.post(
  "/",
  protect,
  authorize("Dispatcher"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const trip = await createTrip(req.body);
      return res.status(201).json(trip);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Dispatch a trip (requires vehicle & driver, enforces rules)
// @route   PUT /api/trips/:id/dispatch
// @access  Private (Dispatcher)
router.put(
  "/:id/dispatch",
  protect,
  authorize("Dispatcher"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const trip = await dispatchTrip(String(req.params.id), req.body);
      return res.json(trip);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Complete a trip (records final stats, creates logs, restores status)
// @route   PUT /api/trips/:id/complete
// @access  Private (Dispatcher)
router.put(
  "/:id/complete",
  protect,
  authorize("Dispatcher"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const trip = await completeTrip(String(req.params.id), req.body);
      return res.json(trip);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

// @desc    Cancel a trip (restores driver & vehicle status)
// @route   PUT /api/trips/:id/cancel
// @access  Private (Dispatcher)
router.put(
  "/:id/cancel",
  protect,
  authorize("Dispatcher"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const trip = await cancelTrip(String(req.params.id));
      return res.json(trip);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

export default router;
