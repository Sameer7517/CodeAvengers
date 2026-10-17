import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

let isConnected = false;

export const connectDB = async (customUri = null) => {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/campusloop';

  // If using MongoDB Atlas SRV URI, ensure reliable DNS resolution on Windows
  if (uri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch (e) {
      // ignore if environment restricts custom DNS servers
    }
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
    });

    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Notice: Could not connect to database.`);
    console.warn(`   Reason: ${error.message}`);
    if (error.message.includes('IP that isn\'t whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.warn(`   👉 Atlas Action Required: Please add your current IP address (or 0.0.0.0/0 to allow all) in MongoDB Atlas -> Network Access -> IP Access List.`);
    }
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
