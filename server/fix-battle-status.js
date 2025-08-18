import mongoose from 'mongoose';
import Battle from './src/models/battle.models.js';
import dotenv from 'dotenv';

dotenv.config();

const isBattleJudged = (battle) => {
  // Check if all 5 categories have been voted on
  const categories = ['Foundation', 'Originality', 'Execution', 'Dynamics', 'Battle'];
  const votedCategories = new Set(battle.votes?.map(vote => vote.category) || []);
  const isJudged = categories.every(category => votedCategories.has(category));
  
  console.log('Battle Judged Check:', {
    battleId: battle._id,
    totalVotes: battle.votes?.length || 0,
    votedCategories: Array.from(votedCategories),
    requiredCategories: categories,
    isJudged: isJudged
  });
  
  return isJudged;
};

const calculateWinner = (votes, challenger, opponent) => {
  let winsA = 0, winsB = 0, ties = 0;
  
  votes.forEach(vote => {
    if (vote.scoreA > vote.scoreB) {
      winsA++;
    } else if (vote.scoreB > vote.scoreA) {
      winsB++;
    } else {
      ties++;
    }
  });
  
  if (winsA > winsB) {
    return challenger;
  } else if (winsB > winsA) {
    return opponent;
  } else {
    // In case of tie, return null (draw)
    return null;
  }
};

const fixBattleStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find battles that are marked as 'completed' but have all 5 votes
    const battlesToFix = await Battle.find({ status: 'completed' });
    
    console.log(`Found ${battlesToFix.length} battles with 'completed' status`);
    
    let fixedCount = 0;
    
    for (const battle of battlesToFix) {
      console.log(`\nChecking battle: ${battle._id}`);
      console.log(`Current status: ${battle.status}`);
      console.log(`Total votes: ${battle.votes?.length || 0}`);
      
      if (battle.votes && battle.votes.length > 0) {
        console.log('Voted categories:', battle.votes.map(v => v.category));
      }
      
      if (isBattleJudged(battle)) {
        console.log('✅ This battle should be marked as judged!');
        
        // Calculate winner
        const winner = calculateWinner(battle.votes, battle.challenger, battle.opponent);
        
        // Update battle status
        const updatedBattle = await Battle.findByIdAndUpdate(
          battle._id,
          {
            status: 'judged',
            winner: winner
          },
          { new: true }
        );
        
        console.log(`✅ Updated battle ${battle._id} to 'judged' status`);
        console.log(`Winner: ${winner || 'Draw'}`);
        fixedCount++;
      } else {
        console.log('❌ This battle does not have all required votes');
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} battles!`);
    
  } catch (error) {
    console.error('Error fixing battle status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the fix
fixBattleStatus(); 