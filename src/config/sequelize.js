require('dotenv').config() // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP
const { Sequelize, DataTypes } = require('sequelize')

const info = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: 'mysql'
}

const sequelize = new Sequelize(
    info.DB,
    info.USER,
    info.PASSWORD, {
    host: info.HOST,
    dialect: info.dialect,
    operatorAliases: false
}
)

sequelize.authenticate()
    .then(() => {
        console.log("Connected!");
    })
    .catch(err => {
        console.log('Error: ' + err);
    })

const db = {}

db.sequelize = sequelize

db.AboutUsModel = require('../models/AboutUs.model.js')(sequelize, DataTypes);

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("re-sync Done!");
    })
    .catch(err => {
        console.log(err);
    })

module.exports = db