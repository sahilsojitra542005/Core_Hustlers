import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getTrips,
  getTrip,
  exportTripsCsv,
  exportTripsPdf,
  createTripDraft,
  dispatchTripHandler,
  completeTripHandler,
  cancelTripHandler,
} from "../controllers/trips.js";

const router = express.Router();

// @desc    Get all trips (with filters & population)
// @route   GET /api/trips
// @access  Private (Dispatcher)
router.get(
  "/",
  protect,
  authorize("Dispatcher"),
  getTrips
);

router.get(
  "/export.csv",
  protect,
  authorize("Dispatcher", "Fleet Manager", "Financial Analyst"),
  exportTripsCsv
);

router.get(
  "/export.pdf",
  protect,
  authorize("Dispatcher", "Fleet Manager", "Financial Analyst"),
  exportTripsPdf
);

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private (Dispatcher)
router.get(
  "/:id",
  protect,
  authorize("Dispatcher"),
  getTrip
);

// @desc    Create a trip (Draft)
// @route   POST /api/trips
// @access  Private (Dispatcher)
router.post(
  "/",
  protect,
  authorize("Dispatcher"),
  createTripDraft
);

// @desc    Dispatch a trip (requires vehicle & driver, enforces rules)
// @route   PUT /api/trips/:id/dispatch
// @access  Private (Dispatcher)
router.put(
  "/:id/dispatch",
  protect,
  authorize("Dispatcher"),
  dispatchTripHandler
);

// @desc    Complete a trip (records final stats, creates logs, restores status)
// @route   PUT /api/trips/:id/complete
// @access  Private (Dispatcher)
router.put(
  "/:id/complete",
  protect,
  authorize("Dispatcher"),
  completeTripHandler
);

// @desc    Cancel a trip (restores driver & vehicle status)
// @route   PUT /api/trips/:id/cancel
// @access  Private (Dispatcher)
router.put(
  "/:id/cancel",
  protect,
  authorize("Dispatcher"),
  cancelTripHandler
);

export default router;
