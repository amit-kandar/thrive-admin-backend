const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AboutUs = sequelize.define('AboutUs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING
        },
        sub_title: {
            type: DataTypes.STRING
        },
        points: {
            type: DataTypes.STRING
        },
        isCTAOn: {
            type: DataTypes.BOOLEAN
        },
        CTAText: {
            type: DataTypes.STRING
        },
        cover_image: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'about_us',
        timestamps: true
    });
    return AboutUs;
}