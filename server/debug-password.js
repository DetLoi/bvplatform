import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.models.js';

const debugPassword = async () => {
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
    console.log(`Email: ${admin.email}`);
    console.log(`Status: ${admin.status}`);
    console.log(`Password hash: ${admin.password}`);
    console.log(`Password hash length: ${admin.password.length}`);
    
    // Test bcrypt directly
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    console.log(`Direct bcrypt test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Test the model method
    const modelTest = await admin.comparePassword(testPassword);
    console.log(`Model method test: ${modelTest ? '✅ Valid' : '❌ Invalid'}`);
    
    // Create a new hash and test
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log(`New hash: ${newHash}`);
    const newTest = await bcrypt.compare(testPassword, newHash);
    console.log(`New hash test: ${newTest ? '✅ Valid' : '❌ Invalid'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

debugPassword(); 