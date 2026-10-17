import { listingStore } from '../services/listingStore.js';

export const getImpactStats = (req, res) => {
  try {
    const stats = listingStore.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving impact stats', error: error.message });
  }
};
