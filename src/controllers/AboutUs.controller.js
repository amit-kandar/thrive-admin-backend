const db = require('../config/sequelize.js');
const APIError = require('../utils/APIError.js');
const APIResponse = require('../utils/APIResponse.js');
const AboutUsModel = db.AboutUsModel;

const aboutUs = async (req, res, next) => {
    try {
        const { title, sub_title, points, has_cta, cta_text, cover_image, image } = req.body;

        const info = {};

        if (title) info.title = title;
        if (sub_title) info.sub_title = sub_title;
        if (points) info.points = points.join(', ');
        if (has_cta) info.has_cta = has_cta;
        if (cta_text) info.cta_text = cta_text;
        if (cover_image) info.cover_image = cover_image;
        if (image) info.image = image;

        const response = await AboutUsModel.create(info);
        if (!response) {
            throw new APIError(400, "Failed to add data");
        }

        res.status(200).json(new APIResponse(
            201,
            response,
            "Successfully added data"
        ));
    } catch (error) {
        next(error);
    }
}

module.exports = aboutUs;