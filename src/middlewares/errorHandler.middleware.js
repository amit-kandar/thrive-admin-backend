// errorHandler.middleware.js

const APIError = require("../utils/APIError.js");
const logger = require("../config/logger.js");

module.exports = function errorHandler(err, req, res, next) {
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