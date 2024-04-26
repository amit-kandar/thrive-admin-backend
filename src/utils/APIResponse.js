const logger = require("../config/logger");

class APIResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.timestamp = new Date();

        logger.info(`API Response - Status: ${statusCode}, Message: ${message}`);
    }
}

module.exports = { APIResponse };