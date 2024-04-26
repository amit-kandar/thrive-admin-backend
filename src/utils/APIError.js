const fs = require("fs");
const path = require("path");
const logger = require("../config/logger.js");

class APIError extends Error {
    statusCode;
    message;
    errors;
    data;

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        data = null
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = data;

        const directoryPath = "public/temp/";

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                logger.error('Error reading directory:', { error: err });
                return;
            }

            files.forEach((file) => {
                if (path.extname(file) === ".png") {
                    const filePath = path.join(directoryPath, file);
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            logger.error(`Error deleting file ${filePath}:`, { error });
                        }
                    });
                }
            });
        });
    }
}

module.exports = APIError