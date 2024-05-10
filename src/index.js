require("dotenv").config();
const app = require("./app.js");
const cloudinary = require("cloudinary").v2;
const logger = require("./config/logger.js");
const { connectToDatabase, synchronizeDatabase } = require('./db/index.js');

const PORT = process.env.PORT || 8000;

// Define the configuration parameters
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

async function startServer() {
    try {
        // Connect to the database
        await connectToDatabase();

        // Sync models with database
        await synchronizeDatabase();

        // Start the server
        app.on("error", err => {
            logger.error("Error: ", err);
        });

        app.listen(PORT, () => {
            logger.info(`Server is running at port ${PORT}`);
        });
    } catch (error) {
        logger.error('Error starting the server:', error);
    }
}

// Start the server
startServer();