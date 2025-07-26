import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.models.js';

const createAdminSimple = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    // Delete any existing admin user
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create a simple hash
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    
    // Test the hash immediately
    const testHash = await bcrypt.compare(password, hash);
    console.log(`Hash test: ${testHash ? '✅ Valid' : '❌ Invalid'}`);
    
    // Create the user
    const admin = new User({
      username: 'admin',
      email: 'admin@breakverse.com',
      name: 'Admin User',
      password: hash,
      status: 'admin',
      level: 1,
      xp: 0
    });
    
    await admin.save();
    console.log('✅ Admin user saved!');
    
    // Test the saved user
    const savedAdmin = await User.findOne({ username: 'admin' });
    const savedTest = await savedAdmin.comparePassword(password);
    console.log(`Saved user test: ${savedTest ? '✅ Valid' : '❌ Invalid'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createAdminSimple(); 