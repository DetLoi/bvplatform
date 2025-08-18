import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breakverse';

async function fixBattleStats() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users that don't have battle statistics fields
    const users = await User.find({
      $or: [
        { battleXP: { $exists: false } },
        { battleLevel: { $exists: false } },
        { battleWins: { $exists: false } },
        { battleLosses: { $exists: false } },
        { battlesParticipated: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${users.length} users that need battle statistics fields`);

    if (users.length === 0) {
      console.log('✅ All users already have battle statistics fields');
      return;
    }

    // Update each user with default battle statistics
    for (const user of users) {
      console.log(`🔄 Updating user: ${user.username}`);
      
      user.battleXP = user.battleXP || 0;
      user.battleLevel = user.battleLevel || 1;
      user.battleWins = user.battleWins || 0;
      user.battleLosses = user.battleLosses || 0;
      user.battlesParticipated = user.battlesParticipated || 0;
      
      await user.save();
      console.log(`✅ Updated ${user.username}`);
    }

    console.log('🎉 Successfully updated all users with battle statistics fields');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixBattleStats(); 