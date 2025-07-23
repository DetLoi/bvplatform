import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes.js';
import moveRoutes from './routes/move.routes.js';
import badgeRoutes from './routes/badge.routes.js';
import eventRoutes from './routes/event.routes.js';
import battleRoutes from './routes/battle.routes.js';
import crewRoutes from './routes/crew.routes.js';

dotenv.config();
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',     // Vite dev server
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

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Breakverse API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint with sample data
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    sampleMoves: [
      {
        id: '1',
        name: 'Toprock Basic',
        category: 'Toprock',
        level: 'Beginner',
        description: 'Basic toprock foundation'
      },
      {
        id: '2', 
        name: 'Six Step',
        category: 'Footwork',
        level: 'Beginner',
        description: 'Fundamental footwork move'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Breakverse API', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      moves: '/api/moves',
      badges: '/api/badges',
      events: '/api/events',
      battles: '/api/battles',
      crews: '/api/crews'
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/moves', moveRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/crews', crewRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// DB & server start
const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is required');
  process.exit(1);
}

// Connect to MongoDB with better error handling
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
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
    process.exit(1);
  }
};

startServer();
