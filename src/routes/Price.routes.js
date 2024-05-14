const express = require('express');
const { addPricePlan, updatePricePlan, getPricePlanDetailsById } = require('../controllers/Price.controller.js');
const router = express.Router();

router.post('/', addPricePlan);
router.put('/', updatePricePlan);
router.get('/', getPricePlanDetailsById);

module.exports = router;