import mongoose from "mongoose";
import MaintenanceLog from "../models/MaintenanceLog.js";
import Vehicle from "../models/Vehicle.js";
import Expense from "../models/Expense.js";
import HttpError from "../utils/HttpError.js";

export const listMaintenanceLogs = async () => {
  return MaintenanceLog.find().populate("vehicle").sort({ createdAt: -1 });
};

export const createMaintenanceLog = async (payload: {
  vehicleId: string;
  maintenanceType: string;
  cost: number;
  startDate?: Date;
  description?: string;
  status?: "Active" | "Closed";
}) => {
  const session = await mongoose.startSession();

  try {
    let createdLog = null;

    await session.withTransaction(async () => {
      const vehicle = await Vehicle.findById(payload.vehicleId).session(session);
      if (!vehicle) {
        throw new HttpError(404, "Vehicle not found");
      }

      const logStatus = payload.status || "Active";

      const logs = await MaintenanceLog.create(
        [
          {
            vehicle: payload.vehicleId,
            maintenanceType: payload.maintenanceType,
            cost: payload.cost,
            startDate: payload.startDate || new Date(),
            status: logStatus,
            description: payload.description,
          },
        ],
        { session }
      );
      createdLog = logs[0];

      if (logStatus === "Active") {
        vehicle.status = "In Shop";
        await vehicle.save({ session });
      } else if (logStatus === "Closed") {
        if (vehicle.status !== "Retired") {
          vehicle.status = "Available";
          await vehicle.save({ session });
        }

        await Expense.create(
          [
            {
              vehicle: vehicle._id,
              maintenanceCost: payload.cost,
              toll: 0,
              other: 0,
              date: new Date(),
              description: `Linked maintenance: ${payload.maintenanceType}`,
            },
          ],
          { session }
        );
      }
    });

    return createdLog;
  } finally {
    await session.endSession();
  }
};

export const updateMaintenanceLog = async (
  maintenanceId: string,
  payload: {
    status?: "Active" | "Closed";
    endDate?: Date;
    cost?: number;
    maintenanceType?: string;
    description?: string;
  }
) => {
  const session = await mongoose.startSession();

  try {
    let updatedLog = null;

    await session.withTransaction(async () => {
      const log = await MaintenanceLog.findById(maintenanceId).session(session);
      if (!log) {
        throw new HttpError(404, "Maintenance log not found");
      }

      const vehicle = await Vehicle.findById(log.vehicle).session(session);
      if (!vehicle) {
        throw new HttpError(404, "Vehicle associated with log not found");
      }

      const oldStatus = log.status;
      const newStatus = payload.status || log.status;

      if (payload.cost !== undefined) log.cost = payload.cost;
      if (payload.maintenanceType !== undefined) log.maintenanceType = payload.maintenanceType;
      if (payload.description !== undefined) log.description = payload.description;
      if (payload.endDate !== undefined) log.endDate = payload.endDate;
      log.status = newStatus;

      if (oldStatus === "Active" && newStatus === "Closed") {
        log.endDate = payload.endDate || new Date();
        if (vehicle.status !== "Retired") {
          vehicle.status = "Available";
          await vehicle.save({ session });
        }

        await Expense.create(
          [
            {
              vehicle: vehicle._id,
              maintenanceCost: log.cost,
              toll: 0,
              other: 0,
              date: log.endDate,
              description: `Linked maintenance: ${log.maintenanceType}`,
            },
          ],
          { session }
        );
      } else if (oldStatus === "Closed" && newStatus === "Active") {
        vehicle.status = "In Shop";
        await vehicle.save({ session });
      }

      updatedLog = await log.save({ session });
    });

    return updatedLog;
  } finally {
    await session.endSession();
  }
};
