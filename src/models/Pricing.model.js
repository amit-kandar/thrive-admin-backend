const { DataTypes } = require('sequelize');

const Pricing = (sequelize) => {
    const Pricing = sequelize.define('Pricing', {
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
    return Pricing;
};

module.exports = Pricing;