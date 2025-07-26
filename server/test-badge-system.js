import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';
import Badge from './src/models/badge.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const testBadgeSystem = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    // Get all moves and badges
    const allMoves = await Move.find();
    const allBadges = await Badge.find({ isActive: true });
    
    console.log(`📊 Found ${allMoves.length} moves and ${allBadges.length} badges`);
    
    // Get admin user
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log(`👤 Admin user: ${admin.username}`);
    console.log(`📈 Current level: ${admin.level}`);
    console.log(`🎯 Mastered moves: ${admin.masteredMoves.length}`);
    console.log(`🏆 Badges: ${admin.badges.length}`);
    
    // Test adding some moves to see level and badge changes
    const testMoves = allMoves.slice(0, 5); // Take first 5 moves
    
    console.log('\n🧪 Testing badge system...');
    
    for (const move of testMoves) {
      console.log(`\n➕ Adding move: ${move.name} (${move.category}, Level: ${move.level}, XP: ${move.xp})`);
      
      // Add move to admin
      admin.masteredMoves.push(move._id);
      admin.xp += move.xp;
      admin.level = admin.calculateLevel();
      
      // Check for new badges
      const newBadges = await admin.checkAndAssignBadges();
      
      await admin.save();
      
      console.log(`📈 New level: ${admin.level}`);
      console.log(`🎯 Total mastered moves: ${admin.masteredMoves.length}`);
      
      if (newBadges.length > 0) {
        console.log(`🏆 New badges earned: ${newBadges.map(b => b.name).join(', ')}`);
      } else {
        console.log(`❌ No new badges earned`);
      }
    }
    
    console.log('\n✅ Badge system test completed!');
    console.log(`📊 Final stats:`);
    console.log(`   Level: ${admin.level}`);
    console.log(`   XP: ${admin.xp}`);
    console.log(`   Mastered moves: ${admin.masteredMoves.length}`);
    console.log(`   Badges: ${admin.badges.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testBadgeSystem(); 