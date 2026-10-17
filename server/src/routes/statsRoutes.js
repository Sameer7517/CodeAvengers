import express from 'express';
import { getImpactStats, getDetailedImpact, getLeaderboard } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getImpactStats);
router.get('/impact', getDetailedImpact);
router.get('/leaderboard', getLeaderboard);

export default router;
