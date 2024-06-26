const express = require('express');
const { getData, addData, updateData } = require('../controllers/AboutUs.controller.js');
const upload = require('../middlewares/multer.middleware.js');

const router = express.Router();

router.post('/', upload.fields([
    { name: "about_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
]), addData);

router.get('/', getData);

router.put('/', upload.fields([
    { name: "about_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
]), updateData);

module.exports = router;