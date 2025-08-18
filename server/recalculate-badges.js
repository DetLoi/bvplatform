import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breakverse';

async function recalculateBadges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find().populate('masteredMoves');
    console.log(`Found ${users.length} users`);

    let updatedCount = 0;
    let totalNewBadges = 0;

    for (const user of users) {
      console.log(`Processing user: ${user.name || user.username}`);
      
      const oldBadgeCount = user.badges.length;
      const result = await user.checkAndAssignBadges();
      
      if (result.newBadges.length > 0 || result.removedBadges.length > 0) {
        await user.save();
        updatedCount++;
        totalNewBadges += result.newBadges.length;
        
        console.log(`  - User: ${user.name || user.username}`);
        console.log(`  - Old badges: ${oldBadgeCount}`);
        console.log(`  - New badges: ${user.badges.length}`);
        console.log(`  - Added: ${result.newBadges.map(b => b.name).join(', ')}`);
        console.log(`  - Removed: ${result.removedBadges.map(b => b.name).join(', ')}`);
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Updated badges for ${updatedCount} users`);
    console.log(`Total new badges assigned: ${totalNewBadges}`);
    console.log(`Total users processed: ${users.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

recalculateBadges();
