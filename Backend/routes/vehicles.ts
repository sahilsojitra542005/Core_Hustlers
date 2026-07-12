import express, { Response } from "express";
import Vehicle from "../models/Vehicle.js";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all vehicles (with filters & search)
// @route   GET /api/vehicles
// @access  Private (Fleet Manager, Dispatcher, Financial Analyst)
router.get(
  "/",
  protect,
  authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const { type, status, region, search } = req.query as {
      type?: string;
      status?: string;
      region?: string;
      search?: string;
    };

    const query: any = {};

    if (type && type !== "All") {
      query.type = type;
    }
    if (status && status !== "All") {
      query.status = status;
    }
    if (region && region !== "All") {
      query.region = region;
    }
    if (search) {
      query.$or = [
        { regNumber: { $regex: search, $options: "i" } },
        { modelName: { $regex: search, $options: "i" } },
      ];
    }

    try {
      const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
      return res.json(vehicles);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get only available vehicles for Dispatch selection
// @route   GET /api/vehicles/dispatch-selection
// @access  Private (Dispatcher, Fleet Manager)
router.get(
  "/dispatch-selection",
  protect,
  authorize("Dispatcher", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const vehicles = await Vehicle.find({ status: "Available" }).sort({
        modelName: 1,
      });
      return res.json(vehicles);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private (Fleet Manager, Dispatcher, Financial Analyst)
router.get(
  "/:id",
  protect,
  authorize("Fleet Manager", "Dispatcher", "Financial Analyst"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      return res.json(vehicle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private (Fleet Manager)
router.post(
  "/",
  protect,
  authorize("Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const { regNumber, modelName, type, capacity, odometer, acquisitionCost, region } =
      req.body;

    try {
      const existingVehicle = await Vehicle.findOne({
        regNumber: regNumber.toUpperCase().trim(),
      });
      if (existingVehicle) {
        return res
          .status(400)
          .json({ message: "Registration number must be unique" });
      }

      const vehicle = await Vehicle.create({
        regNumber: regNumber.toUpperCase().trim(),
        modelName,
        type,
        capacity,
        odometer,
        acquisitionCost,
        region,
      });

      return res.status(201).json(vehicle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Fleet Manager)
router.put(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const { regNumber, modelName, type, capacity, odometer, acquisitionCost, status, region } =
        req.body;

      if (regNumber) {
        const normalizedReg = regNumber.toUpperCase().trim();
        if (normalizedReg !== vehicle.regNumber) {
          const duplicate = await Vehicle.findOne({ regNumber: normalizedReg });
          if (duplicate) {
            return res
              .status(400)
              .json({ message: "Registration number must be unique" });
          }
          vehicle.regNumber = normalizedReg;
        }
      }

      if (modelName !== undefined) vehicle.modelName = modelName;
      if (type !== undefined) vehicle.type = type;
      if (capacity !== undefined) vehicle.capacity = capacity;
      if (odometer !== undefined) vehicle.odometer = odometer;
      if (acquisitionCost !== undefined) vehicle.acquisitionCost = acquisitionCost;
      if (status !== undefined) vehicle.status = status;
      if (region !== undefined) vehicle.region = region;

      const updatedVehicle = await vehicle.save();
      return res.json(updatedVehicle);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Fleet Manager)
router.delete(
  "/:id",
  protect,
  authorize("Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      await vehicle.deleteOne();
      return res.json({ message: "Vehicle removed successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
