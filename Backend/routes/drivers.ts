import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getDrivers,
  getDispatchDrivers,
  getDriver,
  createNewDriver,
  updateDriverProfile,
  deleteDriverProfile,
} from "../controllers/drivers.js";

const router = express.Router();

// @desc    Get all drivers (with filtering and search)
// @route   GET /api/drivers
// @access  Private (Safety Officer)
router.get(
  "/",
  protect,
  authorize("Safety Officer"),
  getDrivers
);

// @desc    Get eligible drivers for dispatch selection
// @route   GET /api/drivers/dispatch-selection
// @access  Private (Dispatcher, Safety Officer)
router.get(
  "/dispatch-selection",
  protect,
  authorize("Dispatcher", "Safety Officer"),
  getDispatchDrivers
);

// @desc    Get a single driver profile
// @route   GET /api/drivers/:id
// @access  Private (Safety Officer)
router.get(
  "/:id",
  protect,
  authorize("Safety Officer"),
  getDriver
);

// @desc    Create driver profile
// @route   POST /api/drivers
// @access  Private (Safety Officer)
router.post(
  "/",
  protect,
  authorize("Safety Officer"),
  createNewDriver
);

// @desc    Update driver profile
// @route   PUT /api/drivers/:id
// @access  Private (Safety Officer)
router.put(
  "/:id",
  protect,
  authorize("Safety Officer"),
  updateDriverProfile
);

// @desc    Delete driver profile
// @route   DELETE /api/drivers/:id
// @access  Private (Safety Officer)
router.delete(
  "/:id",
  protect,
  authorize("Safety Officer"),
  deleteDriverProfile
);

export default router;
