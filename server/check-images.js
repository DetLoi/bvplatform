import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const checkImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('profileImage coverImage username');
    console.log('Users with images:');
    
    users.forEach(user => {
      console.log('User:', user.username);
      console.log('Profile:', user.profileImage);
      console.log('Cover:', user.coverImage);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkImages(); 