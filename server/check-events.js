import mongoose from 'mongoose';
import Event from './src/models/event.models.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

async function checkEvents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get total count of events
    const totalEvents = await Event.countDocuments();
    console.log(`📊 Total events in database: ${totalEvents}`);

    if (totalEvents === 0) {
      console.log('❌ No events found in database');
      console.log('💡 This could mean:');
      console.log('   - The scraper hasn\'t been run yet');
      console.log('   - Events are in a different collection');
      console.log('   - Database is empty');
      return;
    }

    // Get events by type
    const nationalEvents = await Event.find({ eventType: 'national' });
    const internationalEvents = await Event.find({ eventType: 'international' });
    const eventsWithoutType = await Event.find({ eventType: { $exists: false } });

    console.log(`\n📈 Event Breakdown:`);
    console.log(`  - National events: ${nationalEvents.length}`);
    console.log(`  - International events: ${internationalEvents.length}`);
    console.log(`  - Events without eventType: ${eventsWithoutType.length}`);

    // Show some examples of each type
    if (nationalEvents.length > 0) {
      console.log(`\n🇩🇰 National Events (first 3):`);
      nationalEvents.slice(0, 3).forEach(event => {
        console.log(`  - ${event.title} (${event.organizer}) - Website: ${event.website}`);
      });
    }

    if (internationalEvents.length > 0) {
      console.log(`\n🌍 International Events (first 3):`);
      internationalEvents.slice(0, 3).forEach(event => {
        console.log(`  - ${event.title} (${event.organizer}) - Website: ${event.website}`);
      });
    }

    if (eventsWithoutType.length > 0) {
      console.log(`\n❓ Events without eventType (first 3):`);
      eventsWithoutType.slice(0, 3).forEach(event => {
        console.log(`  - ${event.title} (${event.organizer}) - Website: ${event.website}`);
      });
    }

    // Check for And8 events specifically
    const and8Events = await Event.find({ website: { $regex: /and8\.dance/i } });
    console.log(`\n🔍 And8 Events: ${and8Events.length}`);
    if (and8Events.length > 0) {
      and8Events.forEach(event => {
        console.log(`  - ${event.title} (${event.eventType || 'no type'}) - ${event.website}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkEvents(); 