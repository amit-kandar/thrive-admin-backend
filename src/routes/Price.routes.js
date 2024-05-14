const express = require('express');
const { addPricePlan, updatePricePlan, getPricePlanDetails } = require('../controllers/Price.controller.js');
const router = express.Router();

router.post('/', addPricePlan);
router.put('/', updatePricePlan);
router.get('/', getPricePlanDetails);

module.exports = router;