import mongoose from 'mongoose';
import User from './src/models/user.models.js';

const testUserModel = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`Username: ${admin.username}`);
    console.log(`Password hash: ${admin.password}`);
    
    // Test the comparePassword method
    console.log('\n🧪 Testing comparePassword method...');
    const test1 = await admin.comparePassword('admin123');
    console.log(`admin123: ${test1 ? '✅ Valid' : '❌ Invalid'}`);
    
    const test2 = await admin.comparePassword('wrongpassword');
    console.log(`wrongpassword: ${test2 ? '❌ Should be invalid' : '✅ Correctly invalid'}`);
    
    // Test with bcrypt directly
    console.log('\n🧪 Testing bcrypt directly...');
    const bcrypt = await import('bcryptjs');
    const directTest1 = await bcrypt.default.compare('admin123', admin.password);
    console.log(`admin123 (direct): ${directTest1 ? '✅ Valid' : '❌ Invalid'}`);
    
    const directTest2 = await bcrypt.default.compare('wrongpassword', admin.password);
    console.log(`wrongpassword (direct): ${directTest2 ? '❌ Should be invalid' : '✅ Correctly invalid'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testUserModel(); 