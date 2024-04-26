const express = require('express');
const aboutUs = require('../controllers/AboutUs.controller');

const router = express.Router();

router.put('/update', aboutUs);

module.exports = router;