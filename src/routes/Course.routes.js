const express = require('express');
const { addCourse, getCourse, updateCourse } = require('../controllers/Course.controller.js');
const upload = require('../middlewares/multer.middleware.js');

const router = express.Router();

router.post('/', upload.single('image'), addCourse);
router.put('/', upload.single('image'), updateCourse);
router.get('/', getCourse);

module.exports = router;