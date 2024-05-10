const { DataTypes } = require('sequelize');

const Footer = (sequelize) => {
    const Footer = sequelize.define('Footer', {
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: true
    });
    return Footer;
};

module.exports = Footer;