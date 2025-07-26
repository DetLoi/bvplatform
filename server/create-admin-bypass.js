import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.models.js';

const createAdminBypass = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    // Delete any existing admin user
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create a hash
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    
    // Test the hash
    const testHash = await bcrypt.compare(password, hash);
    console.log(`Hash test: ${testHash ? '✅ Valid' : '❌ Invalid'}`);
    
    // Create the user document directly without triggering hooks
    const adminData = {
      username: 'admin',
      email: 'admin@breakverse.com',
      name: 'Admin User',
      password: hash,
      status: 'admin',
      level: 1,
      xp: 0
    };
    
    // Insert directly into collection to bypass hooks
    const UserCollection = mongoose.connection.collection('users');
    await UserCollection.insertOne(adminData);
    console.log('✅ Admin user inserted directly!');
    
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

createAdminBypass(); 