import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';
import Crew from './src/models/crew.models.js';
import Badge from './src/models/badge.models.js';
import Event from './src/models/event.models.js';
import Battle from './src/models/battle.models.js';

const createProperAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    // Delete any existing admin user
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create admin user with proper authentication setup
    const admin = new User({
      username: 'admin',
      email: 'admin@breakverse.com',
      name: 'Admin User',
      password: 'admin123', // This will be hashed by the pre-save hook
      status: 'admin',
      // Remove manual level and XP - let the system calculate them
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop',
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
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Status: ${admin.status}`);
    console.log(`Password: admin123`);
    console.log(`Level: ${admin.level} (calculated automatically)`);
    console.log(`XP: ${admin.xp} (calculated automatically)`);
    
    // Test the password
    const isValid = await admin.comparePassword('admin123');
    console.log(`Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Also test with a fresh query
    const freshAdmin = await User.findOne({ username: 'admin' });
    const freshTest = await freshAdmin.comparePassword('admin123');
    console.log(`Fresh query password test: ${freshTest ? '✅ Valid' : '❌ Invalid'}`);
    
    console.log('\n🎉 Admin user is now properly connected to the application!');
    console.log('You can now login with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Level and XP will be calculated automatically based on moves and achievements.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createProperAdmin(); 