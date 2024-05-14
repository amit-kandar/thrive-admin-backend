const { DataTypes } = require('sequelize');

const Price = (sequelize) => {
    const Price = sequelize.define('Price', {
        level: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subscribe_button: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    })
    return Price;
};

module.exports = Price;