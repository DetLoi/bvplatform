import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const checkAdminLevel = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    const admin = await User.findOne({ username: 'admin' }).populate('masteredMoves');
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Current Level: ${admin.level}`);
    console.log(`Current XP: ${admin.xp}`);
    console.log(`Mastered Moves Count: ${admin.masteredMoves.length}`);
    
    if (admin.masteredMoves.length > 0) {
      console.log('\n📋 Mastered Moves:');
      admin.masteredMoves.forEach((move, index) => {
        console.log(`  ${index + 1}. ${move.name} (${move.category}, Level: ${move.level}, XP: ${move.xp})`);
      });
    } else {
      console.log('\n❌ No mastered moves found');
    }
    
    // Calculate what the level should be
    const calculatedLevel = admin.calculateLevel();
    console.log(`\n🧮 Calculated Level: ${calculatedLevel}`);
    
    // Calculate total XP from moves
    const totalXPFromMoves = admin.masteredMoves.reduce((sum, move) => sum + move.xp, 0);
    console.log(`📊 Total XP from moves: ${totalXPFromMoves}`);
    
    // Check if level needs to be recalculated
    if (admin.level !== calculatedLevel) {
      console.log(`\n⚠️  Level mismatch! Current: ${admin.level}, Should be: ${calculatedLevel}`);
      console.log('🔄 Recalculating level...');
      
      admin.level = calculatedLevel;
      admin.xp = totalXPFromMoves;
      await admin.save();
      
      console.log(`✅ Level updated to: ${admin.level}`);
      console.log(`✅ XP updated to: ${admin.xp}`);
    } else {
      console.log('\n✅ Level is correct!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdminLevel(); 