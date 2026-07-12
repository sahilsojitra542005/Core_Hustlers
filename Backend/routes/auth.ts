import express, { Request, Response } from "express";
import { protect, AuthRequest } from "../middleware/auth.js";
import {login,getProfile} from "../controllers/auth.js"


const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", protect, getProfile);

export default router;
