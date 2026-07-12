import express, { Response } from "express";
import Driver from "../models/Driver.js";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all drivers (with filtering and search)
// @route   GET /api/drivers
// @access  Private (Safety Officer, Fleet Manager)
router.get(
  "/",
  protect,
  authorize("Safety Officer", "Fleet Manager"),
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
        { name: { $regex: search, $options: "i" } },
        { licenseNumber: { $regex: search, $options: "i" } },
      ];
    }

    try {
      const drivers = await Driver.find(query).sort({ createdAt: -1 });
      return res.json(drivers);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get eligible drivers for dispatch selection
// @route   GET /api/drivers/dispatch-selection
// @access  Private (Dispatcher, Safety Officer, Fleet Manager)
router.get(
  "/dispatch-selection",
  protect,
  authorize("Dispatcher", "Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const currentDate = new Date();
      const drivers = await Driver.find({
        status: "Available",
        licenseExpiryDate: { $gt: currentDate },
      }).sort({ name: 1 });

      return res.json(drivers);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Get a single driver profile
// @route   GET /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
router.get(
  "/:id",
  protect,
  authorize("Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      return res.json(driver);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Create driver profile
// @route   POST /api/drivers
// @access  Private (Safety Officer, Fleet Manager)
router.post(
  "/",
  protect,
  authorize("Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore,
      tripCompletionRate,
    } = req.body;

    try {
      const normalizedLicense = licenseNumber.toUpperCase().trim();
      const existingDriver = await Driver.findOne({
        licenseNumber: normalizedLicense,
      });

      if (existingDriver) {
        return res
          .status(400)
          .json({ message: "License number must be unique" });
      }

      const driver = await Driver.create({
        name,
        licenseNumber: normalizedLicense,
        licenseCategory,
        licenseExpiryDate,
        contactNumber,
        safetyScore,
        tripCompletionRate,
      });

      return res.status(201).json(driver);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Update driver profile
// @route   PUT /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
router.put(
  "/:id",
  protect,
  authorize("Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      const {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate,
        contactNumber,
        safetyScore,
        tripCompletionRate,
        status,
      } = req.body;

      if (licenseNumber) {
        const normalizedLicense = licenseNumber.toUpperCase().trim();
        if (normalizedLicense !== driver.licenseNumber) {
          const duplicate = await Driver.findOne({
            licenseNumber: normalizedLicense,
          });
          if (duplicate) {
            return res
              .status(400)
              .json({ message: "License number must be unique" });
          }
          driver.licenseNumber = normalizedLicense;
        }
      }

      if (name !== undefined) driver.name = name;
      if (licenseCategory !== undefined) driver.licenseCategory = licenseCategory;
      if (licenseExpiryDate !== undefined) driver.licenseExpiryDate = licenseExpiryDate;
      if (contactNumber !== undefined) driver.contactNumber = contactNumber;
      if (safetyScore !== undefined) driver.safetyScore = safetyScore;
      if (tripCompletionRate !== undefined) driver.tripCompletionRate = tripCompletionRate;
      if (status !== undefined) driver.status = status;

      const updatedDriver = await driver.save();
      return res.json(updatedDriver);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Delete driver profile
// @route   DELETE /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
router.delete(
  "/:id",
  protect,
  authorize("Safety Officer", "Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      await driver.deleteOne();
      return res.json({ message: "Driver removed successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
