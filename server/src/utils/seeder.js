import Move from '../models/move.models.js';
import Badge from '../models/badge.models.js';
import User from '../models/user.models.js';
import Event from '../models/event.models.js';
import Battle from '../models/battle.models.js';
import Crew from '../models/crew.models.js';

// Sample moves data
const movesData = [
  // Level 1 – Beginner
  { name: 'Two step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Basic toprock step' },
  { name: 'Salsa step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Salsa-style toprock' },
  { name: 'CC', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Basic footwork pattern' },
  { name: 'Kick outs', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Kicking footwork' },
  { name: 'Yoga freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Basic freeze position' },
  { name: 'Turtle freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Turtle-style freeze' },
  { name: 'Butt spin', category: 'Power', level: 'Beginner', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Basic power move' },
  { name: 'Cartwheel', category: 'Tricks', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Basic trick' },
  { name: 'Squat down', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Basic godown' },
  { name: 'Corkspin drop', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Corkspin-style drop' },

  // Level 2 – Novice
  { name: 'Indian step', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Indian-style toprock' },
  { name: 'Charlie rock', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Charlie-style toprock' },
  { name: 'Coffee grinder', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Coffee grinder pattern' },
  { name: '2 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Two-step footwork' },
  { name: '3 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Three-step footwork' },
  { name: 'Hooks', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Hooking footwork' },
  { name: 'Zulu spin', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Zulu spin pattern' },
  { name: 'Baby love', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Baby love pattern' },
  { name: 'Knee rock', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Knee rocking pattern' },
  { name: 'Russian step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Russian step pattern' },
  { name: 'Baby freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Baby freeze position' },
  { name: 'Spider freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Spider freeze position' },
  { name: 'Headstand', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Headstand position' },
  { name: 'Back spin', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Back spinning power move' },
  { name: 'Baby swipe', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Baby swipe power move' },
  { name: 'Ormen', category: 'Tricks', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Ormen trick' },
  { name: 'Knee drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Knee dropping godown' },
  { name: 'Knee rock drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Knee rock dropping godown' }
];

// Sample badges data
const badgesData = [
  {
    name: 'Footwork Master',
    description: 'Master of footwork moves',
    category: 'Footwork',
    level: 'Advanced',
    image: '/badges/footwork.png',
    emoji: '🦶',
    requirements: {
      xpRequired: 500,
      levelRequired: 3
    },
    rarity: 'Rare'
  },
  {
    name: 'Power Mover',
    description: 'Master of power moves',
    category: 'Power',
    level: 'Advanced',
    image: '/badges/power.png',
    emoji: '💪',
    requirements: {
      xpRequired: 800,
      levelRequired: 4
    },
    rarity: 'Epic'
  },
  {
    name: 'Freeze King',
    description: 'Master of freeze positions',
    category: 'Freezes',
    level: 'Intermediate',
    image: '/badges/freezes.png',
    emoji: '🧊',
    requirements: {
      xpRequired: 300,
      levelRequired: 2
    },
    rarity: 'Common'
  }
];

// Sample events data
const eventsData = [
  {
    title: 'Nordic Break Championship',
    description: 'Annual breakdance championship in the Nordic region',
    category: 'Competition',
    date: new Date('2024-06-15'),
    endDate: new Date('2024-06-17'),
    location: 'Stockholm, Sweden',
    image: '/events/nordic-break.jpg',
    website: 'https://nordicbreak.com',
    organizer: 'Nordic Break Federation',
    maxParticipants: 200,
    price: 50,
    tags: ['championship', 'international', 'cash-prize']
  },
  {
    title: 'Workshop with DLoi',
    description: 'Learn advanced footwork from the legendary DLoi',
    category: 'Workshop',
    date: new Date('2024-05-20'),
    location: 'Berlin, Germany',
    image: '/events/workshop-dloi.jpg',
    website: 'https://dloi-workshop.com',
    organizer: 'DLoi Academy',
    maxParticipants: 30,
    price: 80,
    tags: ['workshop', 'footwork', 'advanced']
  }
];

// Sample users data
const usersData = [
  {
    username: 'admin',
    email: 'admin@breakverse.com',
    password: 'admin123',
    name: 'Admin User',
    level: 10,
    xp: 5000,
    status: 'admin',
    isAdmin: true
  },
  {
    username: 'breaker1',
    email: 'breaker1@example.com',
    password: 'password123',
    name: 'John Doe',
    level: 5,
    xp: 1200,
    status: 'active'
  },
  {
    username: 'breaker2',
    email: 'breaker2@example.com',
    password: 'password123',
    name: 'Jane Smith',
    level: 3,
    xp: 600,
    status: 'active'
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Move.deleteMany({});
    await Badge.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    await Battle.deleteMany({});
    await Crew.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Seed moves
    const moves = await Move.insertMany(movesData);
    console.log(`✅ Seeded ${moves.length} moves`);

    // Seed badges
    const badges = await Badge.insertMany(badgesData);
    console.log(`✅ Seeded ${badges.length} badges`);

    // Seed events
    const events = await Event.insertMany(eventsData);
    console.log(`✅ Seeded ${events.length} events`);

    // Seed users
    const users = await User.insertMany(usersData);
    console.log(`✅ Seeded ${users.length} users`);

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      moves: moves.length,
      badges: badges.length,
      events: events.length,
      users: users.length
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if this file is executed directly
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const runSeeder = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
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