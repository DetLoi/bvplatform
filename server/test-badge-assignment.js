import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Badge from './src/models/badge.models.js';
import Move from './src/models/move.models.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breakverse';

async function testBadgeAssignment() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if badges exist
    const badgeCount = await Badge.countDocuments();
    console.log(`Found ${badgeCount} badges in database`);

    if (badgeCount === 0) {
      console.log('No badges found in database. Please seed badges first.');
      return;
    }

    // Get a specific user (replace with actual user ID)
    const userId = '68910c2b5410696ec1423046'; // The user from your URL
    const user = await User.findById(userId).populate('masteredMoves');
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log(`\nUser: ${user.name || user.username}`);
    console.log(`Current badges: ${user.badges.length}`);
    console.log(`Mastered moves: ${user.masteredMoves.length}`);

    // Get all badges
    const allBadges = await Badge.find({ isActive: true });
    console.log(`\nAvailable badges: ${allBadges.length}`);

    // Test badge assignment
    const result = await user.checkAndAssignBadges();
    
    console.log('\n=== Badge Assignment Result ===');
    console.log(`New badges: ${result.newBadges.length}`);
    console.log(`Removed badges: ${result.removedBadges.length}`);
    
    if (result.newBadges.length > 0) {
      console.log('New badges:');
      result.newBadges.forEach(badge => {
        console.log(`  - ${badge.name} (${badge.category})`);
      });
    }

    if (result.removedBadges.length > 0) {
      console.log('Removed badges:');
      result.removedBadges.forEach(badge => {
        console.log(`  - ${badge.name} (${badge.category})`);
      });
    }

    // Save user if changes were made
    if (result.newBadges.length > 0 || result.removedBadges.length > 0) {
      await user.save();
      console.log('\nUser saved with updated badges');
    }

    console.log(`\nFinal badge count: ${user.badges.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testBadgeAssignment();
