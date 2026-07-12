import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_jwt_secret_key_12345",
    { expiresIn: "30d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req: Request, res: Response): Promise<void | Response> => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      role,
    });

    return res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id as string),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req: Request, res: Response): Promise<void | Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const timeLeft = Math.ceil(((user.lockUntil as any) - Date.now()) / 1000 / 60);
      return res.status(401).json({
        message: `Account locked after 5 failed attempts. Please try again in ${timeLeft} minute(s).`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      // Reset failed login attempts on successful login
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      return res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id as string),
      });
    } else {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // lock for 10 minutes
        await user.save();
        return res.status(401).json({
          message: "Invalid credentials. Account locked after 5 failed attempts.",
        });
      } else {
        await user.save();
        const attemptsLeft = 5 - user.failedLoginAttempts;
        return res.status(401).json({
          message: `Invalid credentials. ${attemptsLeft} attempts remaining.`,
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", protect, async (req: AuthRequest, res: Response): Promise<void | Response> => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      _id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
