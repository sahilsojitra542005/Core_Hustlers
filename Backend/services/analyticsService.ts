import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";

export const getDashboardAnalytics = async (filters: {
  vehicleType?: string;
  region?: string;
}) => {
  const vehicleFilter: any = {};
  if (filters.vehicleType && filters.vehicleType !== "All") {
    vehicleFilter.type = filters.vehicleType;
  }
  if (filters.region && filters.region !== "All") {
    vehicleFilter.region = filters.region;
  }

  const vehicles = await Vehicle.find(vehicleFilter);

  const activeVehicles = vehicles.filter((v) => v.status === "On Trip").length;
  const availableVehicles = vehicles.filter((v) => v.status === "Available").length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === "In Shop").length;
  const retiredVehicles = vehicles.filter((v) => v.status === "Retired").length;

  const activeTripsCount = await Trip.countDocuments({ status: "Dispatched" });
  const pendingTripsCount = await Trip.countDocuments({ status: "Draft" });

  const driversOnDutyCount = await Driver.countDocuments({
    status: { $in: ["Available", "On Trip"] },
  });

  const operationalCount = activeVehicles + availableVehicles + maintenanceVehicles;
  const utilization =
    operationalCount > 0 ? Math.round((activeVehicles / operationalCount) * 100) : 0;

  const recentTrips = await Trip.find()
    .populate("vehicle")
    .populate("driver")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    kpis: {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance: maintenanceVehicles,
      activeTrips: activeTripsCount,
      pendingTrips: pendingTripsCount,
      driversOnDuty: driversOnDutyCount,
      fleetUtilization: utilization,
    },
    recentTrips,
    statusBreakdown: {
      available: availableVehicles,
      onTrip: activeVehicles,
      inShop: maintenanceVehicles,
      retired: retiredVehicles,
    },
  };
};

export const getReportAnalytics = async () => {
  const completedTrips = await Trip.find({ status: "Completed" });
  const totalDistance = completedTrips.reduce((acc, t) => acc + (t.plannedDistance || 0), 0);
  const totalFuelConsumed = completedTrips.reduce((acc, t) => acc + (t.fuelConsumed || 0), 0);
  const fuelEfficiency =
    totalFuelConsumed > 0 ? parseFloat((totalDistance / totalFuelConsumed).toFixed(1)) : 0;

  const fuelTotalResult = await FuelLog.aggregate([
    { $group: { _id: null, total: { $sum: "$cost" } } },
  ]);
  const fuelCost = fuelTotalResult[0]?.total || 0;

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
  const tollsCost = expenseTotalResult[0]?.totalToll || 0;
  const otherCost = expenseTotalResult[0]?.totalOther || 0;
  const maintCost = expenseTotalResult[0]?.totalMaint || 0;

  const totalOperationalCost = fuelCost + tollsCost + otherCost + maintCost;

  const totalVehicles = await Vehicle.countDocuments({ status: { $ne: "Retired" } });
  const activeVehicles = await Vehicle.countDocuments({ status: "On Trip" });
  const utilization =
    totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

  const totalRevenue = completedTrips.reduce(
    (acc, t) => acc + (t.plannedDistance || 0) * 80,
    0
  );

  const totalAcquisitionResult = await Vehicle.aggregate([
    { $group: { _id: null, total: { $sum: "$acquisitionCost" } } },
  ]);
  const totalAcquisitionCost = totalAcquisitionResult[0]?.total || 0;

  const roiDenominator = totalAcquisitionCost > 0 ? totalAcquisitionCost : 1;
  const overallRoi = parseFloat(
    (((totalRevenue - (maintCost + fuelCost)) / roiDenominator) * 100).toFixed(1)
  );

  const monthlyRevenue = Array(12).fill(0);
  completedTrips.forEach((trip) => {
    const tripDate = new Date(trip.createdAt || trip.updatedAt);
    if (tripDate.getFullYear() === new Date().getFullYear()) {
      const month = tripDate.getMonth();
      monthlyRevenue[month] += (trip.plannedDistance || 0) * 80;
    }
  });

  const vehiclesList = await Vehicle.find({ status: { $ne: "Retired" } });
  const costliestVehicles: Array<{
    _id: string;
    modelName: string;
    regNumber: string;
    totalCost: number;
  }> = [];

  for (const vehicle of vehiclesList) {
    const vFuelResult = await FuelLog.aggregate([
      { $match: { vehicle: vehicle._id } },
      { $group: { _id: null, total: { $sum: "$cost" } } },
    ]);
    const vFuel = vFuelResult[0]?.total || 0;

    const vExpenseResult = await Expense.aggregate([
      { $match: { vehicle: vehicle._id } },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$toll", "$other", "$maintenanceCost"] } },
        },
      },
    ]);
    const vExpense = vExpenseResult[0]?.total || 0;

    costliestVehicles.push({
      _id: (vehicle._id as any).toString(),
      modelName: vehicle.modelName,
      regNumber: vehicle.regNumber,
      totalCost: vFuel + vExpense,
    });
  }

  costliestVehicles.sort((a, b) => b.totalCost - a.totalCost);

  return {
    kpis: {
      fuelEfficiency,
      fleetUtilization: utilization,
      operationalCost: totalOperationalCost,
      vehicleRoi: overallRoi,
    },
    monthlyRevenue,
    topCostliestVehicles: costliestVehicles.slice(0, 5),
  };
};
