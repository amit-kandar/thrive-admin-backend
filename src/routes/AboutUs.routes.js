import express from 'express';
import { getData, addData, updateData } from '../controllers/AboutUs.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
]), addData);

router.get('/', getData);

router.put('/', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
]), updateData);

export default router;