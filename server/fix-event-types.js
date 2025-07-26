import mongoose from 'mongoose';
import Event from './src/models/event.models.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

async function fixEventTypes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all events that have a website URL containing 'and8.dance' and are marked as 'national'
    const and8Events = await Event.find({
      website: { $regex: /and8\.dance/i },
      eventType: 'national'
    });

    console.log(`📊 Found ${and8Events.length} And8 events incorrectly tagged as 'national'`);

    if (and8Events.length > 0) {
      // Update these events to be 'international'
      const updateResult = await Event.updateMany(
        {
          website: { $regex: /and8\.dance/i },
          eventType: 'national'
        },
        {
          $set: { eventType: 'international' }
        }
      );

      console.log(`✅ Updated ${updateResult.modifiedCount} events from 'national' to 'international'`);
    }

    // Also check for events that might be scraped but don't have the and8.dance URL pattern
    // Look for events with empty descriptions, null images, and USD currency (typical of scraped events)
    const potentialScrapedEvents = await Event.find({
      eventType: 'national',
      $or: [
        { description: '' },
        { description: { $exists: false } },
        { image: null },
        { currency: 'USD' }
      ]
    });

    console.log(`📊 Found ${potentialScrapedEvents.length} potential scraped events that might need fixing`);

    if (potentialScrapedEvents.length > 0) {
      console.log('🔍 Potential scraped events:');
      potentialScrapedEvents.forEach(event => {
        console.log(`  - ${event.title} (${event.organizer}) - Website: ${event.website}`);
      });
    }

    // Get final counts
    const nationalCount = await Event.countDocuments({ eventType: 'national' });
    const internationalCount = await Event.countDocuments({ eventType: 'international' });

    console.log('\n📈 Final Event Counts:');
    console.log(`  - National (Danish) events: ${nationalCount}`);
    console.log(`  - International events: ${internationalCount}`);
    console.log(`  - Total events: ${nationalCount + internationalCount}`);

  } catch (error) {
    console.error('❌ Error fixing event types:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixEventTypes(); 