import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Battle from './src/models/battle.models.js';
import BulkSubmission from './src/models/bulkSubmission.models.js';
import Event from './src/models/event.models.js';
import Notification from './src/models/notification.models.js';

async function cleanupOrphanedReferences() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🧹 CLEANING UP ORPHANED USER REFERENCES:');
    console.log('==========================================');

    // Get all user IDs
    const allUserIds = await User.find({}, '_id');
    const userIdSet = new Set(allUserIds.map(u => u._id.toString()));

    console.log(`📊 Found ${userIdSet.size} valid users`);

    // 1. Clean up Battle references
    console.log('\n🗑️ Cleaning up Battle references...');
    const battleUpdates = await Battle.updateMany(
      {
        $or: [
          { challenger: { $exists: true, $nin: allUserIds } },
          { opponent: { $exists: true, $nin: allUserIds } },
          { winner: { $exists: true, $nin: allUserIds } },
          { judges: { $exists: true, $nin: allUserIds } }
        ]
      },
      {
        $unset: {
          challenger: "",
          opponent: "",
          winner: "",
          judges: ""
        }
      }
    );
    console.log(`✅ Updated ${battleUpdates.modifiedCount} battles`);

    // 2. Clean up BulkSubmission references
    console.log('\n🗑️ Cleaning up BulkSubmission references...');
    const bulkSubmissionUpdates = await BulkSubmission.updateMany(
      {
        $or: [
          { user: { $exists: true, $nin: allUserIds } },
          { instructor: { $exists: true, $nin: allUserIds } }
        ]
      },
      {
        $unset: {
          user: "",
          instructor: ""
        }
      }
    );
    console.log(`✅ Updated ${bulkSubmissionUpdates.modifiedCount} bulk submissions`);

    // 3. Clean up Event references
    console.log('\n🗑️ Cleaning up Event references...');
    const eventUpdates = await Event.updateMany(
      { 
        $or: [
          { organizer: { $exists: true, $nin: allUserIds } },
          { organizer: { $type: "object" } } // Handle cases where organizer is stored as an object
        ]
      },
      { $unset: { organizer: "" } }
    );
    console.log(`✅ Updated ${eventUpdates.modifiedCount} events`);

    // 4. Clean up User instructor references
    console.log('\n🗑️ Cleaning up User instructor references...');
    const userUpdates = await User.updateMany(
      { instructor: { $exists: true, $nin: allUserIds } },
      { $unset: { instructor: "" } }
    );
    console.log(`✅ Updated ${userUpdates.modifiedCount} users`);

    // 5. Clean up Notification references
    console.log('\n🗑️ Cleaning up Notification references...');
    const notificationUpdates = await Notification.updateMany(
      {
        $or: [
          { recipient: { $exists: true, $nin: allUserIds } },
          { sender: { $exists: true, $nin: allUserIds } }
        ]
      },
      {
        $unset: {
          recipient: "",
          sender: ""
        }
      }
    );
    console.log(`✅ Updated ${notificationUpdates.modifiedCount} notifications`);

    console.log('\n🎉 Cleanup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Battles updated: ${battleUpdates.modifiedCount}`);
    console.log(`- Bulk submissions updated: ${bulkSubmissionUpdates.modifiedCount}`);
    console.log(`- Events updated: ${eventUpdates.modifiedCount}`);
    console.log(`- Users updated: ${userUpdates.modifiedCount}`);
    console.log(`- Notifications updated: ${notificationUpdates.modifiedCount}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanupOrphanedReferences();
