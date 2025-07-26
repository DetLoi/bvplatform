import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { startLoop } from './scraper/cronjob.js';

// Import all models to register them with Mongoose
import './models/user.models.js';
import './models/crew.models.js';
import './models/move.models.js';
import './models/badge.models.js';
import './models/event.models.js';
import './models/battle.models.js';

import userRoutes from './routes/user.routes.js';
import moveRoutes from './routes/move.routes.js';
import badgeRoutes from './routes/badge.routes.js';
import eventRoutes from './routes/event.routes.js';
import battleRoutes from './routes/battle.routes.js';
import crewRoutes from './routes/crew.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();
const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',     // Vite dev server
    'http://localhost:5174',     // Vite dev server (alternative port)
    'http://localhost:3000',     // React dev server
    'http://localhost:8080',     // Vue dev server
    'https://bvplatform.vercel.app', // Production frontend (if you deploy there)
    'https://breakverse.vercel.app',  // Alternative domain
    'https://breakverse.netlify.app', // Netlify deployment
    'http://localhost:4173',     // Vite preview server
    'https://breakverse-client.vercel.app', // Vercel deployment
    'https://breakverse-client.netlify.app', // Netlify deployment
    'https://breakverse-client.onrender.com', // Render deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Breakverse API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/moves', moveRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/crews', crewRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: 'File upload error' });
  }
  
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// DB & server start
const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is required');
  console.error('Please set MONGO_URI in your environment variables');
  console.error('For local development, create a .env file with:');
  console.error('MONGO_URI=mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse');
  process.exit(1);
}

// Connect to MongoDB with better error handling
const startServer = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📡 MongoDB URI:', process.env.MONGO_URI ? 'Set (hidden for security)' : 'Not set');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
};

startServer();
startLoop();
