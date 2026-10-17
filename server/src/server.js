import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDatabaseConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173', 
    'http://localhost:3000',
    process.env.CLIENT_URL
  ].filter(Boolean),
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
    service: 'CampusLoop Sustainability & Authentication API',
    version: '2.0.0-phase2',
    database: isDatabaseConnected() ? 'connected (MongoDB)' : 'in-memory fallback (active)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
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

// Start Server and connect to MongoDB
export const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  return app.listen(PORT, () => {
    console.log(`🌱 CampusLoop Phase 3 Server running on http://localhost:${PORT}`);
    console.log(`🔒 Authentication & JWT endpoints active at /api/auth`);
    console.log(`🛍️ Marketplace CRUD & Discovery active at /api/listings`);
    console.log(`💾 Storage: ${isDatabaseConnected() ? 'Persistent MongoDB Mongoose' : 'In-Memory Resilient Repository'}`);
  });
};

// Only execute listen automatically when run directly as main entry point
if (process.argv[1]?.endsWith('server.js')) {
  startServer();
}

export default app;
