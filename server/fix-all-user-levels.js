import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const fixAllUserLevels = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    const users = await User.find().populate('masteredMoves');
    
    console.log(`📊 Found ${users.length} users`);
    
    let fixedCount = 0;
    
    for (const user of users) {
      const oldLevel = user.level;
      const oldXP = user.xp;
      
      // Calculate correct XP from mastered moves
      const correctXP = user.masteredMoves.reduce((sum, move) => sum + move.xp, 0);
      
      // Calculate correct level
      const correctLevel = user.calculateLevel();
      
      // Check if level or XP needs fixing
      if (user.level !== correctLevel || user.xp !== correctXP) {
        console.log(`\n🔧 Fixing user: ${user.username}`);
        console.log(`  Old Level: ${oldLevel} → New Level: ${correctLevel}`);
        console.log(`  Old XP: ${oldXP} → New XP: ${correctXP}`);
        console.log(`  Mastered Moves: ${user.masteredMoves.length}`);
        
        user.level = correctLevel;
        user.xp = correctXP;
        await user.save();
        
        fixedCount++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} users out of ${users.length} total users`);
    
    if (fixedCount === 0) {
      console.log('🎉 All user levels are already correct!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixAllUserLevels(); 