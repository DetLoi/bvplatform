import mongoose from 'mongoose';
import Badge from './src/models/badge.models.js';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/breakverse';

async function createOGBadge() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if OG badge already exists
    let ogBadge = await Badge.findOne({ 
      'requirements.badgeType': 'og_membership',
      name: 'OG Membership'
    });

    if (ogBadge) {
      console.log('⚠️  OG Membership badge already exists');
      console.log('Badge ID:', ogBadge._id);
      return;
    }

    // Create the OG Membership badge
    console.log('🏆 Creating OG Membership badge...');
    ogBadge = await Badge.create({
      name: 'OG Membership',
      description: 'One of the first 20 members to join Breakverse. A true OG!',
      category: 'Special',
      level: 'Legendary',
      emoji: '👑',
      rarity: 'Legendary',
      image: '/assets/badges/og-membership.png', // You'll need to add this image
      requirements: {
        badgeType: 'og_membership',
        userLimit: 20,
        moves: [],
        xpRequired: 0,
        levelRequired: 1
      }
    });

    console.log('✅ OG Membership badge created:', ogBadge._id);

    // Get the first 20 users by creation date
    console.log('👥 Finding first 20 users...');
    const first20Users = await User.find()
      .sort({ createdAt: 1 })
      .limit(20)
      .select('_id username email name createdAt');

    console.log(`📊 Found ${first20Users.length} users`);

    // Update the badge with the first 20 users
    ogBadge.requirements.manualUsers = first20Users.map(user => user._id);
    await ogBadge.save();

    // Assign the badge to these users
    console.log('🎖️  Assigning badge to users...');
    for (const user of first20Users) {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { badges: ogBadge._id }
      });
      console.log(`✅ Assigned to: ${user.username || user.email} (${user.name || 'No name'})`);
    }

    console.log('🎉 OG Membership badge assignment completed!');
    console.log(`📈 Total users assigned: ${first20Users.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createOGBadge();
