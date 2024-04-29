const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const logger = require('../config/logger');

const MAX_UPLOAD_TRIES = 2;

const uploadToCloudinary = async (filePath, folderName) => {
    let tries = 0;

    while (tries < MAX_UPLOAD_TRIES) {
        try {
            if (!filePath) throw new Error("File path is required!");

            // Upload the file to Cloudinary
            const response = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto",
                folder: `thrive/${folderName}`
            });

            // File uploaded successfully
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return response;
        } catch (error) {
            tries++;
            logger.error("Cloudinary Error: ", { error }); // Logging the Cloudinary error using your logger

            if (tries === MAX_UPLOAD_TRIES) {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                logger.error("Cloudinary file upload operation failed after multiple attempts!");
                return "Cloudinary file upload operation failed after multiple attempts!";
            }
        }
    }

    return "Cloudinary file upload operation failed after multiple attempts!";
};

module.exports = uploadToCloudinary;