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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/moves', moveRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/crews', crewRoutes);

// DB & server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server on ${PORT}`));
  })
  .catch(err => console.error(err));
