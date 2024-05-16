const Joi = require('joi');
const { models } = require('../db/index.js');
const APIError = require('../utils/APIError.js');
const APIResponse = require('../utils/APIResponse.js');
const uploadToCloudinary = require('../utils/cloudinary.js');

const addData = async (req, res, next) => {
    try {
        // Check if data already exists
        const isDataPresent = await models.About.findOne({ where: { id: 1 } });
        if (isDataPresent) {
            throw new APIError(400, "Data already exists");
        }

        // Validate request body
        const schema = Joi.object({
            title: Joi.string().required(),
            sub_title: Joi.string().required(),
            points: Joi.string().required(),
            has_cta: Joi.boolean().required(),
            cta_text: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            throw new APIError(400, "Validation error: " + error.details.map(d => d.message).join(', '));
        }

        // Check if files are present
        if (!req.files || !req.files.cover_image || !req.files.about_image) {
            throw new APIError(400, "Images are required!");
        }

        // Upload files in parallel
        const [coverImageResponse, aboutImageResponse] = await Promise.all([
            uploadToCloudinary(req.files.cover_image[0].path, "about_us"),
            uploadToCloudinary(req.files.about_image[0].path, "about_us")
        ]);

        // Check if file uploads were successful
        if (typeof coverImageResponse === 'string' || typeof aboutImageResponse === 'string') {
            throw new APIError(400, "File upload failed.");
        }

        // Extract file URLs and public IDs
        const { url: cover_image_url, public_id: cover_image_public_id } = coverImageResponse;
        const { url: about_image_url, public_id: about_image_public_id } = aboutImageResponse;

        // Create data object
        const new_points = Array.isArray(req.body.points) ? req.body.points.join(', ') : req.body.points;
        const info = {
            title: req.body.title,
            sub_title: req.body.sub_title,
            points: new_points,
            has_cta: req.body.has_cta,
            cta_text: req.body.cta_text,
            cover_image: cover_image_url,
            cover_image_public_id,
            about_image: about_image_url,
            about_image_public_id
        };

        // Insert data into the database
        const response = await models.About.create(info);

        if (!response) {
            throw new APIError(400, "Failed to add data");
        }

        // change the points string to array
        response.dataValues.points = response.dataValues.points.split(', ')

        res.status(201).json(new APIResponse(201, response, "Successfully added data"));
    } catch (error) {
        next(error);
    }
};

const updateData = async (req, res, next) => {
    try {
        // Define Joi schema for request body validation
        const schema = Joi.object({
            title: Joi.string().optional(),
            sub_title: Joi.string().optional(),
            points: Joi.array().items(
                Joi.string().optional(),
            ),
            has_cta: Joi.boolean().optional(),
            cta_text: Joi.string().optional(),
        });

        // Validate request body against the schema
        const { error, value: validatedData } = schema.validate({
            title: req.body.title,
            sub_title: req.body.sub_title,
            points: req.body.points,
            has_cta: req.body.has_cta,
            cta_text: req.body.cta_text
        });

        // If validation fails, throw an error
        if (error) {
            throw new APIError(400, "Validation error: " + error.details.map(d => d.message).join(', '));
        }

        // Set validated data
        const info = {};
        if (validatedData.title) info.title = validatedData.title;
        if (validatedData.sub_title) info.sub_title = validatedData.sub_title;
        if (validatedData.points) {
            info.points = Array.isArray(validatedData.points) ? validatedData.points.join(', ') : validatedData.points;
        }
        if (validatedData.has_cta !== null) info.has_cta = validatedData.has_cta;
        if (validatedData.cta_text) info.cta_text = validatedData.cta_text;

        // Upload cover image if present
        if (req.files && req.files.cover_image && req.files.cover_image[0]) {
            const coverImageLocalPath = req.files.cover_image[0].path;
            const coverImageResponse = await uploadToCloudinary(coverImageLocalPath, "about_us");

            if (typeof coverImageResponse === 'string') {
                throw new APIError(400, "Cover image upload failed.");
            }

            const { url: cover_image_url, public_id: cover_image_public_id } = coverImageResponse;
            info.cover_image_url = cover_image_url;
            info.cover_image_public_id = cover_image_public_id;
        }

        // Upload image if present
        if (req.files && req.files.image && req.files.image[0]) {
            const imageLocalPath = req.files.image[0].path;
            const imageResponse = await uploadToCloudinary(imageLocalPath, "about_us");

            if (typeof imageResponse === 'string') {
                throw new APIError(400, "Image upload failed.");
            }

            const { url: image_url, public_id: image_public_id } = imageResponse;
            info.image_url = image_url;
            info.image_public_id = image_public_id;
        }

        // Update database with new information
        const response = await models.About.update(info, {
            where: { id: 1 }
        });

        // Check if update was successful
        if (!response || response[0] === 0) {
            throw new APIError(400, "Failed to update data");
        }

        // Find data by ID
        let data = await models.About.findOne({ where: { id: 1 } });

        // Check if data exists
        if (!data) {
            throw new APIError(404, "Data not found");
        }

        // Change the points string to array
        if (data.points) {
            data.points = data.points.split(', ');
        }

        // Respond with success message
        res.status(200).json(new APIResponse(
            200,
            data,
            "Successfully updated data"
        ));
    } catch (error) {
        next(error);
    }
};

const getData = async (req, res, next) => {
    try {
        // Find data by ID
        let data = await models.About.findOne({ where: { id: 1 } });

        // Check if data exists
        if (!data) {
            throw new APIError(404, "Data not found");
        }

        // change the points string to array
        data.dataValues.points = data.dataValues.points.split(', ')

        // Respond with the data
        res.status(200).json({
            status: 200,
            data: data,
            message: "Successfully retrieved data"
        });
    } catch (error) {
        // Pass errors to the error handling middleware
        next(error);
    }
};

module.exports = { updateData, getData, addData };