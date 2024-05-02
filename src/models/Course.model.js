const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Course = sequelize.define('Course', {
        course_id: {
            type: DataTypes.STRING,
            allowNul: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNul: false
        },
        image: {
            type: DataTypes.STRING,
            allowNul: false,
        },
        level: {
            type: DataTypes.STRING,
            allowNul: false
        }
    }, {
        timestamps: true
    })
    return Course;
}