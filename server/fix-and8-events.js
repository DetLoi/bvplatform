import mongoose from 'mongoose';
import Event from './src/models/event.models.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

async function fixAnd8Events() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all events with And8 URLs
    const and8Events = await Event.find({ website: { $regex: /and8\.dance/i } });
    console.log(`📊 Found ${and8Events.length} And8 events`);

    if (and8Events.length === 0) {
      console.log('❌ No And8 events found');
      return;
    }

    // Check current eventType distribution
    const nationalCount = and8Events.filter(e => e.eventType === 'national').length;
    const internationalCount = and8Events.filter(e => e.eventType === 'international').length;
    const noTypeCount = and8Events.filter(e => !e.eventType || e.eventType === undefined).length;

    console.log(`\n📈 Current And8 Events Breakdown:`);
    console.log(`  - National: ${nationalCount}`);
    console.log(`  - International: ${internationalCount}`);
    console.log(`  - No type: ${noTypeCount}`);

    // Update all And8 events to be international
    const updateResult = await Event.updateMany(
      { website: { $regex: /and8\.dance/i } },
      { $set: { eventType: 'international' } }
    );

    console.log(`\n✅ Updated ${updateResult.modifiedCount} And8 events to 'international'`);

    // Verify the update
    const updatedAnd8Events = await Event.find({ website: { $regex: /and8\.dance/i } });
    const updatedInternationalCount = updatedAnd8Events.filter(e => e.eventType === 'international').length;

    console.log(`\n📊 Verification:`);
    console.log(`  - Total And8 events: ${updatedAnd8Events.length}`);
    console.log(`  - Now marked as international: ${updatedInternationalCount}`);

    // Show some examples
    console.log(`\n🌍 Sample updated events:`);
    updatedAnd8Events.slice(0, 5).forEach(event => {
      console.log(`  - ${event.title} (${event.eventType}) - ${event.organizer}`);
    });

    // Get final counts for all events
    const allNationalEvents = await Event.countDocuments({ eventType: 'national' });
    const allInternationalEvents = await Event.countDocuments({ eventType: 'international' });
    const allEventsWithoutType = await Event.countDocuments({ eventType: { $exists: false } });

    console.log(`\n📈 Final Database Event Counts:`);
    console.log(`  - National (Danish) events: ${allNationalEvents}`);
    console.log(`  - International events: ${allInternationalEvents}`);
    console.log(`  - Events without type: ${allEventsWithoutType}`);
    console.log(`  - Total events: ${allNationalEvents + allInternationalEvents + allEventsWithoutType}`);

  } catch (error) {
    console.error('❌ Error fixing And8 events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixAnd8Events(); 