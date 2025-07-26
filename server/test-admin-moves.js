import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const testAdminMoves = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    const admin = await User.findOne({ username: 'admin' });
    const moves = await Move.find().limit(10); // Get first 10 moves
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log(`✅ Admin user found: ${admin.username}`);
    console.log(`📊 Current Level: ${admin.level}`);
    console.log(`📊 Current XP: ${admin.xp}`);
    console.log(`📊 Current Mastered Moves: ${admin.masteredMoves.length}`);
    
    // Add some moves to admin
    console.log('\n➕ Adding moves to admin...');
    
    for (const move of moves) {
      if (!admin.masteredMoves.includes(move._id)) {
        admin.masteredMoves.push(move._id);
        console.log(`  ✅ Added: ${move.name} (${move.category}, Level: ${move.level}, XP: ${move.xp})`);
      }
    }
    
    // Save the user (this will trigger the pre-save hook to recalculate level and XP)
    await admin.save();
    
    // Get updated user data
    const updatedAdmin = await User.findOne({ username: 'admin' }).populate('masteredMoves');
    
    console.log('\n📊 Updated Admin Stats:');
    console.log(`  Level: ${updatedAdmin.level}`);
    console.log(`  XP: ${updatedAdmin.xp}`);
    console.log(`  Mastered Moves: ${updatedAdmin.masteredMoves.length}`);
    
    console.log('\n📋 Mastered Moves:');
    updatedAdmin.masteredMoves.forEach((move, index) => {
      console.log(`  ${index + 1}. ${move.name} (${move.category}, Level: ${move.level}, XP: ${move.xp})`);
    });
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testAdminMoves(); 