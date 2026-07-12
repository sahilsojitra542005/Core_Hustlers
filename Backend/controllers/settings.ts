import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { getSettings, updateSettings } from "../services/settingsService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (All Roles)
export const getGlobalSettings = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const setting = await getSettings();
    return res.json(setting);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Fleet Manager)
export const updateGlobalSettings = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const setting = await updateSettings(req.body);
    return res.json(setting);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};
