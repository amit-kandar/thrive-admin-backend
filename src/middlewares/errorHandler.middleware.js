// errorHandler.middleware.js

import APIError from "../utils/APIError.js";
import logger from "../config/logger.js";

export default function errorHandler(err, req, res, next) {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors = [];
    let data = null;

    if (err instanceof APIError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
        data = err.data;
    } else {
        errors = [err.message];
    }

    // Log the error details
    logger.error(`Error occurred: ${message}`, {
        statusCode,
        errors,
        data,
        stack: err.stack // Include stack trace if available
    });

    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors,
        data,
    });
};