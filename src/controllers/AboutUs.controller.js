const db = require('../config/sequelize.js');
const AboutUsModel = db.AboutUsModel;
const AboutUsPointsModel = db.AboutUsPointsModel;

const aboutUs = async (req, res) => {
    try {
        const points = [
            "point1",
            "point2",
            "point3",
            "point4",
            "point5",
        ]
        const points_data = points.join(', ');

        const info = {
            title: "This is title",
            sub_title: "This is sub title",
            points: points_data
        }

        // Create the AboutUs entry
        await AboutUsModel.create(info);

        res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error('Error creating AboutUs entry and points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = aboutUs;
