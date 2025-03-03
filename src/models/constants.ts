export const BASE_URL = "/api/v1";
export const MONGO_URI = process.env.MONGO_URI || "";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;


// Error constants
export const RESOURCE_NOT_FOUND = "Resource not found";
export const RESOURCE_ALREADY_EXISTS = "Already exists";
export const FIELD_REQUIRED = "Field is required";
export const ERROR_CREATING = "Error creating";
export const ERROR_CHANGESTATUS = "Error changed status";

// Response Handler
export const SUCCESS_RESPONSE = "Successful response";
export const ERROR_RESPONSE = "Error response";
export const INVALID_REQUEST_DATA = "Invalid request data";

