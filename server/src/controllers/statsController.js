import { statsStore } from '../services/statsStore.js';
import { listingStore } from '../services/listingStore.js';

export const getImpactStats = async (req, res) => {
  try {
    const stats = await statsStore.getDetailedImpactStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving impact stats', error: error.message });
  }
};

export const getDetailedImpact = async (req, res) => {
  try {
    const stats = await statsStore.getDetailedImpactStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving detailed impact', error: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
    const leaderboard = await statsStore.getReuseLeaderboard(limit);
    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving reuse leaderboard', error: error.message });
  }
};
