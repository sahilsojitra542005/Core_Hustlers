import express, { Response } from "express";
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all trips (with filters & population)
// @route   GET /api/trips
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
router.get(
  "/",
  protect,
  authorize("Dispatcher", "Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const { status, search } = req.query as {
      status?: string;
      search?: string;
    };

    const query: any = {};
    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { tripId: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
      ];
    }

    try {
      const trips = await Trip.find(query)
        .populate("vehicle")
        .populate("driver")
        .sort({ createdAt: -1 });
      return res.json(trips);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
      const trip = await Trip.findById(req.params.id)
        .populate("vehicle")
        .populate("driver");
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      return res.json(trip);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    const { tripId, source, destination, vehicleId, driverId, cargoWeight, plannedDistance } =
      req.body;

    try {
      const tripExists = await Trip.findOne({ tripId: tripId.toUpperCase().trim() });
      if (tripExists) {
        return res.status(400).json({ message: "Trip ID must be unique" });
      }

      // Create as Draft
      const trip = await Trip.create({
        tripId: tripId.toUpperCase().trim(),
        source,
        destination,
        vehicle: vehicleId || null,
        driver: driverId || null,
        cargoWeight,
        plannedDistance,
        status: "Draft",
      });

      return res.status(201).json(trip);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    const { vehicleId, driverId } = req.body;

    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      if (trip.status !== "Draft") {
        return res
          .status(400)
          .json({ message: "Only Draft trips can be dispatched" });
      }

      const finalVehicleId = vehicleId || trip.vehicle;
      const finalDriverId = driverId || trip.driver;

      if (!finalVehicleId || !finalDriverId) {
        return res
          .status(400)
          .json({ message: "Both vehicle and driver must be assigned to dispatch" });
      }

      const vehicle = await Vehicle.findById(finalVehicleId);
      const driver = await Driver.findById(finalDriverId);

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      // Rule: Cargo Weight must not exceed the vehicle's maximum load capacity
      if (trip.cargoWeight > vehicle.capacity) {
        const diff = trip.cargoWeight - vehicle.capacity;
        return res.status(400).json({
          message: `Vehicle Capacity: ${vehicle.capacity} kg. Cargo Weight: ${trip.cargoWeight} kg. Capacity exceeded by ${diff} kg - dispatch blocked.`,
        });
      }

      // Rule: Retired or In Shop vehicles must never be dispatched
      if (vehicle.status !== "Available") {
        return res.status(400).json({
          message: `Vehicle ${vehicle.modelName} is currently ${vehicle.status} and cannot be assigned.`,
        });
      }

      // Rule: Drivers with expired licenses or Suspended status cannot be assigned
      if (driver.status !== "Available") {
        return res.status(400).json({
          message: `Driver ${driver.name} is currently ${driver.status} and cannot be assigned.`,
        });
      }

      const currentDate = new Date();
      if (driver.licenseExpiryDate < currentDate) {
        return res.status(400).json({
          message: `Driver ${driver.name} has an expired license (Expired: ${new Date(
            driver.licenseExpiryDate
          ).toLocaleDateString()}) and cannot be assigned.`,
        });
      }

      // Perform status transitions
      vehicle.status = "On Trip";
      driver.status = "On Trip";

      await vehicle.save();
      await driver.save();

      trip.vehicle = finalVehicleId as any;
      trip.driver = finalDriverId as any;
      trip.status = "Dispatched";
      trip.startOdometer = vehicle.odometer;

      const updatedTrip = await trip.save();

      return res.json(updatedTrip);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
    const { endOdometer, fuelConsumed, fuelCost, tollCost, otherCost, durationMinutes } =
      req.body;

    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      if (trip.status !== "Dispatched") {
        return res
          .status(400)
          .json({ message: "Only Dispatched trips can be completed" });
      }

      const vehicle = await Vehicle.findById(trip.vehicle);
      const driver = await Driver.findById(trip.driver);

      if (!vehicle || !driver) {
        return res.status(404).json({
          message: "Vehicle or Driver assigned to this trip could not be resolved",
        });
      }

      // Validate end odometer
      if (endOdometer < vehicle.odometer) {
        return res.status(400).json({
          message: `End odometer (${endOdometer}) cannot be less than the start odometer (${vehicle.odometer})`,
        });
      }

      // 1. Complete the trip record
      trip.status = "Completed";
      trip.endOdometer = endOdometer;
      trip.fuelConsumed = fuelConsumed;
      trip.durationMinutes = durationMinutes || 0;
      await trip.save();

      // 2. Restore vehicle status and update its odometer
      vehicle.status = "Available";
      vehicle.odometer = endOdometer;
      await vehicle.save();

      // 3. Restore driver status
      driver.status = "Available";
      await driver.save();

      // 4. Create Fuel Log automatically
      if (fuelConsumed > 0 && fuelCost > 0) {
        await FuelLog.create({
          vehicle: vehicle._id,
          liters: fuelConsumed,
          cost: fuelCost,
          date: new Date(),
        });
      }

      // 5. Create Expense record automatically
      const tollVal = parseFloat(tollCost) || 0;
      const otherVal = parseFloat(otherCost) || 0;
      if (tollVal > 0 || otherVal > 0) {
        await Expense.create({
          trip: trip._id,
          vehicle: vehicle._id,
          toll: tollVal,
          other: otherVal,
          maintenanceCost: 0,
          date: new Date(),
          description: `Trip ${trip.tripId} expenses`,
        });
      }

      return res.json(trip);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
      const trip = await Trip.findById(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const prevStatus = trip.status;

      if (prevStatus === "Completed" || prevStatus === "Cancelled") {
        return res
          .status(400)
          .json({ message: `Cannot cancel a trip that is already ${prevStatus}` });
      }

      // Restore vehicle and driver if it was Dispatched
      if (prevStatus === "Dispatched") {
        if (trip.vehicle) {
          await Vehicle.findByIdAndUpdate(trip.vehicle, { status: "Available" });
        }
        if (trip.driver) {
          await Driver.findByIdAndUpdate(trip.driver, { status: "Available" });
        }
      }

      trip.status = "Cancelled";
      await trip.save();

      return res.json(trip);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
