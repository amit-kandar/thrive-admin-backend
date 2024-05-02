import { DataTypes } from 'sequelize';

const Course = (sequelize) => {
    const Course = sequelize.define('Course', {
        course_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_public_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    })
    return Course;
};

export default Course;