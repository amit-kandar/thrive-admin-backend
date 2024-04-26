const express = require('express');
const aboutUs = require('../controllers/AboutUs.controller');

const router = express.Router();

router.get('/test', aboutUs);

module.exports = router;