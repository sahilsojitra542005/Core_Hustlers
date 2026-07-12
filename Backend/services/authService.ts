import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";
import HttpError from "../utils/HttpError.js";

const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_jwt_secret_key_12345",
    { expiresIn: "30d" }
  );
};

const serializeUser = (user: IUser) => ({
  _id: user._id,
  email: user.email,
  role: user.role,
  token: generateToken(user._id.toString()),
});

export const loginUser = async (payload: { email: string; password: string; role: IUser["role"] }) => {
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    // Auto-register user if they don't exist since register route is removed
    user = await User.create({
      email: payload.email,
      password: payload.password,
      role: payload.role as any,
    });
    return serializeUser(user);
  }

  // If user exists but role doesn't match, update it for the demo
  if (user.role !== payload.role) {
    user.role = payload.role as any;
    await user.save();
  }

  if (user.isLocked()) {
    const timeLeft = Math.ceil(((user.lockUntil as any) - Date.now()) / 1000 / 60);
    throw new HttpError(
      401,
      `Account locked after 5 failed attempts. Please try again in ${timeLeft} minute(s).`
    );
  }

  const isMatch = await user.comparePassword(payload.password);

  if (isMatch) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return serializeUser(user);
  }

  user.failedLoginAttempts += 1;

  if (user.failedLoginAttempts >= 5) {
    user.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    throw new HttpError(401, "Invalid credentials. Account locked after 5 failed attempts.");
  }

  await user.save();
  const attemptsLeft = 5 - user.failedLoginAttempts;
  throw new HttpError(401, `Invalid credentials. ${attemptsLeft} attempts remaining.`);
};

export const getUserProfile = (user?: IUser) => {
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
};
