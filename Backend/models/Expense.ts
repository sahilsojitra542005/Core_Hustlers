import mongoose, { Document, Schema, Types } from "mongoose";

export interface IExpense extends Document {
  trip?: Types.ObjectId;
  vehicle: Types.ObjectId;
  toll: number;
  other: number;
  maintenanceCost: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: false,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    toll: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    other: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    maintenanceCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
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

const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
export default Expense;
