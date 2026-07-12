import Driver from "../models/Driver.js";
import HttpError from "../utils/HttpError.js";

type LicenseCategory = "LMV" | "HMV";
type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended";

export const listDrivers = async (filters: { status?: string; search?: string }) => {
  const query: any = {};

  if (filters.status && filters.status !== "All") {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { licenseNumber: { $regex: filters.search, $options: "i" } },
    ];
  }

  return Driver.find(query).sort({ createdAt: -1 });
};

export const listDispatchDrivers = async () => {
  return Driver.find({
    status: "Available",
    licenseExpiryDate: { $gt: new Date() },
  }).sort({ name: 1 });
};

export const getDriverById = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new HttpError(404, "Driver not found");
  }
  return driver;
};

export const createDriver = async (payload: {
  name: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore?: number;
  tripCompletionRate?: number;
}) => {
  const normalizedLicense = payload.licenseNumber.toUpperCase().trim();
  const existingDriver = await Driver.findOne({ licenseNumber: normalizedLicense });

  if (existingDriver) {
    throw new HttpError(400, "License number must be unique");
  }

  return Driver.create({
    name: payload.name,
    licenseNumber: normalizedLicense,
    licenseCategory: payload.licenseCategory,
    licenseExpiryDate: payload.licenseExpiryDate,
    contactNumber: payload.contactNumber,
    safetyScore: payload.safetyScore,
    tripCompletionRate: payload.tripCompletionRate,
  });
};

export const updateDriver = async (
  driverId: string,
  payload: {
    name?: string;
    licenseNumber?: string;
    licenseCategory?: LicenseCategory;
    licenseExpiryDate?: Date;
    contactNumber?: string;
    safetyScore?: number;
    tripCompletionRate?: number;
    status?: DriverStatus;
  }
) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new HttpError(404, "Driver not found");
  }

  if (payload.licenseNumber) {
    const normalizedLicense = payload.licenseNumber.toUpperCase().trim();
    if (normalizedLicense !== driver.licenseNumber) {
      const duplicate = await Driver.findOne({ licenseNumber: normalizedLicense });
      if (duplicate) {
        throw new HttpError(400, "License number must be unique");
      }
      driver.licenseNumber = normalizedLicense;
    }
  }

  if (payload.name !== undefined) driver.name = payload.name;
  if (payload.licenseCategory !== undefined) driver.licenseCategory = payload.licenseCategory;
  if (payload.licenseExpiryDate !== undefined) driver.licenseExpiryDate = payload.licenseExpiryDate;
  if (payload.contactNumber !== undefined) driver.contactNumber = payload.contactNumber;
  if (payload.safetyScore !== undefined) driver.safetyScore = payload.safetyScore;
  if (payload.tripCompletionRate !== undefined) {
    driver.tripCompletionRate = payload.tripCompletionRate;
  }
  if (payload.status !== undefined) driver.status = payload.status;

  return driver.save();
};

export const deleteDriver = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new HttpError(404, "Driver not found");
  }

  await driver.deleteOne();
  return { message: "Driver removed successfully" };
};
