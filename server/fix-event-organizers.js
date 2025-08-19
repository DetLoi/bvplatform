import mongoose from 'mongoose';
import Event from './src/models/event.models.js';

async function fixEventOrganizers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 FIXING EVENT ORGANIZER FIELDS:');
    console.log('==================================');

    // Find all events with problematic organizer fields
    const events = await Event.find({});
    console.log(`📊 Found ${events.length} total events`);

    let fixedCount = 0;
    for (const event of events) {
      let needsUpdate = false;
      
      // Check if organizer is an object (should be string or null)
      if (event.organizer && typeof event.organizer === 'object') {
        console.log(`🔧 Fixing event "${event.title}" - organizer is object:`, event.organizer);
        event.organizer = null; // Set to null since the referenced user doesn't exist
        needsUpdate = true;
      }
      
      // Check if organizer is an ObjectId string that doesn't correspond to a valid user
      if (event.organizer && typeof event.organizer === 'string' && mongoose.Types.ObjectId.isValid(event.organizer)) {
        console.log(`🔧 Fixing event "${event.title}" - organizer is invalid ObjectId: ${event.organizer}`);
        event.organizer = null;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await event.save();
        fixedCount++;
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} events with problematic organizer fields`);
    console.log('\n🎉 Event organizer cleanup completed!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixEventOrganizers();
