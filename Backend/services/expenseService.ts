import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";
import Vehicle from "../models/Vehicle.js";
import HttpError from "../utils/HttpError.js";
import {
  optionalNonNegativeNumber,
  requireNonNegativeNumber,
} from "../utils/validation.js";

export const listFuelLogs = async () => {
  return FuelLog.find().populate("vehicle").sort({ date: -1 });
};

export const createFuelLog = async (payload: {
  vehicleId: string;
  liters: number;
  cost: number;
  date?: Date;
}) => {
  const liters = requireNonNegativeNumber(payload.liters, "liters");
  const cost = requireNonNegativeNumber(payload.cost, "cost");
  const vehicle = await Vehicle.findById(payload.vehicleId);
  if (!vehicle) {
    throw new HttpError(404, "Vehicle not found");
  }

  return FuelLog.create({
    vehicle: payload.vehicleId,
    liters,
    cost,
    date: payload.date || new Date(),
  });
};

export const listOtherExpenses = async () => {
  return Expense.find().populate("vehicle").populate("trip").sort({ date: -1 });
};

export const createOtherExpense = async (payload: {
  tripId?: string;
  vehicleId: string;
  toll?: number;
  other?: number;
  date?: Date;
  description?: string;
}) => {
  const toll = optionalNonNegativeNumber(payload.toll, "toll") || 0;
  const other = optionalNonNegativeNumber(payload.other, "other") || 0;
  const vehicle = await Vehicle.findById(payload.vehicleId);
  if (!vehicle) {
    throw new HttpError(404, "Vehicle not found");
  }

  return Expense.create({
    trip: payload.tripId || undefined,
    vehicle: payload.vehicleId,
    toll,
    other,
    maintenanceCost: 0,
    date: payload.date || new Date(),
    description: payload.description,
  });
};

export const getExpenseSummary = async () => {
  const fuelTotalResult = await FuelLog.aggregate([
    { $group: { _id: null, total: { $sum: "$cost" } } },
  ]);
  const fuelTotal = fuelTotalResult[0]?.total || 0;

  const expenseTotalResult = await Expense.aggregate([
    {
      $group: {
        _id: null,
        totalToll: { $sum: "$toll" },
        totalOther: { $sum: "$other" },
        totalMaint: { $sum: "$maintenanceCost" },
      },
    },
  ]);

  const tollTotal = expenseTotalResult[0]?.totalToll || 0;
  const otherTotal = expenseTotalResult[0]?.totalOther || 0;
  const maintTotal = expenseTotalResult[0]?.totalMaint || 0;

  return {
    fuelTotal,
    tollTotal,
    otherTotal,
    maintTotal,
    grandTotal: fuelTotal + tollTotal + otherTotal + maintTotal,
  };
};
