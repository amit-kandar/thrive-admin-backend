import Joi from 'joi';
import { models } from '../db/index.js';
import APIError from '../utils/APIError.js';
import APIResponse from '../utils/APIResponse.js';
import logger from '../config/logger.js';

// Handler to add data
const addData = async (req, res, next) => {
    try {
        // Define validation schema using Joi
        const schema = Joi.object({
            company_name: Joi.string().required(),
            description: Joi.string().required(),
            address: Joi.string().required(),
            social_media_links: Joi.array().items(Joi.object({
                label: Joi.string().required(),
                path: Joi.string().uri().required()
            })).required(),
            page_paths: Joi.array().items(Joi.object({
                label: Joi.string().required(),
                path: Joi.string().required()
            })).required()
        });

        // Validate request body
        const { error, value } = schema.validate(req.body);
        if (error) {
            logger.error('Validation error:', error.details.map(detail => detail.message));
            throw new APIError(400, "All fields are required with valid data.");
        }

        const { company_name, description, address, social_media_links, page_paths } = value;

        // check data has already exists or not
        const data = await models.Footer.findAll({
            where: { id: 1 },
            include: [
                {
                    model: models.SocialMedia,
                    as: 'social_media'
                },
                {
                    model: models.PagePath,
                    as: 'page_path'
                }
            ]
        })

        console.log(data.length >= 0);

        if (data.length > 0) {
            throw new APIError(400, "Data already exists");
        }

        // Create footer record
        const footer = await models.Footer.create({
            company_name,
            description,
            address
        });

        // Create for social media
        if (social_media_links && social_media_links.length > 0) {
            await Promise.all(social_media_links.map(async (socialMediaLink) => {
                await models.SocialMedia.create({
                    platform: socialMediaLink.label,
                    url: socialMediaLink.path,
                    FooterId: footer.id
                });
            }));
        }

        // Create for page paths
        if (page_paths && page_paths.length > 0) {
            await Promise.all(page_paths.map(async (pagePath) => {
                await models.PagePath.create({
                    label: pagePath.label,
                    path: pagePath.path,
                    FooterId: footer.id
                });
            }));
        }

        res.status(201).json(new APIResponse(201, "Successfully added data."));
    } catch (error) {
        next(error);
    }
};


const updateData = async (req, res, next) => {
    try {
        // Define validation schema using Joi
        const schema = Joi.object({
            company_name: Joi.string().optional(),
            description: Joi.string().optional(),
            address: Joi.string().optional(),
            social_media_links: Joi.alternatives().try(
                Joi.array().items(Joi.object({
                    label: Joi.string().optional(),
                    path: Joi.string().uri().optional(),
                    id: Joi.number().required()
                })).min(1), // At least one item if it's an array
                Joi.object({  // or a single object
                    label: Joi.string().optional(),
                    path: Joi.string().uri().optional(),
                    id: Joi.number().required()
                })
            ).optional(),
            page_path: Joi.alternatives().try(
                Joi.array().items(Joi.object({
                    label: Joi.string().optional(),
                    path: Joi.string().optional(),
                    id: Joi.number().required()
                })).min(1), // At least one item if it's an array
                Joi.object({  // or a single object
                    label: Joi.string().optional(),
                    path: Joi.string().optional(),
                    id: Joi.number().required()
                })
            ).optional()
        });

        // Validate data
        const { error, value } = schema.validate(req.body);
        if (error) {
            logger.error('Validation error:', error.details.map(detail => detail.message));
            throw new APIError(400, "All fields are required with valid data.");
        }

        const { company_name, description, address, social_media_links, page_path } = value;

        // check data has already exists or not
        const data = await models.Footer.findAll({
            where: { id: 1 },
            include: [
                {
                    model: models.SocialMedia,
                    as: 'social_media'
                },
                {
                    model: models.PagePath,
                    as: 'page_path'
                }
            ]
        })

        if (!data) {
            throw new APIError(400, "Data not exists for update!");
        }

        // Update the data
        await models.Footer.update(
            {
                company_name,
                description,
                address
            },
            {
                where: { id: 1 }
            }
        );

        // Update for social media
        if (social_media_links && social_media_links.length > 0) {
            await Promise.all(social_media_links.map(async (socialMediaLink) => {
                await models.SocialMedia.update(
                    {
                        platform: socialMediaLink.label,
                        url: socialMediaLink.path,
                        FooterId: data.id
                    },
                    {
                        where: { id: socialMediaLink.id }
                    }
                );
            }));
        }

        // Update for page paths
        if (page_path && page_path.length > 0) {
            await Promise.all(page_path.map(async (pagePath) => {
                await models.PagePath.update(
                    {
                        label: pagePath.label,
                        path: pagePath.path,
                        FooterId: data.id
                    },
                    {
                        where: { id: pagePath.id }
                    }
                );
            }));
        }

        // Return success response
        res.json(new APIResponse(200, { data }, "Data updated successfully."));
    } catch (error) {
        next(error);
    }
};


const getData = async (req, res, next) => {
    try {
        // Retrieve data from the database
        let data = await models.Footer.findOne({
            where: { id: 1 },
            include: [
                {
                    model: models.SocialMedia,
                    as: 'social_media'
                },
                {
                    model: models.PagePath,
                    as: 'page_path'
                },
                {
                    model: models.Course,
                    as: 'course',
                    limit: 4
                }
            ]
        });

        if (!data) {
            throw new APIError(404, "Data not found.");
        }

        // Return the retrieved data
        res.json(new APIResponse(200, { data }, "Data retrieved successfully."));
    } catch (error) {
        next(error);
    }
};

export { addData, updateData, getData };