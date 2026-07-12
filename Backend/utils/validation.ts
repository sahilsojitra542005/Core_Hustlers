import HttpError from "./HttpError.js";

export const requireNonNegativeNumber = (value: unknown, fieldName: string): number => {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${fieldName} is required`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new HttpError(400, `${fieldName} must be a valid non-negative number`);
  }

  return parsed;
};

export const optionalNonNegativeNumber = (
  value: unknown,
  fieldName: string
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return requireNonNegativeNumber(value, fieldName);
};
