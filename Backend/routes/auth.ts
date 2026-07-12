import express, { Request, Response } from "express";
import { protect, AuthRequest } from "../middleware/auth.js";
import { getUserProfile, loginUser, registerUser } from "../services/authService.js";
import { handleRouteError } from "../utils/routeErrorHandler.js";

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const user = await loginUser(req.body);
    return res.json(user);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", protect, async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    const profile = getUserProfile(req.user);
    return res.json(profile);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

export default router;
