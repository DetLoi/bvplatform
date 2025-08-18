const mongoose = require('mongoose');

async function clean() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/breakverse');
    console.log('Connected!');
    
    const db = mongoose.connection.db;
    
    // Clear all collections
    console.log('Clearing all collections...');
    await db.collection('users').deleteMany({});
    await db.collection('badges').deleteMany({});
    await db.collection('crews').deleteMany({});
    await db.collection('moves').deleteMany({});
    await db.collection('events').deleteMany({});
    await db.collection('battles').deleteMany({});
    
    console.log('All data cleared!');
    
    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
      username: 'admin',
      email: 'admin@breakverse.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
      level: 1,
      xp: 0,
      masteredMoves: [],
      pendingMoves: [],
      badges: [],
      battleVideos: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('users').insertOne(adminUser);
    console.log('Admin user created!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

clean(); 