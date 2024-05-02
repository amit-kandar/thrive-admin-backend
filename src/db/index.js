const { Sequelize } = require('sequelize');
const logger = require('../config/logger.js');
const { HOST, USER, PASSWORD, DB } = process.env;

const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: 'mysql',
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Connected to the database!');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1); // Exit the process if unable to connect
    }
}

const models = {
    About: require('../models/About.model.js')(sequelize),
    SocialMedia: require('../models/SocialMedia.model.js')(sequelize),
    PagePath: require('../models/PagePath.model.js')(sequelize),
    Footer: require('../models/Footer.model.js')(sequelize)
};

// Define associations
models.Footer.hasMany(models.SocialMedia, { as: 'social_media' });
models.Footer.hasMany(models.PagePath, { as: 'page_path' });

async function synchronizeDatabase() {
    try {
        await sequelize.sync({ force: false });
        logger.info('Database synchronized!');
    } catch (error) {
        logger.error('Error synchronizing database:', error);
        process.exit(1); // Exit the process if sync fails
    }
}

module.exports = { sequelize, connectToDatabase, models, synchronizeDatabase };