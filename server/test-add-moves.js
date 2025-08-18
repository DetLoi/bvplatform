import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';
import Badge from './src/models/badge.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const testAddMoves = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    // Get admin user
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log(`👤 Admin user: ${admin.username}`);
    console.log(`📈 Current level: ${admin.level}`);
    console.log(`🎯 Mastered moves: ${admin.masteredMoves.length}`);
    console.log(`🏆 Current badges: ${admin.badges.length}`);
    
    // Get Toprock Master badge to test
    const toprockBadge = await Badge.findOne({ name: 'Toprock Master' });
    if (!toprockBadge) {
      console.log('❌ Toprock Master badge not found');
      return;
    }
    
    console.log(`\n🏆 Testing Toprock Master badge requirements:`);
    console.log(`   Required moves: ${toprockBadge.requirements.moves.length} moves`);
    
    // Get the required moves for Toprock Master
    const requiredMoves = [];
    for (const moveId of toprockBadge.requirements.moves) {
      const move = await Move.findById(moveId);
      if (move) {
        requiredMoves.push(move);
      }
    }
    
    console.log(`   📝 Required moves: ${requiredMoves.map(m => m.name).join(', ')}`);
    
    // Check which moves admin already has
    const masteredMoves = await Move.find({ _id: { $in: admin.masteredMoves } });
    const masteredMoveNames = masteredMoves.map(move => move.name);
    
    console.log(`   ✅ Already mastered: ${masteredMoveNames.join(', ')}`);
    
    // Find moves that admin doesn't have yet
    const missingMoves = requiredMoves.filter(move => !masteredMoveNames.includes(move.name));
    console.log(`   ❌ Missing moves: ${missingMoves.map(m => m.name).join(', ')}`);
    
    // Add some missing moves to test badge earning
    if (missingMoves.length > 0) {
      console.log(`\n➕ Adding missing moves to test badge earning...`);
      
      // Add first 3 missing moves
      const movesToAdd = missingMoves.slice(0, 3);
      
      for (const move of movesToAdd) {
        console.log(`   ➕ Adding: ${move.name}`);
        admin.masteredMoves.push(move._id);
        admin.xp += move.xp;
      }
      
      // Check badges
      const badgeResult = await admin.checkAndAssignBadges();
      
      await admin.save();
      
      console.log(`\n📊 Results after adding moves:`);
      console.log(`   🆕 New badges: ${badgeResult.newBadges.length}`);
      console.log(`   🗑️  Removed badges: ${badgeResult.removedBadges.length}`);
      
      if (badgeResult.newBadges.length > 0) {
        console.log(`   🏆 New badges: ${badgeResult.newBadges.map(b => b.name).join(', ')}`);
      }
      
      // Check progress again
      const updatedMasteredMoves = await Move.find({ _id: { $in: admin.masteredMoves } });
      const updatedMasteredMoveNames = updatedMasteredMoves.map(move => move.name);
      
      const masteredInCategory = updatedMasteredMoveNames.filter(moveName => 
        requiredMoves.map(m => m.name).includes(moveName)
      );
      
      console.log(`   📊 Progress: ${masteredInCategory.length}/${requiredMoves.length}`);
      console.log(`   ✅ Now mastered: ${masteredInCategory.join(', ')}`);
    } else {
      console.log(`\n✅ Admin already has all required moves for Toprock Master!`);
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testAddMoves(); 