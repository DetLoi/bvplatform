import mongoose from 'mongoose';
import Event from './src/models/event.models.js';

async function fixSpecificEvent() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 FIXING SPECIFIC PROBLEMATIC EVENT:');
    console.log('=====================================');

    // Find the specific problematic event
    const problematicEvent = await Event.findOne({
      organizer: { _id: new mongoose.Types.ObjectId('6886244beceedc1414757984') }
    });

    if (problematicEvent) {
      console.log(`🔧 Found problematic event: "${problematicEvent.title}"`);
      console.log('Current organizer:', problematicEvent.organizer);
      
      // Fix the organizer field
      problematicEvent.organizer = null;
      await problematicEvent.save();
      
      console.log('✅ Fixed the problematic event organizer field');
    } else {
      console.log('❌ Could not find the specific problematic event');
      
      // Let's try a different approach - find all events and check their organizer field
      const allEvents = await Event.find({});
      console.log(`📊 Checking ${allEvents.length} events for problematic organizer fields...`);
      
      for (const event of allEvents) {
        if (event.organizer && typeof event.organizer === 'object') {
          console.log(`🔧 Found event with object organizer: "${event.title}"`);
          console.log('Organizer object:', event.organizer);
          
          event.organizer = null;
          await event.save();
          console.log('✅ Fixed this event');
        }
      }
    }

    console.log('\n🎉 Specific event fix completed!');

  } catch (error) {
    console.error('❌ Error during fix:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixSpecificEvent();
