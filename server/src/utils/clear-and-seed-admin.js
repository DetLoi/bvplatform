import bcrypt from 'bcryptjs';
import User from '../models/user.models.js';
import Crew from '../models/crew.models.js';
import Move from '../models/move.models.js';
import Badge from '../models/badge.models.js';
import Event from '../models/event.models.js';
import Battle from '../models/battle.models.js';
import mongoose from 'mongoose';

// Admin user data
const adminUser = {
  username: 'admin',
  name: 'Admin User',
  email: 'admin@breakverse.com',
  password: 'admin123',
  level: 15,
  xp: 15000,
  status: 'admin',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  crew: null,
  specialty: 'Power Moves',
  masteredMoves: [],
  pendingMoves: [],
  achievements: 12,
  battleVideos: ['https://youtube.com/watch?v=xyz123', 'https://vimeo.com/uvw456'],
  bio: 'Admin of Breakverse - helping breakers level up their game!',
  location: 'Copenhagen, Denmark',
  socialMedia: {
    instagram: '@admin_breaker',
    facebook: 'Admin Breaker'
  }
};

const clearAndSeedAdmin = async () => {
  try {
    console.log('🗑️ Clearing all existing data...');
    
    // Clear all collections
    await User.deleteMany({});
    await Crew.deleteMany({});
    await Badge.deleteMany({});
    await Event.deleteMany({});
    await Battle.deleteMany({});
    
    console.log('✅ All data cleared');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    
    const admin = await User.create({
      ...adminUser,
      password: hashedPassword,
      masteredMoves: [],
      pendingMoves: [],
      badges: [],
      crew: null
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    console.log(`👤 Username: ${admin.username}`);
    
    console.log('\n🎉 Database reset complete! Only admin user exists.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Run the script
const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const runScript = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    await clearAndSeedAdmin();
    
    console.log('✅ Script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

runScript(); 