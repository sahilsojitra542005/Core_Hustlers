import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFuelLog extends Document {
  vehicle: Types.ObjectId;
  liters: number;
  cost: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const fuelLogSchema = new Schema<IFuelLog>(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    liters: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const FuelLog = mongoose.model<IFuelLog>("FuelLog", fuelLogSchema);
export default FuelLog;
