import mongoose, { Document, Schema } from "mongoose";

export interface IVehicle extends Document {
  regNumber: string;
  modelName: string;
  type: "Van" | "Truck" | "Mini";
  capacity: number;
  odometer: number;
  acquisitionCost: number;
  status: "Available" | "On Trip" | "In Shop" | "Retired";
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    regNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    modelName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Van", "Truck", "Mini"],
    },
    capacity: {
      type: Number,
      required: true, // in kg
      min: 0,
    },
    odometer: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    acquisitionCost: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "On Trip", "In Shop", "Retired"],
      default: "Available",
    },
    region: {
      type: String,
      default: "All",
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model<IVehicle>("Vehicle", vehicleSchema);
export default Vehicle;
