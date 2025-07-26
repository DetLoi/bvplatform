import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const testProgressCalculation = async () => {
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
    console.log(`Current Level: ${admin.level}`);
    console.log(`Current XP: ${admin.xp}`);
    console.log(`Mastered Moves Count: ${admin.masteredMoves.length}`);
    
    // Test progress calculation
    const progress = admin.getProgress();
    const nextLevelXP = admin.getNextLevelXP();
    const calculatedLevel = admin.calculateLevel();
    
    console.log('\n📊 Progress Calculation:');
    console.log(`  Calculated Level: ${calculatedLevel}`);
    console.log(`  Progress to Next Level: ${progress}%`);
    console.log(`  Next Level XP Required: ${nextLevelXP}`);
    
    // Show XP breakdown
    if (admin.masteredMoves.length > 0) {
      console.log('\n📋 XP Breakdown:');
      admin.masteredMoves.forEach((move, index) => {
        console.log(`  ${index + 1}. ${move.name}: ${move.xp} XP`);
      });
    }
    
    // Test frontend-style calculation
    const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
    
    // Combined level calculation (same as backend)
    const calculateLevel = (xp, masteredMovesCount) => {
      // Base level from XP
      let xpLevel = 1;
      
      for (let i = 0; i < xpThresholds.length; i++) {
        if (xp >= xpThresholds[i]) {
          xpLevel = i + 1;
        } else {
          break;
        }
      }
      
      // Level from moves mastered (more weight on moves)
      const movesLevel = Math.min(Math.floor(masteredMovesCount / 2) + 1, 15);
      
      // Combine both factors, giving more weight to moves
      const combinedLevel = Math.round((movesLevel * 0.7) + (xpLevel * 0.3));
      
      return Math.min(Math.max(combinedLevel, 1), 15);
    };
    
    const getLevelFromXP = (xp) => {
      for (let i = xpThresholds.length - 1; i >= 0; i--) {
        if (xp >= xpThresholds[i]) return i + 1;
      }
      return 1;
    };
    
    const getNextLevelXP = (xp) => {
      const currentLevel = getLevelFromXP(xp);
      return xpThresholds[currentLevel] || null;
    };
    
    const getProgress = (xp, masteredMovesCount) => {
      const currentLevel = calculateLevel(xp, masteredMovesCount);
      const nextLevelXP = getNextLevelXP(xp);
      const currentLevelXP = currentLevel > 1 ? xpThresholds[currentLevel - 2] : 0;
      
      // Handle edge cases
      if (nextLevelXP === null || nextLevelXP === xp) return 100;
      if (currentLevelXP >= nextLevelXP) return 100;
      
      const totalXPNeeded = nextLevelXP - currentLevelXP;
      const xpProgress = xp - currentLevelXP;
      
      // Ensure progress is between 0 and 100
      const progress = Math.max(0, Math.min(100, Math.round((xpProgress / totalXPNeeded) * 100)));
      
      return progress;
    };
    
    const frontendLevel = calculateLevel(admin.xp, admin.masteredMoves.length);
    const frontendProgress = getProgress(admin.xp, admin.masteredMoves.length);
    const frontendNextXP = getNextLevelXP(admin.xp);
    
    console.log('\n🔍 Frontend Calculation Test:');
    console.log(`  Level: ${frontendLevel}`);
    console.log(`  Progress: ${frontendProgress}%`);
    console.log(`  Next Level XP: ${frontendNextXP}`);
    
    console.log('\n✅ Progress calculation test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testProgressCalculation(); 