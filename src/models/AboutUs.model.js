const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AboutUs = sequelize.define('AboutUs', {
        title: {
            type: DataTypes.STRING
        },
        sub_title: {
            type: DataTypes.STRING
        },
        points: {
            type: DataTypes.STRING
        },
        has_cta: {
            type: DataTypes.BOOLEAN
        },
        cta_text: {
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