import mongoose, { Document, Schema } from "mongoose";

export interface IDriver extends Document {
  name: string;
  licenseNumber: string;
  licenseCategory: "LMV" | "HMV";
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore: number;
  tripCompletionRate: number;
  status: "Available" | "On Trip" | "Off Duty" | "Suspended";
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    licenseCategory: {
      type: String,
      required: true,
      enum: ["LMV", "HMV"],
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    safetyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 100,
    },
    tripCompletionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 100,
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "On Trip", "Off Duty", "Suspended"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model<IDriver>("Driver", driverSchema);
export default Driver;
