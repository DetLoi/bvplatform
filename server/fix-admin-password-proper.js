import mongoose from 'mongoose';
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
      admin = new User({
        username: 'admin',
        email: 'admin@breakverse.com',
        name: 'Admin User',
        password: 'admin123',
        status: 'admin',
        level: 1,
        xp: 0
      });
    } else {
      console.log('✅ Admin user found, updating password and status...');
      // Set the password directly - the pre-save hook will hash it
      admin.password = 'admin123';
      admin.status = 'admin';
    }
    
    // Save the user - this will trigger the password hashing
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