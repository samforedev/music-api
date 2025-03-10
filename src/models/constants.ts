export const BASE_URL = "/api/v1";
export const MONGO_URI = process.env.MONGO_URI || "";
export const MONGO_URI_ATLAS = process.env.MONGO_URI_ATLAS || "";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;


// Error constants
export const RESOURCE_NOT_FOUND = "Resource not found";
export const RESOURCE_ALREADY_EXISTS = "Already exists";
export const FIELD_REQUIRED = "Field is required";
export const ERROR_CREATING = "Error creating";
export const ERROR_UPDATING = "Error updating";
export const ERROR_CHANGESTATUS = "Error changed status";

// Response Handler
export const SUCCESS_RESPONSE = "Successful response";
export const ERROR_RESPONSE = "Error response";
export const INVALID_REQUEST_DATA = "Invalid request data";

// Bands
export const ADDMANY_MEMBERS_ERROR_ARRAY = "Invalidad Artist Ids, is not empty";
export const ERROR_ADD_MANY = "No se guardaron todos los miembros";
export const ARTIST_ALREADY_IN_BAND = "Artist already in band";
export const ALBUM_ERROR_ASSIGN_BAND = "The album could not be assigned to the band ";

// Songs
export const BAND_NOT_ASSIGN = "no band has been assigned";
export const ALBUM_NOT_ASSING = "no album has been assigned";