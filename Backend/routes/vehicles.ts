import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getVehicles,
  getDispatchVehicles,
  getVehicle,
  createNewVehicle,
  updateVehicleDetails,
  deleteVehicleProfile,
} from "../controllers/vehicles.js";

const router = express.Router();

// @desc    Get all vehicles (with filters & search)
// @route   GET /api/vehicles
// @access  Private (Fleet Manager)
router.get(
  "/",
  protect,
  authorize("Fleet Manager"),
  getVehicles
);

// @desc    Get only available vehicles for Dispatch selection
// @route   GET /api/vehicles/dispatch-selection
// @access  Private (Dispatcher, Fleet Manager)
router.get(
  "/dispatch-selection",
  protect,
  authorize("Dispatcher", "Fleet Manager"),
  getDispatchVehicles
);

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private (Fleet Manager)
router.get(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  getVehicle
);

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private (Fleet Manager)
router.post(
  "/",
  protect,
  authorize("Fleet Manager"),
  createNewVehicle
);

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Fleet Manager)
router.put(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  updateVehicleDetails
);

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Fleet Manager)
router.delete(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  deleteVehicleProfile
);

export default router;
