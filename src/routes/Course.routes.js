import express from 'express';
import { addCourse, getCourse, updateCourse } from '../controllers/Course.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', upload.single('image'), addCourse);
router.put('/', upload.single('image'), updateCourse);
router.get('/', getCourse);

export default router;