import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITrip extends Document {
  tripId: string;
  source: string;
  destination: string;
  vehicle?: Types.ObjectId;
  driver?: Types.ObjectId;
  cargoWeight: number;
  plannedDistance: number;
  status: "Draft" | "Dispatched" | "Completed" | "Cancelled";
  startOdometer?: number;
  endOdometer?: number;
  fuelConsumed?: number;
  durationMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    tripId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: false,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: false,
    },
    cargoWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    plannedDistance: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
      default: "Draft",
    },
    startOdometer: {
      type: Number,
    },
    endOdometer: {
      type: Number,
      min: 0,
    },
    fuelConsumed: {
      type: Number,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model<ITrip>("Trip", tripSchema);
export default Trip;
