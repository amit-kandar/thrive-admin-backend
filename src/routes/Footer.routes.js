import express from 'express';
import { addData, updateData, getData } from '../controllers/Footer.controller.js';

const router = express.Router();

router.post('/', addData);
router.put('/', updateData);
router.get('/', getData);

export default router;