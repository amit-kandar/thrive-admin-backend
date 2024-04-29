const express = require('express');
const { getData, addData, updateData } = require('../controllers/AboutUs.controller');
const upload = require('../middlewares/multer.middleware');

const router = express.Router();
router.post('/', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
]), addData)
router.get('/', getData)
router.put('/', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
]), updateData);

module.exports = router;