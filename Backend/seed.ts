import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Driver from "./models/Driver.js";
import Trip from "./models/Trip.js";
import MaintenanceLog from "./models/MaintenanceLog.js";
import FuelLog from "./models/FuelLog.js";
import Expense from "./models/Expense.js";
import Setting from "./models/Setting.js";

dotenv.config();

const seedDatabase = async () => {
  console.log("=== STARTING TRANSITOPS DATABASE SEEDING ===");

  const mongodbUrl = process.env.MONGODB_URL;
  if (!mongodbUrl) {
    console.error("Error: MONGODB_URL environment variable is not defined.");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log("Connecting to database...");
    await mongoose.connect(mongodbUrl, {
      dbName: "transitops",
    });
    console.log("Connected to transitops database successfully.");

    // Clean existing data
    console.log("Cleaning existing collections...");
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await MaintenanceLog.deleteMany({});
    await FuelLog.deleteMany({});
    await Expense.deleteMany({});
    await Setting.deleteMany({});
    console.log("All collections cleaned.");

    // ==========================================
    // 1. Seed Users (Roles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)
    // ==========================================
    console.log("Seeding Users...");
    const usersData = [
      {
        email: "manager@transitops.com",
        password: "password123",
        role: "Fleet Manager",
      },
      {
        email: "dispatcher@transitops.com",
        password: "password123",
        role: "Dispatcher",
      },
      {
        email: "safety@transitops.com",
        password: "password123",
        role: "Safety Officer",
      },
      {
        email: "finance@transitops.com",
        password: "password123",
        role: "Financial Analyst",
      },
    ];

    // Using create to trigger pre-save hooks (password hashing)
    const seededUsers = await User.create(usersData);
    console.log(`Created ${seededUsers.length} users successfully.`);

    // ==========================================
    // 2. Seed Settings
    // ==========================================
    console.log("Seeding Settings...");
    const setting = await Setting.create({
      depotName: "Gandhinagar Depot GJ4",
      currency: "INR (Rs)",
      distanceUnit: "Kilometers",
    });
    console.log("Created depot settings.");

    // ==========================================
    // 3. Seed Vehicles
    // ==========================================
    console.log("Seeding Vehicles...");
    const vehiclesData = [
      {
        regNumber: "GJ-01-XX-1111",
        modelName: "Tata Ace Gold",
        type: "Mini",
        capacity: 850,
        odometer: 12500,
        acquisitionCost: 450000,
        status: "Available",
        region: "Ahmedabad",
      },
      {
        regNumber: "GJ-01-YY-2222",
        modelName: "Mahindra Bolero Pik-Up",
        type: "Van",
        capacity: 1500,
        odometer: 32000,
        acquisitionCost: 850000,
        status: "On Trip",
        region: "Gandhinagar",
      },
      {
        regNumber: "GJ-18-ZZ-3333",
        modelName: "Eicher Pro 2049",
        type: "Truck",
        capacity: 3500,
        odometer: 45000,
        acquisitionCost: 1200000,
        status: "Available",
        region: "Vadodara",
      },
      {
        regNumber: "GJ-03-AA-4444",
        modelName: "Tata LPT 1613",
        type: "Truck",
        capacity: 10000,
        odometer: 98000,
        acquisitionCost: 2200000,
        status: "In Shop",
        region: "Rajkot",
      },
      {
        regNumber: "GJ-05-BB-5555",
        modelName: "Maruti Suzuki Super Carry",
        type: "Mini",
        capacity: 740,
        odometer: 8500,
        acquisitionCost: 500000,
        status: "Available",
        region: "Surat",
      },
    ];

    const seededVehicles = await Vehicle.create(vehiclesData);
    console.log(`Created ${seededVehicles.length} vehicles.`);

    // ==========================================
    // 4. Seed Drivers
    // ==========================================
    console.log("Seeding Drivers...");
    const driversData = [
      {
        name: "Rajesh Kumar",
        licenseNumber: "GJ0120200001234",
        licenseCategory: "LMV",
        licenseExpiryDate: new Date("2030-05-15"),
        contactNumber: "+91 9876543210",
        safetyScore: 92,
        tripCompletionRate: 98,
        status: "Available",
      },
      {
        name: "Suresh Patel",
        licenseNumber: "GJ1820150005678",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2028-11-20"),
        contactNumber: "+91 9876543211",
        safetyScore: 88,
        tripCompletionRate: 95,
        status: "On Trip",
      },
      {
        name: "Amit Sharma",
        licenseNumber: "GJ0320180009999",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2029-01-10"),
        contactNumber: "+91 9876543212",
        safetyScore: 95,
        tripCompletionRate: 100,
        status: "Available",
      },
      {
        name: "Vikram Rathod",
        licenseNumber: "GJ0520210008888",
        licenseCategory: "LMV",
        licenseExpiryDate: new Date("2031-07-22"),
        contactNumber: "+91 9876543213",
        safetyScore: 78,
        tripCompletionRate: 90,
        status: "Off Duty",
      },
      {
        name: "Mahesh Solanki",
        licenseNumber: "GJ0120120002222",
        licenseCategory: "HMV",
        licenseExpiryDate: new Date("2025-12-05"), // expired soon or already expired for demo
        contactNumber: "+91 9876543214",
        safetyScore: 85,
        tripCompletionRate: 92,
        status: "Suspended",
      },
    ];

    const seededDrivers = await Driver.create(driversData);
    console.log(`Created ${seededDrivers.length} drivers.`);

    // ==========================================
    // 5. Seed Trips
    // ==========================================
    console.log("Seeding Trips...");
    
    // Find some seeded records for reference
    const vehicle1 = seededVehicles[0]; // Tata Ace
    const vehicle2 = seededVehicles[1]; // Bolero (On Trip)
    const vehicle3 = seededVehicles[2]; // Eicher

    const driver1 = seededDrivers[0]; // Rajesh
    const driver2 = seededDrivers[1]; // Suresh (On Trip)
    const driver3 = seededDrivers[2]; // Amit

    const tripsData = [
      {
        tripId: "TRIP-2026-001",
        source: "Ahmedabad",
        destination: "Baroda",
        vehicle: vehicle1._id,
        driver: driver1._id,
        cargoWeight: 500,
        plannedDistance: 120,
        status: "Completed",
        startOdometer: 12380,
        endOdometer: 12500,
        fuelConsumed: 12,
        durationMinutes: 150,
      },
      {
        tripId: "TRIP-2026-002",
        source: "Gandhinagar",
        destination: "Surat",
        vehicle: vehicle2._id,
        driver: driver2._id,
        cargoWeight: 1200,
        plannedDistance: 260,
        status: "Dispatched",
        startOdometer: 32000,
      },
      {
        tripId: "TRIP-2026-003",
        source: "Vadodara",
        destination: "Rajkot",
        vehicle: vehicle3._id,
        driver: driver3._id,
        cargoWeight: 2000,
        plannedDistance: 290,
        status: "Draft",
      },
    ];

    const seededTrips = await Trip.create(tripsData);
    console.log(`Created ${seededTrips.length} trips.`);

    // ==========================================
    // 6. Seed MaintenanceLogs
    // ==========================================
    console.log("Seeding Maintenance Logs...");
    const vehicleInShop = seededVehicles[3]; // Tata LPT 1613 (In Shop)
    const maintenanceData = [
      {
        vehicle: vehicleInShop._id,
        maintenanceType: "Engine Overhaul",
        cost: 45000,
        startDate: new Date("2026-07-01"),
        status: "Active",
        description: "Scheduled overhaul due to high mileage and slight engine knocking noise.",
      },
      {
        vehicle: vehicle1._id,
        maintenanceType: "Oil & Filter Change",
        cost: 2500,
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-06-15"),
        status: "Closed",
        description: "Routine maintenance and inspection.",
      },
    ];

    const seededMaintenance = await MaintenanceLog.create(maintenanceData);
    console.log(`Created ${seededMaintenance.length} maintenance logs.`);

    // ==========================================
    // 7. Seed FuelLogs
    // ==========================================
    console.log("Seeding Fuel Logs...");
    const fuelData = [
      {
        vehicle: vehicle1._id,
        liters: 15,
        cost: 1500,
        date: new Date("2026-07-10"),
      },
      {
        vehicle: vehicle2._id,
        liters: 45,
        cost: 4500,
        date: new Date("2026-07-11"),
      },
      {
        vehicle: vehicle3._id,
        liters: 60,
        cost: 6000,
        date: new Date("2026-07-12"),
      },
    ];

    const seededFuel = await FuelLog.create(fuelData);
    console.log(`Created ${seededFuel.length} fuel logs.`);

    // ==========================================
    // 8. Seed Expenses
    // ==========================================
    console.log("Seeding Expenses...");
    const expenseData = [
      {
        trip: seededTrips[0]._id, // Completed trip
        vehicle: vehicle1._id,
        toll: 340,
        other: 150,
        maintenanceCost: 0,
        date: new Date("2026-07-10"),
        description: "Highway toll taxes and driver refreshment allowance.",
      },
      {
        vehicle: vehicleInShop._id, // In shop vehicle
        toll: 0,
        other: 800,
        maintenanceCost: 45000,
        date: new Date("2026-07-02"),
        description: "Engine overhaul parts and garage service charges.",
      },
      {
        trip: seededTrips[1]._id, // Dispatched trip
        vehicle: vehicle2._id,
        toll: 520,
        other: 200,
        maintenanceCost: 0,
        date: new Date("2026-07-11"),
        description: "Pre-paid toll passes and roadside assistance fee.",
      },
    ];

    const seededExpenses = await Expense.create(expenseData);
    console.log(`Created ${seededExpenses.length} expenses.`);

    console.log("\n=== DATABASE SEEDING COMPLETED SUCCESSFULLY ===");
  } catch (error: any) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
