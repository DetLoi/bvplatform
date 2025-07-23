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

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Breakverse API is running',
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
