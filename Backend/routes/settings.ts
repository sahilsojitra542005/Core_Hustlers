import express, { Response } from "express";
import Setting from "../models/Setting.js";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (All Roles)
router.get(
  "/",
  protect,
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      let setting = await Setting.findOne();

      if (!setting) {
        setting = await Setting.create({
          depotName: "Gandhinagar Depot GJ4",
          currency: "INR (Rs)",
          distanceUnit: "Kilometers",
        });
      }

      return res.json(setting);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Fleet Manager)
router.put(
  "/",
  protect,
  authorize("Fleet Manager"),
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    const { depotName, currency, distanceUnit } = req.body;

    try {
      let setting = await Setting.findOne();

      if (!setting) {
        setting = new Setting();
      }

      if (depotName !== undefined) setting.depotName = depotName;
      if (currency !== undefined) setting.currency = currency;
      if (distanceUnit !== undefined) setting.distanceUnit = distanceUnit;

      const updated = await setting.save();
      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
