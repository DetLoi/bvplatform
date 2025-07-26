import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import Move from './src/models/move.models.js';

const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const testPendingMoves = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    // Get some moves to add as pending
    const moves = await Move.find().limit(5);
    
    if (moves.length === 0) {
      console.log('❌ No moves found in database');
      return;
    }
    
    // Create a test user if it doesn't exist
    let testUser = await User.findOne({ username: 'testuser' });
    
    if (!testUser) {
      console.log('👤 Creating test user...');
      testUser = new User({
        username: 'testuser',
        email: 'test@breakverse.com',
        password: 'test123',
        name: 'Test User',
        level: 1,
        xp: 0,
        masteredMoves: [],
        pendingMoves: []
      });
      await testUser.save();
      console.log('✅ Test user created');
    }
    
    console.log(`✅ Test user found: ${testUser.username}`);
    console.log(`📊 Current Level: ${testUser.level}`);
    console.log(`📊 Current XP: ${testUser.xp}`);
    console.log(`📊 Current Pending Moves: ${testUser.pendingMoves.length}`);
    
    // Add some moves as pending
    console.log('\n➕ Adding moves as pending...');
    
    for (const move of moves) {
      if (!testUser.pendingMoves.includes(move._id) && !testUser.masteredMoves.includes(move._id)) {
        testUser.pendingMoves.push(move._id);
        console.log(`  ✅ Added as pending: ${move.name} (${move.category}, Level: ${move.level}, XP: ${move.xp})`);
      }
    }
    
    await testUser.save();
    
    console.log('\n📊 Updated Test User Stats:');
    console.log(`  Level: ${testUser.level}`);
    console.log(`  XP: ${testUser.xp}`);
    console.log(`  Pending Moves: ${testUser.pendingMoves.length}`);
    
    // Test the pending moves API
    console.log('\n🔍 Testing pending moves API...');
    const usersWithPending = await User.find({ 'pendingMoves.0': { $exists: true } })
      .select('username name level pendingMoves')
      .populate('pendingMoves', 'name category level xp videoUrl description');
    
    console.log(`📋 Found ${usersWithPending.length} users with pending moves`);
    
    usersWithPending.forEach(user => {
      console.log(`\n👤 User: ${user.name || user.username} (Level ${user.level})`);
      user.pendingMoves.forEach(move => {
        console.log(`  📝 Pending: ${move.name} (${move.category}, Level: ${move.level}, XP: ${move.xp})`);
      });
    });
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testPendingMoves(); 