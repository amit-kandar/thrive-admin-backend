import { DataTypes } from 'sequelize';

const PagePath = (sequelize) => {
    const PagePath = sequelize.define('page_path', {
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true
    });
    return PagePath;
};

export default PagePath;