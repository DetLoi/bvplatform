import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.models.js';

const fixAdminPassword = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    // Find or create admin user
    let admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found, creating one...');
      // Hash the password manually
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      admin = new User({
        username: 'admin',
        email: 'admin@breakverse.com',
        name: 'Admin User',
        password: hashedPassword,
        status: 'admin',
        level: 1,
        xp: 0
      });
    } else {
      console.log('✅ Admin user found, updating password and status...');
      // Hash the password manually
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      admin.password = hashedPassword;
      admin.status = 'admin';
    }
    
    // Save the user
    await admin.save();
    
    console.log('✅ Admin user updated successfully!');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Status: ${admin.status}`);
    console.log(`Password: admin123`);
    
    // Test the password
    const isValid = await admin.comparePassword('admin123');
    console.log(`Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Also test with a fresh query to make sure it works
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

fixAdminPassword(); 