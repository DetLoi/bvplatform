import mongoose from 'mongoose';
import User from './src/models/user.models.js';

const checkAdminStatus = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Status: ${admin.status}`);
    console.log(`isAdmin field: ${admin.isAdmin}`);
    console.log(`Level: ${admin.level}`);
    console.log(`XP: ${admin.xp}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkAdminStatus(); 