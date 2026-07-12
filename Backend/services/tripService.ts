import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";
import HttpError from "../utils/HttpError.js";

export const listTrips = async (filters: { status?: string; search?: string }) => {
  const query: any = {};

  if (filters.status && filters.status !== "All") {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { tripId: { $regex: filters.search, $options: "i" } },
      { source: { $regex: filters.search, $options: "i" } },
      { destination: { $regex: filters.search, $options: "i" } },
    ];
  }

  return Trip.find(query).populate("vehicle").populate("driver").sort({ createdAt: -1 });
};

export const getTripById = async (tripId: string) => {
  const trip = await Trip.findById(tripId).populate("vehicle").populate("driver");
  if (!trip) {
    throw new HttpError(404, "Trip not found");
  }
  return trip;
};

export const createTrip = async (payload: {
  tripId: string;
  source: string;
  destination: string;
  vehicleId?: string;
  driverId?: string;
  cargoWeight: number;
  plannedDistance: number;
}) => {
  const normalizedTripId = payload.tripId.toUpperCase().trim();
  const tripExists = await Trip.findOne({ tripId: normalizedTripId });

  if (tripExists) {
    throw new HttpError(400, "Trip ID must be unique");
  }

  return Trip.create({
    tripId: normalizedTripId,
    source: payload.source,
    destination: payload.destination,
    vehicle: payload.vehicleId || undefined,
    driver: payload.driverId || undefined,
    cargoWeight: payload.cargoWeight,
    plannedDistance: payload.plannedDistance,
    status: "Draft",
  });
};

export const dispatchTrip = async (
  tripId: string,
  payload: { vehicleId?: string; driverId?: string }
) => {
  const session = await mongoose.startSession();

  try {
    let updatedTrip = null;

    await session.withTransaction(async () => {
      const trip = await Trip.findById(tripId).session(session);
      if (!trip) {
        throw new HttpError(404, "Trip not found");
      }

      if (trip.status !== "Draft") {
        throw new HttpError(400, "Only Draft trips can be dispatched");
      }

      const finalVehicleId = payload.vehicleId || trip.vehicle;
      const finalDriverId = payload.driverId || trip.driver;

      if (!finalVehicleId || !finalDriverId) {
        throw new HttpError(400, "Both vehicle and driver must be assigned to dispatch");
      }

      const vehicle = await Vehicle.findById(finalVehicleId).session(session);
      const driver = await Driver.findById(finalDriverId).session(session);

      if (!vehicle) {
        throw new HttpError(404, "Vehicle not found");
      }
      if (!driver) {
        throw new HttpError(404, "Driver not found");
      }

      if (trip.cargoWeight > vehicle.capacity) {
        const diff = trip.cargoWeight - vehicle.capacity;
        throw new HttpError(
          400,
          `Vehicle Capacity: ${vehicle.capacity} kg. Cargo Weight: ${trip.cargoWeight} kg. Capacity exceeded by ${diff} kg - dispatch blocked.`
        );
      }

      if (vehicle.status !== "Available") {
        throw new HttpError(
          400,
          `Vehicle ${vehicle.modelName} is currently ${vehicle.status} and cannot be assigned.`
        );
      }

      if (driver.status !== "Available") {
        throw new HttpError(
          400,
          `Driver ${driver.name} is currently ${driver.status} and cannot be assigned.`
        );
      }

      if (driver.licenseExpiryDate < new Date()) {
        throw new HttpError(
          400,
          `Driver ${driver.name} has an expired license (Expired: ${new Date(
            driver.licenseExpiryDate
          ).toLocaleDateString()}) and cannot be assigned.`
        );
      }

      vehicle.status = "On Trip";
      driver.status = "On Trip";

      await vehicle.save({ session });
      await driver.save({ session });

      trip.vehicle = finalVehicleId as any;
      trip.driver = finalDriverId as any;
      trip.status = "Dispatched";
      trip.startOdometer = vehicle.odometer;

      updatedTrip = await trip.save({ session });
    });

    return updatedTrip;
  } finally {
    await session.endSession();
  }
};

export const completeTrip = async (
  tripId: string,
  payload: {
    endOdometer: number;
    fuelConsumed?: number;
    fuelCost?: number;
    tollCost?: string | number;
    otherCost?: string | number;
    durationMinutes?: number;
  }
) => {
  const session = await mongoose.startSession();

  try {
    let completedTrip = null;

    await session.withTransaction(async () => {
      const trip = await Trip.findById(tripId).session(session);
      if (!trip) {
        throw new HttpError(404, "Trip not found");
      }

      if (trip.status !== "Dispatched") {
        throw new HttpError(400, "Only Dispatched trips can be completed");
      }

      const vehicle = await Vehicle.findById(trip.vehicle).session(session);
      const driver = await Driver.findById(trip.driver).session(session);

      if (!vehicle || !driver) {
        throw new HttpError(
          404,
          "Vehicle or Driver assigned to this trip could not be resolved"
        );
      }

      if (payload.endOdometer < vehicle.odometer) {
        throw new HttpError(
          400,
          `End odometer (${payload.endOdometer}) cannot be less than the start odometer (${vehicle.odometer})`
        );
      }

      trip.status = "Completed";
      trip.endOdometer = payload.endOdometer;
      trip.fuelConsumed = payload.fuelConsumed;
      trip.durationMinutes = payload.durationMinutes || 0;
      await trip.save({ session });

      vehicle.status = "Available";
      vehicle.odometer = payload.endOdometer;
      await vehicle.save({ session });

      driver.status = "Available";
      await driver.save({ session });

      if ((payload.fuelConsumed || 0) > 0 && (payload.fuelCost || 0) > 0) {
        await FuelLog.create(
          [
            {
              vehicle: vehicle._id,
              liters: payload.fuelConsumed,
              cost: payload.fuelCost,
              date: new Date(),
            },
          ],
          { session }
        );
      }

      const tollVal = parseFloat(String(payload.tollCost)) || 0;
      const otherVal = parseFloat(String(payload.otherCost)) || 0;
      if (tollVal > 0 || otherVal > 0) {
        await Expense.create(
          [
            {
              trip: trip._id,
              vehicle: vehicle._id,
              toll: tollVal,
              other: otherVal,
              maintenanceCost: 0,
              date: new Date(),
              description: `Trip ${trip.tripId} expenses`,
            },
          ],
          { session }
        );
      }

      completedTrip = trip;
    });

    return completedTrip;
  } finally {
    await session.endSession();
  }
};

export const cancelTrip = async (tripId: string) => {
  const session = await mongoose.startSession();

  try {
    let cancelledTrip = null;

    await session.withTransaction(async () => {
      const trip = await Trip.findById(tripId).session(session);
      if (!trip) {
        throw new HttpError(404, "Trip not found");
      }

      const prevStatus = trip.status;

      if (prevStatus === "Completed" || prevStatus === "Cancelled") {
        throw new HttpError(400, `Cannot cancel a trip that is already ${prevStatus}`);
      }

      if (prevStatus === "Dispatched") {
        if (trip.vehicle) {
          await Vehicle.findByIdAndUpdate(
            trip.vehicle,
            { status: "Available" },
            { session }
          );
        }
        if (trip.driver) {
          await Driver.findByIdAndUpdate(
            trip.driver,
            { status: "Available" },
            { session }
          );
        }
      }

      trip.status = "Cancelled";
      cancelledTrip = await trip.save({ session });
    });

    return cancelledTrip;
  } finally {
    await session.endSession();
  }
};
