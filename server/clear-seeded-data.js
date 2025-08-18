const mongoose = require('mongoose');
const User = require('./src/models/user.models.js');
const Badge = require('./src/models/badge.models.js');
const Crew = require('./src/models/crew.models.js');
const Move = require('./src/models/move.models.js');
const Event = require('./src/models/event.models.js');

async function clearSeededData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/breakverse');
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️ CLEARING SEEDED DATA:');
    console.log('========================');

    // Clear all collections
    console.log('\n🗑️ Clearing all collections...');
    
    const userCount = await User.countDocuments();
    const badgeCount = await Badge.countDocuments();
    const crewCount = await Crew.countDocuments();
    const moveCount = await Move.countDocuments();
    const eventCount = await Event.countDocuments();
    
    console.log(`📊 Current data counts:`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Badges: ${badgeCount}`);
    console.log(`- Crews: ${crewCount}`);
    console.log(`- Moves: ${moveCount}`);
    console.log(`- Events: ${eventCount}`);

    // Clear all data
    await User.deleteMany({});
    await Badge.deleteMany({});
    await Crew.deleteMany({});
    await Move.deleteMany({});
    await Event.deleteMany({});

    console.log('\n✅ All seeded data cleared!');
    console.log('\n📊 Database is now empty and ready for your real data.');

  } catch (error) {
    console.error('❌ Error clearing data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

clearSeededData(); 