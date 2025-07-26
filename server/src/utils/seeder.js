import Move from '../models/move.models.js';
import Badge from '../models/badge.models.js';
import User from '../models/user.models.js';
import Event from '../models/event.models.js';
import Battle from '../models/battle.models.js';
import Crew from '../models/crew.models.js';
import mongoose from 'mongoose';

// Import data from seeder data file (without image imports)
import { moves, users, crews, badges, events, battles } from './seeder-data.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Clear existing data
    await Move.deleteMany({});
    await Badge.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    await Battle.deleteMany({});
    await Crew.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Seed moves first (needed for references)
    console.log('📝 Seeding moves...');
    const movesToInsert = moves.map(move => ({
      name: move.name,
      category: move.category,
      level: move.level,
      xp: move.xp,
      videoUrl: move.videoUrl,
      description: move.description || `${move.name} - ${move.level} level move`,
      difficulty: getDifficultyFromLevel(move.level),
      isActive: true
    }));

    const insertedMoves = await Move.insertMany(movesToInsert);
    console.log(`✅ Seeded ${insertedMoves.length} moves`);

    // Create a map of move names to ObjectIds for recommendations
    const moveNameToId = {};
    insertedMoves.forEach(move => {
      moveNameToId[move.name] = move._id;
    });

    // Update moves with recommendations (ObjectId references)
    console.log('🔄 Updating moves with recommendations...');
    for (let i = 0; i < moves.length; i++) {
      const originalMove = moves[i];
      const insertedMove = insertedMoves[i];
      
      if (originalMove.recommendations && originalMove.recommendations.length > 0) {
        const recommendationIds = originalMove.recommendations
          .map(recName => moveNameToId[recName])
          .filter(id => id); // Filter out any undefined IDs
        
        await Move.findByIdAndUpdate(insertedMove._id, {
          recommendations: recommendationIds
        });
      }
    }

    // Seed users first (needed for crew leaders)
    console.log('👤 Seeding users...');
    const usersToInsert = users.map(user => {
      // Map mastered moves from names to ObjectIds
      const masteredMoveIds = user.masteredMoves
        .map(moveName => moveNameToId[moveName])
        .filter(id => id);

      // Map pending moves from names to ObjectIds
      const pendingMoveIds = user.pendingMoves
        .map(moveName => moveNameToId[moveName])
        .filter(id => id);

      return {
        username: user.username,
        email: user.email,
        password: user.password, // Will be hashed by the model
        name: user.name,
        level: user.level,
        xp: user.xp,
        joinDate: user.joinDate,
        status: user.status,
        profileImage: user.profileImage,
        crew: null, // Will be updated after crews are created
        specialty: user.specialty,
        masteredMoves: masteredMoveIds,
        pendingMoves: pendingMoveIds,
        achievements: user.achievements,
        battleVideos: user.battleVideos,
        bio: user.bio,
        location: user.location,
        socialMedia: user.socialMedia,
        isAdmin: user.status === 'admin'
      };
    });

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Seeded ${insertedUsers.length} users`);

    // Seed crews with leaders
    console.log('👥 Seeding crews...');
    const crewsToInsert = crews.map(crew => {
      // Find the first user from this crew to be the leader
      const crewUsers = insertedUsers.filter(user => user.crew === crew.name);
      const leader = crewUsers.length > 0 ? crewUsers[0] : insertedUsers[0]; // Fallback to first user

      return {
        name: crew.name,
        description: crew.description,
        logo: crew.logo || null,
        color: crew.color || '#ffd700',
        location: 'Denmark', // Default location
        leader: leader._id, // Set the leader
        isActive: true,
        isPublic: true
      };
    });

    const insertedCrews = await Crew.insertMany(crewsToInsert);
    console.log(`✅ Seeded ${insertedCrews.length} crews`);

    // Create a map of crew names to ObjectIds
    const crewNameToId = {};
    insertedCrews.forEach(crew => {
      crewNameToId[crew.name] = crew._id;
    });

    // Update users with crew references
    console.log('🔄 Updating users with crew references...');
    for (const user of insertedUsers) {
      const crewId = crewNameToId[user.crew];
      if (crewId) {
        await User.findByIdAndUpdate(user._id, { crew: crewId });
      }
    }

    // Update crews with members
    console.log('👑 Updating crews with members...');
    for (const crew of insertedCrews) {
      const crewUsers = insertedUsers.filter(user => 
        user.crew === crew.name
      );
      
      if (crewUsers.length > 0) {
        const leader = crewUsers[0]; // First user is leader
        await Crew.findByIdAndUpdate(crew._id, {
          members: crewUsers.map(user => ({
            user: user._id,
            role: user._id.toString() === leader._id.toString() ? 'Leader' : 'Member',
            joinedAt: new Date()
          }))
        });
      }
    }

    // Seed badges
    console.log('🏆 Seeding badges...');
    const badgesToInsert = badges.map(badge => ({
      name: badge.name,
      description: badge.description,
      category: badge.category,
      level: getBadgeLevel(badge.category),
      image: badge.image || '/badges/default.png',
      emoji: getBadgeEmoji(badge.category),
      requirements: {
        xpRequired: getBadgeXPRequirement(badge.category),
        levelRequired: getBadgeLevelRequirement(badge.category)
      },
      rarity: getBadgeRarity(badge.category),
      isActive: true
    }));

    const insertedBadges = await Badge.insertMany(badgesToInsert);
    console.log(`✅ Seeded ${insertedBadges.length} badges`);

    // Seed events
    console.log('📅 Seeding events...');
    const eventsToInsert = events.map(event => ({
      title: event.title,
      description: event.description,
      category: event.category,
      eventType: 'national', // All seeded events are national Danish events
      status: event.status,
      date: new Date(event.date),
      endDate: event.endDate ? new Date(event.endDate) : null,
      location: event.location,
      image: event.image || null,
      website: event.website,
      organizer: event.organizer,
      maxParticipants: event.maxParticipants,
      price: parseFloat(event.entryFee.replace(/[^\d.]/g, '')) || 0,
      currency: 'DKK',
      tags: [event.category.toLowerCase(), 'breaking'],
      isActive: true
    }));

    const insertedEvents = await Event.insertMany(eventsToInsert);
    console.log(`✅ Seeded ${insertedEvents.length} events`);

    // Seed battles
    console.log('⚔️ Seeding battles...');
    const battlesToInsert = battles.map(battle => {
      // Find challenger and opponent users by name
      const challengerUser = insertedUsers.find(u => u.name === battle.challenger.name);
      const opponentUser = insertedUsers.find(u => u.name === battle.opponent.name);

      return {
        title: `${battle.challenger.name} vs ${battle.opponent.name}`,
        description: battle.description,
        category: battle.category,
        status: battle.status,
        challenger: challengerUser ? challengerUser._id : null,
        opponent: opponentUser ? opponentUser._id : null,
        videos: battle.videos,
        stakes: battle.stakes,
        deadline: battle.deadline ? new Date(battle.deadline) : null,
        isActive: true
      };
    }).filter(battle => battle.challenger && battle.opponent); // Only include battles with valid users

    const insertedBattles = await Battle.insertMany(battlesToInsert);
    console.log(`✅ Seeded ${insertedBattles.length} battles`);

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      moves: insertedMoves.length,
      badges: insertedBadges.length,
      events: insertedEvents.length,
      users: insertedUsers.length,
      crews: insertedCrews.length,
      battles: insertedBattles.length
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Helper functions
function getDifficultyFromLevel(level) {
  const difficultyMap = {
    'Beginner': 1,
    'Novice': 2,
    'Intermediate': 3,
    'Advanced': 4,
    'Skilled': 5,
    'Master': 6,
    'Grandmaster': 7
  };
  return difficultyMap[level] || 1;
}

function getBadgeLevel(category) {
  if (category === 'Special') return 'Advanced';
  return 'Advanced';
}

function getBadgeEmoji(category) {
  const emojiMap = {
    'Toprock': '🦶',
    'Footwork': '🦶',
    'Freezes': '🧊',
    'Power': '💪',
    'Tricks': '🎯',
    'GoDowns': '⬇️',
    'Special': '🏆'
  };
  return emojiMap[category] || '🏆';
}

function getBadgeXPRequirement(category) {
  if (category === 'Special') return 1000;
  return 500;
}

function getBadgeLevelRequirement(category) {
  if (category === 'Special') return 5;
  return 3;
}

function getBadgeRarity(category) {
  if (category === 'Special') return 'Legendary';
  return 'Rare';
}

// Run seeder if this file is executed directly
const MONGO_URI = 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';

const runSeeder = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    const result = await seedDatabase();
    console.log('📊 Seeding results:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
runSeeder(); 