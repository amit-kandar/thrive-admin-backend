const Joi = require('joi');
const { models } = require('../db/index.js');
const APIError = require('../utils/APIError.js');
const APIResponse = require('../utils/APIResponse.js');

const addPricePlan = async (req, res, next) => {
    try {
        // Get data from request body
        const { level, discount, price, subscribe_button, duration, pricing_features } = req.body;

        // Define Joi schema for validation
        const schema = Joi.object({
            level: Joi.string().required(),
            discount: Joi.number().integer().min(0).max(100).required(),
            price: Joi.number().integer().min(0).required(),
            subscribe_button: Joi.string().required(),
            duration: Joi.string().required(),
            pricing_features: Joi.array().items(
                Joi.string().required(),
            )
        });

        // Validate data using Joi schema
        const { error } = schema.validate({ level, discount, price, subscribe_button, duration, pricing_features });
        if (error) {
            throw new APIError('Validation Error', 400, error.details[0].message);
        }

        // Check for existing data
        const existingPricePlan = await models.Price.findOne({ where: { id: 1 } });
        if (existingPricePlan) {
            throw new APIError('Duplicate Entry', 409, 'Price plan with this level already exists');
        }

        // Store the data
        const newPricePlan = await models.Price.create({
            level,
            discount,
            price,
            subscribe_button,
            duration
        });

        // Check for failure
        if (!newPricePlan) {
            throw new APIError('Database Error', 500, 'Failed to add price plan');
        }

        // Create for features
        if (pricing_features && pricing_features.length > 0) {
            await Promise.all(pricing_features.map(async (pricing_feature) => {
                await models.PriceFeaturesList.create({
                    label: pricing_feature,
                    PriceId: newPricePlan.id
                });
            }));
        }

        // Return APIResponse
        res.status(201).json(new APIResponse(201, 'Price plan added successfully'));
    } catch (error) {
        next(error);
    }
}

module.exports = { addPricePlan };