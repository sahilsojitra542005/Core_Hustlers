import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMaintenanceLog extends Document {
  vehicle: Types.ObjectId;
  maintenanceType: string;
  cost: number;
  startDate: Date;
  endDate?: Date;
  status: "Active" | "Closed";
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceLogSchema = new Schema<IMaintenanceLog>(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    maintenanceType: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Closed"],
      default: "Active",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MaintenanceLog = mongoose.model<IMaintenanceLog>("MaintenanceLog", maintenanceLogSchema);
export default MaintenanceLog;
