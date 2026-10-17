import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listingRoutes from './routes/listingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusLoop Sustainability API',
    version: '1.0.0-phase1',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/listings', listingRoutes);
app.use('/api/stats', statsRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🌱 CampusLoop Sustainability Server running on http://localhost:${PORT}`);
  console.log(`📚 Sample listings initialized and ready for Phase 1 demo`);
});

export default app;
