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
            throw new APIError(400, error.details[0].message);
        }

        // Check for existing data
        const existingPricePlan = await models.Price.findOne({ where: { id: 1 } });
        if (existingPricePlan) {
            throw new APIError(409, 'Price plan with this level already exists');
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
            throw new APIError(500, 'Failed to add price plan');
        }

        // Create for features
        if (!pricing_features && !pricing_features.length > 0) {
            throw new APIError(400, "Pricing features are missing!");
        }

        await Promise.all(pricing_features.map(async (pricing_feature) => {
            await models.PriceFeaturesList.create({
                label: pricing_feature,
                PriceId: newPricePlan.id
            });
        }));

        // Return APIResponse
        res.status(201).json(new APIResponse(201, 'Price plan added successfully'));
    } catch (error) {
        next(error);
    }
}

const updatePricePlan = async (req, res, next) => {
    try {
        const pricePlanId = req.params.id || req.body.id;
        if (!pricePlanId) throw new APIError(400, "Price plan ID is required");

        // Get data from request body
        const { level, discount, price, subscribe_button, duration, pricing_features } = req.body;

        const schema = Joi.object({
            level: Joi.string().allow('').optional(),
            discount: Joi.number().integer().min(0).max(100).allow('').optional(),
            price: Joi.number().integer().min(0).allow('').optional(),
            subscribe_button: Joi.string().allow('').optional(),
            duration: Joi.string().allow('').optional(),
            pricing_features: Joi.array().items(
                Joi.string().allow('').optional(),
            )
        });

        // Validate data using Joi schema
        const { error } = schema.validate({ level, discount, price, subscribe_button, duration, pricing_features });
        if (error) {
            throw new APIError(400, error.details[0].message);
        }

        // Check for existing data
        const existingPricePlan = await models.Price.findOne({
            where: { id: pricePlanId }
        });

        if (!existingPricePlan) {
            throw new APIError(409, 'Price plan with this id does not exist');
        }

        // Update the main price plan information
        const updatedPricePlan = {};
        if (level) updatedPricePlan.level = level;
        if (discount) updatedPricePlan.discount = discount;
        if (price) updatedPricePlan.price = price;
        if (subscribe_button) updatedPricePlan.subscribe_button = subscribe_button;
        if (duration) updatedPricePlan.duration = duration;

        await models.Price.update(updatedPricePlan, {
            where: { id: pricePlanId }
        });

        // Update pricing features
        await Promise.all(pricing_features.map(async (pricing_feature, index) => {
            // Check if the pricing feature exists
            const existingFeature = await models.PriceFeaturesList.findOne({
                where: { id: index + 1, PriceId: pricePlanId } // Assuming pricing feature IDs start from 1
            });

            // If the feature exists, update it; otherwise, create a new one
            if (existingFeature) {
                await models.PriceFeaturesList.update(
                    { label: pricing_feature },
                    { where: { id: index + 1, PriceId: pricePlanId } }
                );
            } else {
                await models.PriceFeaturesList.create({
                    label: pricing_feature,
                    PriceId: pricePlanId
                });
            }
        }));

        // Retrieve updated data
        const data = await models.Price.findOne({
            where: { id: pricePlanId },
            include: [
                {
                    model: models.PriceFeaturesList,
                    as: 'PriceFeaturesList'
                }
            ]
        });

        res.status(200).json(new APIResponse(
            200,
            data,
            "Successfully updated the data."
        ));

    } catch (error) {
        next(error);
    }
};

const getPricePlanDetails = async (req, res, next) => {
    try {
        const pricePlanId = req.params.id || req.body.id;

        if (!pricePlanId) {
            throw new APIError(400, "Invalid price plan ID");
        }

        const response = await models.Price.findOne({
            where: { id: pricePlanId },
            include: [{
                model: models.PriceFeaturesList,
                as: 'PriceFeaturesList'
            }]
        });

        if (!response) {
            throw new APIError(404, "Price plan not found");
        }

        res.status(200).json(new APIResponse(
            200,
            response,
            "Successfully retrieved the data"
        ));
    } catch (error) {
        next(error);
    }
};

module.exports = { addPricePlan, updatePricePlan, getPricePlanDetails };