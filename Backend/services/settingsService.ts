import Setting from "../models/Setting.js";

const defaultSettings = {
  depotName: "Gandhinagar Depot GJ4",
  currency: "INR (Rs)",
  distanceUnit: "Kilometers",
};

export const getSettings = async () => {
  let setting = await Setting.findOne();

  if (!setting) {
    setting = await Setting.create(defaultSettings);
  }

  return setting;
};

export const updateSettings = async (payload: {
  depotName?: string;
  currency?: string;
  distanceUnit?: string;
}) => {
  let setting = await Setting.findOne();

  if (!setting) {
    setting = new Setting();
  }

  if (payload.depotName !== undefined) setting.depotName = payload.depotName;
  if (payload.currency !== undefined) setting.currency = payload.currency;
  if (payload.distanceUnit !== undefined) setting.distanceUnit = payload.distanceUnit;

  return setting.save();
};
