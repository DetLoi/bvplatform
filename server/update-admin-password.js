import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const updateAdminPassword = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found, updating password...');
    
    // Update password to admin123
    admin.password = 'admin123';
    await admin.save();
    
    console.log('✅ Password updated successfully!');
    console.log(`Username: ${admin.username}`);
    console.log(`New password: admin123`);
    
    // Test the new password
    const isValid = await admin.comparePassword('admin123');
    console.log(`Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminPassword(); 