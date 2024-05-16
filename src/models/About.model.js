const { DataTypes } = require('sequelize');

const About = (sequelize) => {
    const About = sequelize.define('About', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sub_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.STRING,
            allowNull: false
        },
        has_cta: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        cta_text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cover_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        about_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        about_image_public_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cover_image_public_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });
    return About;
};

module.exports = About;