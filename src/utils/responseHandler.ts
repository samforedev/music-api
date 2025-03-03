import { Response } from "express";
import {
    SUCCESS_RESPONSE,
    ERROR_RESPONSE,
    INVALID_REQUEST_DATA,
    RESOURCE_NOT_FOUND
} from "../models/constants";

interface ErrorDetail {
    message: string;
}

export class ResponseHandler {
    static success(res: Response, data: any, message: string = SUCCESS_RESPONSE, statusCode: number = 200): void {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res: Response, error: any, statusCode: number = 500): void {
        res.status(statusCode).json({
            success: false,
            message: error.message || ERROR_RESPONSE,
            errors: error.details || []
        });
    }

    static errorRequestData(res: Response, errors: ErrorDetail[], statusCode: number = 400): void {
        res.status(statusCode).json({
            success: false,
            message: INVALID_REQUEST_DATA,
            errors: errors.map(err => err.message) || []
        });
    }

    static errorNotFound(res: Response, resource: string, statusCode: number = 404): void {
        res.status(statusCode).json({
            success: false,
            message: `${resource} ${RESOURCE_NOT_FOUND}`,
            errors: []
        });
    }
}