import { DataTypes } from 'sequelize';

const SocialMedia = (sequelize) => {
    const SocialMedia = sequelize.define('social_media', {
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
    });
    return SocialMedia;
};

export default SocialMedia;