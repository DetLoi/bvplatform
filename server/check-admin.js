import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const checkAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password hash: ${admin.password}`);
    console.log(`Password length: ${admin.password.length}`);
    
    // Test password comparison
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    console.log(`\n🔍 Testing password "${testPassword}":`);
    console.log(`Is valid: ${isValid}`);
    
    // Test with model method
    const isValidWithMethod = await admin.comparePassword(testPassword);
    console.log(`Is valid (model method): ${isValidWithMethod}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdmin(); 