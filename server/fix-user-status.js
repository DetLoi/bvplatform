import mongoose from 'mongoose';
import User from './src/models/user.models.js';

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixUserStatus = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Checking for users with invalid status values...');
    
    // Find users with status 'admin' or 'judge'
    const usersWithInvalidStatus = await User.find({
      status: { $in: ['admin', 'judge'] }
    });
    
    console.log(`📊 Found ${usersWithInvalidStatus.length} users with invalid status values`);
    
    let updatedCount = 0;
    
    for (const user of usersWithInvalidStatus) {
      console.log(`\n👤 Processing user: ${user.username}`);
      console.log(`   Current status: ${user.status}`);
      console.log(`   Current roles: ${user.roles?.join(', ') || 'none'}`);
      
      // Create new roles array if it doesn't exist
      const newRoles = user.roles || [];
      
      // Add the status value as a role if it's not already there
      if (!newRoles.includes(user.status)) {
        newRoles.push(user.status);
      }
      
      // Update the user: set status to 'active' and update roles
      await User.findByIdAndUpdate(user._id, {
        status: 'active',
        roles: newRoles
      });
      
      console.log(`   ✅ Updated - New status: active, New roles: ${newRoles.join(', ')}`);
      updatedCount++;
    }
    
    console.log(`\n🎉 Migration completed! Updated ${updatedCount} users`);
    
    // Verify the fix
    const remainingInvalidUsers = await User.find({
      status: { $in: ['admin', 'judge'] }
    });
    
    if (remainingInvalidUsers.length === 0) {
      console.log('✅ All users now have valid status values');
    } else {
      console.log(`⚠️  Warning: ${remainingInvalidUsers.length} users still have invalid status values`);
    }
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

fixUserStatus(); 