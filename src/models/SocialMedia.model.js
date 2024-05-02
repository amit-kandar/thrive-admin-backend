const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Social_Media = sequelize.define('social_media', {
        platform: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    })
    return Social_Media;
}