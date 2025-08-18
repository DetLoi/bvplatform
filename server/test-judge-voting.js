import mongoose from 'mongoose';
import Battle from './src/models/battle.models.js';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test the judge voting system
async function testJudgeVoting() {
  try {
    console.log('\n=== Testing Judge Voting System ===\n');

    // Find or create test users
    let challenger = await User.findOne({ username: 'testchallenger' });
    let opponent = await User.findOne({ username: 'testopponent' });
    let judge = await User.findOne({ username: 'testjudge' });

    if (!challenger) {
      challenger = await User.create({
        username: 'testchallenger',
        name: 'Test Challenger',
        email: 'challenger@test.com',
        password: 'password123',
        level: 'Intermediate'
      });
      console.log('Created test challenger');
    }

    if (!opponent) {
      opponent = await User.create({
        username: 'testopponent',
        name: 'Test Opponent',
        email: 'opponent@test.com',
        password: 'password123',
        level: 'Advanced'
      });
      console.log('Created test opponent');
    }

    if (!judge) {
      judge = await User.create({
        username: 'testjudge',
        name: 'Test Judge',
        email: 'judge@test.com',
        password: 'password123',
        roles: ['judge']
      });
      console.log('Created test judge');
    }

    // Create a test battle
    const testBattle = await Battle.create({
      title: 'Test Judge Voting Battle',
      description: 'Testing the judge voting system',
      challenger: challenger._id,
      opponent: opponent._id,
      status: 'completed',
      videos: {
        challenger: 'https://example.com/challenger-video.mp4',
        opponent: 'https://example.com/opponent-video.mp4'
      }
    });

    console.log(`Created test battle: ${testBattle._id}`);
    console.log(`Initial status: ${testBattle.status}`);

    // Test the isBattleJudged function
    const categories = ['Foundation', 'Originality', 'Execution', 'Dynamics', 'Battle'];
    
    console.log('\n--- Testing vote submission ---');
    
    // Submit votes for each category
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const scoreA = Math.floor(Math.random() * 5) + 1;
      const scoreB = Math.floor(Math.random() * 5) + 1;
      
      // Add vote to battle
      testBattle.votes.push({
        judgeId: judge._id,
        category: category,
        scoreA: scoreA,
        scoreB: scoreB,
        timestamp: new Date()
      });
      
      console.log(`Vote ${i + 1}/5: ${category} - ${challenger.name}: ${scoreA}, ${opponent.name}: ${scoreB}`);
      
      // Check if battle is judged after each vote
      const isJudged = testBattle.votes.length === 5;
      console.log(`Votes submitted: ${testBattle.votes.length}/5, Is judged: ${isJudged}`);
      
      if (isJudged) {
        // Calculate winner
        let winsA = 0, winsB = 0;
        let totalA = 0, totalB = 0;
        
        testBattle.votes.forEach(vote => {
          totalA += vote.scoreA;
          totalB += vote.scoreB;
          if (vote.scoreA > vote.scoreB) winsA++;
          else if (vote.scoreB > vote.scoreA) winsB++;
        });
        
        let winner = null;
        if (winsA > winsB) winner = challenger._id;
        else if (winsB > winsA) winner = opponent._id;
        else if (totalA > totalB) winner = challenger._id;
        else if (totalB > totalA) winner = opponent._id;
        
        testBattle.status = 'judged';
        testBattle.winner = winner;
        
        console.log(`\n🎉 Battle is now JUDGED!`);
        console.log(`Winner: ${winner ? (winner.equals(challenger._id) ? challenger.name : opponent.name) : 'Draw'}`);
        console.log(`Final scores - ${challenger.name}: ${totalA}, ${opponent.name}: ${totalB}`);
        console.log(`Category wins - ${challenger.name}: ${winsA}, ${opponent.name}: ${winsB}`);
      }
    }
    
    // Save the updated battle
    await testBattle.save();
    
    // Verify the final state
    const finalBattle = await Battle.findById(testBattle._id)
      .populate('challenger', 'name')
      .populate('opponent', 'name')
      .populate('winner', 'name');
    
    console.log('\n--- Final Battle State ---');
    console.log(`Status: ${finalBattle.status}`);
    console.log(`Winner: ${finalBattle.winner ? finalBattle.winner.name : 'Draw'}`);
    console.log(`Total votes: ${finalBattle.votes.length}`);
    
    // Clean up test data
    await Battle.findByIdAndDelete(testBattle._id);
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testJudgeVoting(); 