import { Sequelize } from 'sequelize';
import logger from '../config/logger.js';

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

import AboutModel from '../models/About.model.js';
import SocialMediaModel from '../models/SocialMedia.model.js';
import PagePathModel from '../models/PagePath.model.js';
import FooterModel from '../models/Footer.model.js';
import CourseModel from '../models/Course.model.js';

const models = {
    About: AboutModel(sequelize),
    SocialMedia: SocialMediaModel(sequelize),
    PagePath: PagePathModel(sequelize),
    Footer: FooterModel(sequelize),
    Course: CourseModel(sequelize)
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

export { sequelize, connectToDatabase, models, synchronizeDatabase };