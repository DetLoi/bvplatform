import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateUserRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let updatedCount = 0;

    for (const user of users) {
      let needsUpdate = false;
      const updateData = {};

      // Check if user has roles field
      if (!user.roles || user.roles.length === 0) {
        // Set default role based on existing status
        if (user.status === 'admin' || user.isAdmin === true) {
          updateData.roles = ['admin'];
        } else if (user.status === 'judge') {
          updateData.roles = ['judge'];
        } else {
          updateData.roles = ['student'];
        }
        needsUpdate = true;
      }

      // Update status if it's 'admin' or 'judge' (these are now roles)
      if (user.status === 'admin' || user.status === 'judge') {
        updateData.status = 'active';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updateData);
        updatedCount++;
        console.log(`Updated user: ${user.username} - Roles: ${updateData.roles?.join(', ') || user.roles?.join(', ')}`);
      }
    }

    console.log(`Migration completed! Updated ${updatedCount} users`);
    
    // Show summary
    const roleSummary = await User.aggregate([
      {
        $group: {
          _id: '$roles',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nRole distribution:');
    roleSummary.forEach(item => {
      console.log(`${item._id?.join(', ') || 'No roles'}: ${item.count} users`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration
migrateUserRoles(); 