import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { getUserProfile, loginUser } from "../services/authService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const user = await loginUser(req.body);
    return res.json(user);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const profile = getUserProfile(req.user);
    return res.json(profile);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
};
