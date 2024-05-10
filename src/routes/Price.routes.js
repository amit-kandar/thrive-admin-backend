const express = require('express');
const { addPricePlan } = require('../controllers/Price.controller.js');
const router = express.Router();

router.post('/', addPricePlan);

module.exports = router;