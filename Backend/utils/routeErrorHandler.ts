import { Response } from "express";
import HttpError from "./HttpError.js";

export const handleRouteError = (error: any, res: Response) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: error.message });
};
