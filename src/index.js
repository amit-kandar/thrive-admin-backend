import "dotenv/config";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "./config/logger.js";
import { connectToDatabase, synchronizeDatabase } from './db/index.js';

const PORT = process.env.PORT || 8000;

// Define the configuration parameters
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// Connect to the database
connectToDatabase()
    .then(() => {
        // Sync models with database
        return synchronizeDatabase();
    })
    .then(() => {
        app.on("error", err => {
            logger.error("Error: ", err);
        });
        app.listen(PORT, () => {
            logger.info(`Server is running at port ${PORT}`);
        });
    })
    .catch(error => {
        logger.error('Error starting the server:', error);
    });
