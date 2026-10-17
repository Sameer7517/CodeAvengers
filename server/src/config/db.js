import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (customUri = null) => {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/campusloop';

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout so server doesn't hang if local mongo is offline
    });

    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Notice: Could not connect to ${uri}`);
    console.warn(`   Reason: ${error.message}`);
    console.warn(`   Tip: To use persistent MongoDB, ensure mongod is running locally or set MONGODB_URI in server/.env (e.g. MongoDB Atlas).`);
    return null;
  }
};

export const isDatabaseConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
};
