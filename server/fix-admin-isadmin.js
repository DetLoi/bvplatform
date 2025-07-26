import mongoose from 'mongoose';
import User from './src/models/user.models.js';

const fixAdminIsAdmin = async () => {
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
    console.log(`Status: ${admin.status}`);
    console.log(`isAdmin: ${admin.isAdmin}`);
    
    // Update the isAdmin field
    admin.isAdmin = true;
    await admin.save();
    
    console.log('✅ Updated admin user:');
    console.log(`Username: ${admin.username}`);
    console.log(`Status: ${admin.status}`);
    console.log(`isAdmin: ${admin.isAdmin}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

fixAdminIsAdmin(); 