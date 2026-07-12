import express, { Response } from "express";
import { protect, authorize, AuthRequest } from "../middleware/auth.js";
import { getSettings, updateSettings } from "../services/settingsService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

const router = express.Router();

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (All Roles)
router.get(
  "/",
  protect,
  async (req: AuthRequest, res: Response): Promise<void | Response> => {
    try {
      const setting = await getSettings();
      return res.json(setting);
    } catch (error: any) {
      return handleRouteError(error, res);
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
    try {
      const setting = await updateSettings(req.body);
      return res.json(setting);
    } catch (error: any) {
      return handleRouteError(error, res);
    }
  }
);

export default router;
