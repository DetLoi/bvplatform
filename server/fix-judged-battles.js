import mongoose from 'mongoose';
import Battle from './src/models/battle.models.js';
import User from './src/models/user.models.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/breakverse');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixJudgedBattles = async () => {
  try {
    console.log('🔍 Checking for judged battles that need user statistics updates...');
    
    // Find all judged battles
    const judgedBattles = await Battle.find({ status: 'judged' })
      .populate('challenger', 'name username battleXP battleLevel battleWins battleLosses battlesParticipated')
      .populate('opponent', 'name username battleXP battleLevel battleWins battleLosses battlesParticipated')
      .populate('winner', 'name username');
    
    console.log(`📊 Found ${judgedBattles.length} judged battles`);
    
    for (const battle of judgedBattles) {
      console.log(`\n🎯 Processing battle: ${battle._id}`);
      console.log(`   Challenger: ${battle.challenger.name} (${battle.challenger.username})`);
      console.log(`   Opponent: ${battle.opponent.name} (${battle.opponent.username})`);
      console.log(`   Winner: ${battle.winner ? battle.winner.name : 'Draw'}`);
      console.log(`   Status: ${battle.status}`);
      
      // Check if user statistics need to be updated
      const challengerWon = battle.winner && battle.winner._id.toString() === battle.challenger._id.toString();
      const opponentWon = battle.winner && battle.winner._id.toString() === battle.opponent._id.toString();
      
      console.log(`   Challenger won: ${challengerWon}`);
      console.log(`   Opponent won: ${opponentWon}`);
      
      // Update challenger statistics
      try {
        const challengerStats = await User.updateUserBattleStats(
          battle.challenger._id,
          { won: challengerWon }
        );
        console.log(`   ✅ Updated challenger stats:`, challengerStats);
      } catch (error) {
        console.error(`   ❌ Error updating challenger stats:`, error.message);
      }
      
      // Update opponent statistics
      try {
        const opponentStats = await User.updateUserBattleStats(
          battle.opponent._id,
          { won: opponentWon }
        );
        console.log(`   ✅ Updated opponent stats:`, opponentStats);
      } catch (error) {
        console.error(`   ❌ Error updating opponent stats:`, error.message);
      }
    }
    
    console.log('\n🎉 Finished processing judged battles!');
    
    // Show summary of all users' battle statistics
    console.log('\n📈 Current user battle statistics:');
    const users = await User.find({}, 'name username battleXP battleLevel battleWins battleLosses battlesParticipated');
    
    for (const user of users) {
      if (user.battlesParticipated > 0) {
        console.log(`   ${user.name} (${user.username}):`);
        console.log(`     Level: ${user.battleLevel}, XP: ${user.battleXP}`);
        console.log(`     Wins: ${user.battleWins}, Losses: ${user.battleLosses}, Total: ${user.battlesParticipated}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing judged battles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
connectDB().then(fixJudgedBattles); 