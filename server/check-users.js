import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('username email name isAdmin');
    console.log('Users in database:');
    console.log('==================');
    
    users.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
      console.log('---');
    });
    
    console.log(`Total users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers(); 