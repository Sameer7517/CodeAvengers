import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDatabaseConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import circularSwapRoutes from './routes/circularSwapRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: Dynamic CORS supporting local dev, CLIENT_URL, and Vercel domains
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173', 
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
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
    service: 'CampusLoop Sustainability & Exchange API',
    version: '4.0.0-phase4',
    database: isDatabaseConnected() ? 'connected (MongoDB)' : 'in-memory fallback (active)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/circular-swap', circularSwapRoutes);

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
    console.log(`🌱 CampusLoop Phase 5 Server running on http://localhost:${PORT}`);
    console.log(`🔒 Authentication & JWT endpoints active at /api/auth`);
    console.log(`🛍️ Marketplace CRUD & Discovery active at /api/listings`);
    console.log(`🔄 Exchange Requests & Donations active at /api/exchanges`);
    console.log(`🔔 In-App Notifications active at /api/notifications`);
    console.log(`♻️ Circular Swap Finder active at /api/circular-swap`);
    console.log(`📊 Sustainability Impact & Leaderboard active at /api/stats`);
    console.log(`💾 Storage: ${isDatabaseConnected() ? 'Persistent MongoDB Mongoose' : 'In-Memory Resilient Repository'}`);
  });
};


// Only execute listen automatically when run directly as main entry point
if (process.argv[1]?.endsWith('server.js')) {
  startServer();
}

export { app };
export default app;
