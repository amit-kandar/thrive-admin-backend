const { DataTypes } = require('sequelize');

const PriceFeaturesList = (sequelize) => {
    const priceFeaturesList = sequelize.define('PriceFeaturesList', {
        label: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    })

    return priceFeaturesList;
}

module.exports = PriceFeaturesList;