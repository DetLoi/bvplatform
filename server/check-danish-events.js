import mongoose from 'mongoose';
import Event from './src/models/event.models.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

async function checkDanishEvents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find events with Danish keywords, but exclude those with non-Danish organizers
    const danishEvents = await Event.find({
      $and: [
        {
          $or: [
            { organizer: { $regex: /denmark|danmark|danish|dansk/i } },
            { location: { $regex: /denmark|danmark|danish|dansk/i } }
          ]
        },
        {
          organizer: {
            $not: {
              $regex: /sweden|norway|finland|iceland|germany|france|spain|italy|poland|czech|austria|switzerland|belgium|netherlands|portugal|greece|hungary|romania|bulgaria|croatia|serbia|slovenia|slovakia|lithuania|latvia|estonia/i
            }
          }
        }
      ]
    });

    console.log(`\n🇩🇰 Danish events found: ${danishEvents.length}`);
    
    if (danishEvents.length > 0) {
      danishEvents.forEach(event => {
        console.log(`  - ${event.title}`);
        console.log(`    Organizer: ${event.organizer}`);
        console.log(`    Location: ${event.location}`);
        console.log(`    Event Type: ${event.eventType}`);
        console.log(`    Website: ${event.website}`);
        console.log('');
      });
    } else {
      console.log('❌ No Danish events found');
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDanishEvents(); 