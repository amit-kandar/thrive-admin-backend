const { Sequelize } = require('sequelize');
const logger = require('../config/logger.js');

const info = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB
};

const sequelize = new Sequelize(info.DB, info.USER, info.PASSWORD, {
    host: info.HOST,
    dialect: 'mysql'
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

const AboutModel = require('../models/About.model.js')(sequelize);
const SocialMediaModel = require('../models/SocialMedia.model.js')(sequelize);
const PagePathModel = require('../models/PagePath.model.js')(sequelize);
const FooterModel = require('../models/Footer.model.js')(sequelize);
const CourseModel = require('../models/Course.model.js')(sequelize);
const PriceModel = require('../models/Price.model.js')(sequelize);
const PriceFeaturesList = require('../models/PriceFeaturesList.model.js')(sequelize);

const models = {
    About: AboutModel,
    SocialMedia: SocialMediaModel,
    PagePath: PagePathModel,
    Footer: FooterModel,
    Course: CourseModel,
    Price: PriceModel,
    PriceFeaturesList: PriceFeaturesList
};

// Define associations
models.Footer.hasMany(models.SocialMedia, { as: 'social_media' });
models.Footer.hasMany(models.PagePath, { as: 'page_path' });
models.Footer.hasMany(models.Course, { as: 'course' });
models.Price.hasMany(models.PriceFeaturesList, { as: 'PriceFeaturesList' });

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