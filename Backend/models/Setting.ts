import mongoose, { Document, Schema } from "mongoose";

export interface ISetting extends Document {
  depotName: string;
  currency: string;
  distanceUnit: string;
  routeRoles: Record<string, string[]>;
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
    routeRoles: {
      type: Map,
      of: [String],
      default: {
        "/dashboard": ["Dispatcher", "Financial Analyst", "Admin"],
        "/settings": ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "Admin"],
        "/fleet": ["Fleet Manager", "Admin"],
        "/drivers": ["Safety Officer", "Admin"],
        "/trips": ["Dispatcher", "Admin"],
        "/maintenance": ["Fleet Manager", "Admin"],
        "/fuel-expenses": ["Financial Analyst", "Admin"],
        "/analytics": ["Financial Analyst", "Admin"]
      }
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model<ISetting>("Setting", settingSchema);
export default Setting;
