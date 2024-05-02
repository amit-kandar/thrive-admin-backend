import express from 'express';
import addCourse from '../controllers/Course.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', upload.single('image'), addCourse);

export default router;