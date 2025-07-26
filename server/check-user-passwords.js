import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUserPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('username email password');
    console.log('User passwords:');
    console.log('================');
    
    users.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Has password: ${user.password ? 'Yes' : 'No'}`);
      if (user.password) {
        console.log(`Password length: ${user.password.length} (hashed)`);
      }
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUserPasswords(); 