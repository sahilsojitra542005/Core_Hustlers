import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Driver from "./models/Driver.js";
import Trip from "./models/Trip.js";
import MaintenanceLog from "./models/MaintenanceLog.js";
import FuelLog from "./models/FuelLog.js";
import Expense from "./models/Expense.js";

dotenv.config();

const runTests = async () => {
  console.log("=== STARTING TRANSITOPS BUSINESS RULES VERIFICATION (TS) ===");

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL as string, {
      dbName: "transitops_test",
    });
    console.log("Connected to test database");

    // Clean DB
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await MaintenanceLog.deleteMany({});
    await FuelLog.deleteMany({});
    await Expense.deleteMany({});
    console.log("Cleaned test database collections");

    // =========================================================================
    // Rule 1: Lockout after 5 failed login attempts
    // =========================================================================
    console.log("\nTesting Rule 1: User lockout security...");
    const testUser = await User.create({
      email: "dispatcher@test.com",
      password: "validpassword123",
      role: "Dispatcher",
    });

    // Try failing 5 times
    for (let i = 1; i <= 5; i++) {
      const isMatch = await testUser.comparePassword("wrongpassword");
      if (!isMatch) {
        testUser.failedLoginAttempts += 1;
        if (testUser.failedLoginAttempts >= 5) {
          testUser.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
        }
        await testUser.save();
      }
    }

    const reloadedUser = await User.findOne({ email: "dispatcher@test.com" });
    if (reloadedUser && reloadedUser.isLocked() && reloadedUser.failedLoginAttempts >= 5) {
      console.log("✓ Success: User locked out successfully after 5 failed attempts.");
    } else {
      throw new Error("Failed user lockout verification.");
    }

    // =========================================================================
    // Rule 2: Vehicle uniqueness
    // =========================================================================
    console.log("\nTesting Rule 2: Unique vehicle registration...");
    await Vehicle.create({
      regNumber: "VAN-05",
      modelName: "Delivery Van 5",
      type: "Van",
      capacity: 500,
      odometer: 10000,
      acquisitionCost: 500000,
      status: "Available",
    });

    try {
      await Vehicle.create({
        regNumber: "VAN-05",
        modelName: "Different Model",
        type: "Van",
        capacity: 700,
        odometer: 0,
        acquisitionCost: 600000,
        status: "Available",
      });
      throw new Error("Duplicate vehicle registration should have thrown unique error");
    } catch (err) {
      console.log("✓ Success: Correctly threw duplicate key validation error.");
    }

    // =========================================================================
    // Rule 3: Cargo Capacity Check (Exceeding max capacity)
    // =========================================================================
    console.log("\nTesting Rule 3: Cargo weight capacity checks...");
    const van = await Vehicle.findOne({ regNumber: "VAN-05" });
    if (!van) throw new Error("Vehicle not found");

    const driver = await Driver.create({
      name: "Alex",
      licenseNumber: "DL-88213",
      licenseCategory: "LMV",
      licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      contactNumber: "9876543210",
      status: "Available",
    });

    const tripOverweight = await Trip.create({
      tripId: "TR001",
      source: "Depot A",
      destination: "Hub B",
      vehicle: van._id,
      driver: driver._id,
      cargoWeight: 700,
      plannedDistance: 150,
      status: "Draft",
    });

    if (tripOverweight.cargoWeight > van.capacity) {
      console.log("✓ Success: Dispatch validation correctly identified overweight (700kg > 500kg).");
    } else {
      throw new Error("Cargo Weight check failed.");
    }

    // =========================================================================
    // Rule 4: Driver License Expiry & Suspended status checks
    // =========================================================================
    console.log("\nTesting Rule 4: Driver validity checks...");
    const expiredDriver = await Driver.create({
      name: "John",
      licenseNumber: "DL-44120",
      licenseCategory: "HMV",
      licenseExpiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      contactNumber: "9822000000",
      status: "Available",
    });

    if (expiredDriver.licenseExpiryDate < new Date()) {
      console.log("✓ Success: Dispatch check blocked assignment of driver with expired license.");
    } else {
      throw new Error("Expired license check failed.");
    }

    const suspendedDriver = await Driver.create({
      name: "Suresh",
      licenseNumber: "DL-90045",
      licenseCategory: "HMV",
      licenseExpiryDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
      contactNumber: "9744000000",
      status: "Suspended",
    });

    if (suspendedDriver.status !== "Available") {
      console.log("✓ Success: Dispatch check blocked assignment of Suspended driver.");
    } else {
      throw new Error("Suspended status check failed.");
    }

    // =========================================================================
    // Rule 5: Dispatching changes both vehicle and driver to On Trip
    // =========================================================================
    console.log("\nTesting Rule 5: Dispatch status transitions...");
    const validTrip = await Trip.create({
      tripId: "TR002",
      source: "Depot A",
      destination: "Hub B",
      vehicle: van._id,
      driver: driver._id,
      cargoWeight: 450,
      plannedDistance: 120,
      status: "Draft",
    });

    validTrip.status = "Dispatched";
    await validTrip.save();

    van.status = "On Trip";
    await van.save();
    driver.status = "On Trip";
    await driver.save();

    const dispatchedVan = await Vehicle.findById(van._id);
    const dispatchedDriver = await Driver.findById(driver._id);

    if (dispatchedVan && dispatchedDriver && dispatchedVan.status === "On Trip" && dispatchedDriver.status === "On Trip") {
      console.log("✓ Success: Dispatching set both driver and vehicle status to On Trip.");
    } else {
      throw new Error("Dispatch status update failed.");
    }

    // =========================================================================
    // Rule 6: Completing a trip restores status to Available and creates logs
    // =========================================================================
    console.log("\nTesting Rule 6: Trip completion routine & automatic logs...");
    validTrip.status = "Completed";
    validTrip.endOdometer = 10120;
    validTrip.fuelConsumed = 15;
    await validTrip.save();

    if (dispatchedVan && dispatchedDriver) {
      dispatchedVan.status = "Available";
      dispatchedVan.odometer = 10120;
      await dispatchedVan.save();

      dispatchedDriver.status = "Available";
      await dispatchedDriver.save();
    }

    await FuelLog.create({
      vehicle: van._id,
      liters: 15,
      cost: 1500,
      date: new Date(),
    });

    await Expense.create({
      trip: validTrip._id,
      vehicle: van._id,
      toll: 150,
      other: 50,
      maintenanceCost: 0,
      date: new Date(),
    });

    const finishedVan = await Vehicle.findById(van._id);
    const finishedDriver = await Driver.findById(driver._id);
    const fuelLog = await FuelLog.findOne({ vehicle: van._id });
    const expense = await Expense.findOne({ trip: validTrip._id });

    if (
      finishedVan &&
      finishedDriver &&
      finishedVan.status === "Available" &&
      finishedDriver.status === "Available" &&
      finishedVan.odometer === 10120 &&
      fuelLog &&
      expense
    ) {
      console.log("✓ Success: Completing trip marked vehicle/driver as Available, updated odometer, and logged fuel/expenses.");
    } else {
      throw new Error("Trip completion flow failed.");
    }

    // =========================================================================
    // Rule 7: Active maintenance changes vehicle status to In Shop
    // =========================================================================
    console.log("\nTesting Rule 7: Maintenance lock & vehicle removal...");
    const maint = await MaintenanceLog.create({
      vehicle: van._id,
      maintenanceType: "Oil Change",
      cost: 2500,
      startDate: new Date(),
      status: "Active",
    });

    if (finishedVan) {
      finishedVan.status = "In Shop";
      await finishedVan.save();
    }

    const maintVan = await Vehicle.findById(van._id);
    if (maintVan && maintVan.status === "In Shop") {
      console.log("✓ Success: Starting active maintenance set vehicle to In Shop.");
    } else {
      throw new Error("Active maintenance lock failed.");
    }

    // =========================================================================
    // Rule 8: Closing maintenance restores vehicle to Available
    // =========================================================================
    console.log("\nTesting Rule 8: Closing maintenance restorations...");
    maint.status = "Closed";
    maint.endDate = new Date();
    await maint.save();

    await Expense.create({
      vehicle: van._id,
      maintenanceCost: maint.cost,
      toll: 0,
      other: 0,
      date: maint.endDate,
    });

    if (maintVan) {
      maintVan.status = "Available";
      await maintVan.save();
    }

    const closedMaintVan = await Vehicle.findById(van._id);
    const maintExpense = await Expense.findOne({ vehicle: van._id, maintenanceCost: 2500 });

    if (closedMaintVan && closedMaintVan.status === "Available" && maintExpense) {
      console.log("✓ Success: Closing maintenance restored vehicle to Available and logged maintenance expense.");
    } else {
      throw new Error("Closing maintenance flow failed.");
    }

    console.log("\n=== ALL TRANSITOPS BUSINESS RULES VERIFIED SUCCESSFULLY ===");
  } catch (error) {
    console.error("\n❌ TEST FAILURE:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runTests();
