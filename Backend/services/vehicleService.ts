import Vehicle from "../models/Vehicle.js";
import HttpError from "../utils/HttpError.js";
import {
  optionalNonNegativeNumber,
  requireNonNegativeNumber,
} from "../utils/validation.js";

type VehicleType = "Van" | "Truck" | "Mini";
type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";

export const listVehicles = async (filters: {
  type?: string;
  status?: string;
  region?: string;
  search?: string;
}) => {
  const query: any = {};

  if (filters.type && filters.type !== "All") {
    query.type = filters.type;
  }
  if (filters.status && filters.status !== "All") {
    query.status = filters.status;
  }
  if (filters.region && filters.region !== "All") {
    query.region = filters.region;
  }
  if (filters.search) {
    query.$or = [
      { regNumber: { $regex: filters.search, $options: "i" } },
      { modelName: { $regex: filters.search, $options: "i" } },
    ];
  }

  return Vehicle.find(query).sort({ createdAt: -1 });
};

export const listDispatchVehicles = async () => {
  return Vehicle.find({ status: "Available" }).sort({ modelName: 1 });
};

export const getVehicleById = async (vehicleId: string) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new HttpError(404, "Vehicle not found");
  }
  return vehicle;
};

export const createVehicle = async (payload: {
  regNumber: string;
  modelName: string;
  type: VehicleType;
  capacity: number;
  odometer: number;
  acquisitionCost: number;
  region?: string;
}) => {
  const normalizedReg = payload.regNumber.toUpperCase().trim();
  const capacity = requireNonNegativeNumber(payload.capacity, "capacity");
  const odometer = requireNonNegativeNumber(payload.odometer, "odometer");
  const acquisitionCost = requireNonNegativeNumber(
    payload.acquisitionCost,
    "acquisitionCost"
  );
  const existingVehicle = await Vehicle.findOne({ regNumber: normalizedReg });

  if (existingVehicle) {
    throw new HttpError(400, "Registration number must be unique");
  }

  return Vehicle.create({
    regNumber: normalizedReg,
    modelName: payload.modelName,
    type: payload.type,
    capacity,
    odometer,
    acquisitionCost,
    region: payload.region,
  });
};

export const updateVehicle = async (
  vehicleId: string,
  payload: {
    regNumber?: string;
    modelName?: string;
    type?: VehicleType;
    capacity?: number;
    odometer?: number;
    acquisitionCost?: number;
    status?: VehicleStatus;
    region?: string;
  }
) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new HttpError(404, "Vehicle not found");
  }

  if (payload.regNumber) {
    const normalizedReg = payload.regNumber.toUpperCase().trim();
    if (normalizedReg !== vehicle.regNumber) {
      const duplicate = await Vehicle.findOne({ regNumber: normalizedReg });
      if (duplicate) {
        throw new HttpError(400, "Registration number must be unique");
      }
      vehicle.regNumber = normalizedReg;
    }
  }

  if (payload.modelName !== undefined) vehicle.modelName = payload.modelName;
  if (payload.type !== undefined) vehicle.type = payload.type;
  const capacity = optionalNonNegativeNumber(payload.capacity, "capacity");
  const odometer = optionalNonNegativeNumber(payload.odometer, "odometer");
  const acquisitionCost = optionalNonNegativeNumber(
    payload.acquisitionCost,
    "acquisitionCost"
  );
  if (capacity !== undefined) vehicle.capacity = capacity;
  if (odometer !== undefined) vehicle.odometer = odometer;
  if (acquisitionCost !== undefined) vehicle.acquisitionCost = acquisitionCost;
  if (payload.status !== undefined) vehicle.status = payload.status;
  if (payload.region !== undefined) vehicle.region = payload.region;

  return vehicle.save();
};

export const deleteVehicle = async (vehicleId: string) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new HttpError(404, "Vehicle not found");
  }

  await vehicle.deleteOne();
  return { message: "Vehicle removed successfully" };
};
