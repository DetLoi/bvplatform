const mongoose = require('mongoose');
const User = require('./src/models/user.models.js');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/breakverse');
    console.log('✅ Connected to MongoDB');

    console.log('\n👤 CREATING ADMIN USER:');
    console.log('========================');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('Username: admin');
      console.log('Email: admin@breakverse.com');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@breakverse.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
      level: 1,
      xp: 0,
      status: 'active',
      createdAt: new Date()
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@breakverse.com');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdminUser(); 