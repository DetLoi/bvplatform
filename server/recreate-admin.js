import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.models.js';

const recreateAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    // Delete existing admin user
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create new admin user with fresh password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      username: 'admin',
      email: 'admin@breakverse.com',
      name: 'Admin User',
      password: hashedPassword,
      status: 'admin',
      level: 1,
      xp: 0
    });
    
    await admin.save();
    console.log('✅ New admin user created successfully!');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Status: ${admin.status}`);
    console.log(`Password: admin123`);
    console.log(`Password hash: ${admin.password}`);
    
    // Test the password
    const isValid = await admin.comparePassword('admin123');
    console.log(`Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Also test with a fresh query
    const freshAdmin = await User.findOne({ username: 'admin' });
    const freshTest = await freshAdmin.comparePassword('admin123');
    console.log(`Fresh query password test: ${freshTest ? '✅ Valid' : '❌ Invalid'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

recreateAdmin(); 