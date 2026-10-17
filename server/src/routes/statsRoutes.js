import express from 'express';
import { getImpactStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getImpactStats);

export default router;
