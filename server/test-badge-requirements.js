import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';
import Badge from './src/models/badge.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const testBadgeRequirements = async () => {
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
    console.log(`🏆 Current badges: ${admin.badges.length}`);
    
    // Check badges with requirements
    console.log('\n🔍 Checking badges with requirements...');
    
    for (const badge of allBadges) {
      console.log(`\n🏆 Badge: ${badge.name} (${badge.category})`);
      
      if (badge.requirements && badge.requirements.moves && Array.isArray(badge.requirements.moves)) {
        console.log(`   📋 Has requirements field with ${badge.requirements.moves.length} moves`);
        
        // Get the required moves
        const requiredMoves = [];
        for (const moveId of badge.requirements.moves) {
          const move = await Move.findById(moveId);
          if (move) {
            requiredMoves.push(move.name);
          }
        }
        
        console.log(`   📝 Required moves: ${requiredMoves.join(', ')}`);
        
        // Check if user has mastered these moves
        const masteredMoves = await Move.find({ _id: { $in: admin.masteredMoves } });
        const masteredMoveNames = masteredMoves.map(move => move.name);
        
        const masteredInCategory = masteredMoveNames.filter(moveName => 
          requiredMoves.includes(moveName)
        );
        
        console.log(`   ✅ Mastered: ${masteredInCategory.join(', ')}`);
        console.log(`   📊 Progress: ${masteredInCategory.length}/${requiredMoves.length}`);
        
        const isEarned = masteredInCategory.length === requiredMoves.length && requiredMoves.length > 0;
        const hasBadge = admin.badges.includes(badge._id);
        
        console.log(`   🏆 Should be earned: ${isEarned}`);
        console.log(`   🏆 Currently has badge: ${hasBadge}`);
        
        if (isEarned !== hasBadge) {
          console.log(`   ⚠️  MISMATCH: Badge status incorrect!`);
        }
      } else {
        console.log(`   📋 No requirements field or legacy badge`);
      }
    }
    
    // Test badge checking
    console.log('\n🧪 Testing badge checking...');
    const badgeResult = await admin.checkAndAssignBadges();
    
    console.log(`   🆕 New badges: ${badgeResult.newBadges.length}`);
    console.log(`   🗑️  Removed badges: ${badgeResult.removedBadges.length}`);
    
    if (badgeResult.newBadges.length > 0) {
      console.log(`   🆕 New badges: ${badgeResult.newBadges.map(b => b.name).join(', ')}`);
    }
    
    if (badgeResult.removedBadges.length > 0) {
      console.log(`   🗑️  Removed badges: ${badgeResult.removedBadges.map(b => b.name).join(', ')}`);
    }
    
    console.log('\n✅ Badge requirements test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testBadgeRequirements(); 