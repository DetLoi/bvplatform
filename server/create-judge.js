import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breakverse';

async function createJudge() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if judge already exists
    const existingJudge = await User.findOne({ username: 'judge1' });
    if (existingJudge) {
      console.log('Judge already exists:', existingJudge.username);
      return;
    }

    // Create a judge user
    const judge = new User({
      username: 'judge1',
      email: 'judge1@breakverse.com',
      password: 'judge123',
      name: 'Judge One',
      status: 'judge',
      level: 10,
      xp: 5000
    });

    await judge.save();
    console.log('Judge created successfully:', judge.username);
    
  } catch (error) {
    console.error('Error creating judge:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createJudge(); 