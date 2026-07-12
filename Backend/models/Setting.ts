import mongoose, { Document, Schema } from "mongoose";

export interface ISetting extends Document {
  depotName: string;
  currency: string;
  distanceUnit: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    depotName: {
      type: String,
      required: true,
      default: "Gandhinagar Depot GJ4",
    },
    currency: {
      type: String,
      required: true,
      default: "INR (Rs)",
    },
    distanceUnit: {
      type: String,
      required: true,
      default: "Kilometers",
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model<ISetting>("Setting", settingSchema);
export default Setting;
