import { nanoid } from 'nanoid';
import Joi from 'joi';
import APIError from '../utils/APIError.js';
import APIResponse from '../utils/APIResponse.js';
import { models, sequelize } from '../db/index.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import cloudinary from 'cloudinary';

const addCourse = async (req, res, next) => {
    try {
        const { name, level } = req.body;
        const schema = Joi.object({
            name: Joi.string().required(),
            level: Joi.string().required()
        });
        const { error } = schema.validate({ name, level });
        if (error) throw new APIError(400, "All fields are required with valid data.");

        const courseId = nanoid(6);
        const existingCourse = await models.Course.findOne({ where: { name } });
        if (existingCourse) throw new APIError(400, "Course already exists");

        const imageLocalPath = req.file?.path;
        const imageResponse = await uploadToCloudinary(imageLocalPath, "course");
        if (typeof imageResponse !== 'object' || !('url' in imageResponse)) {
            throw new APIError(400, "Failed To Upload Image");
        }

        const { url, public_id } = imageResponse;
        const newCourse = await models.Course.create({
            course_id: courseId,
            name,
            image_url: url,
            image_public_id: public_id,
            level,
            FooterId: 1
        });

        if (!newCourse) throw new APIError(400, 'Failed to add the course. Please try again.');

        res.status(201).json(new APIResponse(201, newCourse, "Successfully added course"));
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const { name, level } = req.body;
        const schema = Joi.object({
            name: Joi.string().optional(),
            level: Joi.string().optional()
        });
        const { value, error } = schema.validate({ name, level });
        if (error) throw new APIError(400, "Validation error: " + error.details.map(d => d.message).join(', '));

        const courseId = req.params.courseId || req.body.courseId;
        let course = await models.Course.findOne({ where: { course_id: courseId } });
        if (!course) throw new APIError(404, "Course not found");

        let updatedCourse;
        await sequelize.transaction(async (t) => {
            if (req.file) {
                const imageResponse = await uploadToCloudinary(req.file.path, "course");
                if (typeof imageResponse !== 'object' || !('url' in imageResponse)) {
                    throw new APIError(400, "Failed To Upload Image");
                }
                const { url, public_id } = imageResponse;
                if (course.image_public_id) {
                    await cloudinary.uploader.destroy(course.image_public_id);
                }
                value.image_url = url;
                value.image_public_id = public_id;
            }
            updatedCourse = await models.Course.update(value, { where: { course_id: courseId }, transaction: t });
            if (!updatedCourse[0]) throw new APIError(400, "Failed to update the course");
        });

        const updatedData = await models.Course.findOne({ where: { course_id: courseId } });
        res.json(new APIResponse(200, updatedData, "Course updated successfully"));
    } catch (error) {
        next(error);
    }
};

const getCourse = async (req, res, next) => {
    try {
        // Find the course in the database
        const course = await models.Course.findAll();

        // If the course is found, return it as a response
        if (course) {
            res.json(new APIResponse(200, course, "Course found"));
        } else {
            // If the course is not found, return an appropriate error response
            throw new APIError(404, "Course not found");
        }
    } catch (error) {
        // Implement error handling for any potential errors
        next(error);
    }
};

export { addCourse, updateCourse, getCourse };
