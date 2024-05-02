const express = require('express');
const { addData, updateData, getData } = require('../controllers/Footer.controller');
const router = express.Router();

router.post('/', addData);
router.put('/', updateData);
router.get('/', getData);

module.exports = router;