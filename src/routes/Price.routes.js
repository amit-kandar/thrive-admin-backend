const express = require('express');
const { addPricePlan, updatePricePlan, getPricePlanDetailsById, getPricePlanDetails } = require('../controllers/Price.controller.js');
const router = express.Router();

router.post('/', addPricePlan);
router.put('/', updatePricePlan);
router.get('/:id', getPricePlanDetailsById);
router.get('/', getPricePlanDetails);

module.exports = router;