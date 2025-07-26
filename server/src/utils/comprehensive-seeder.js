import bcrypt from 'bcryptjs';
import User from '../models/user.models.js';
import Crew from '../models/crew.models.js';
import Move from '../models/move.models.js';
import Badge from '../models/badge.models.js';
import Event from '../models/event.models.js';
import Battle from '../models/battle.models.js';

// Users data with simple passwords and dummy emails
const usersData = [
  {
    username: 'admin',
    name: 'Admin User',
    email: 'admin@breakverse.com',
    password: 'admin123',
    level: 15,
    xp: 15000,
    status: 'admin',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    crew: null,
    specialty: 'Power Moves',
    masteredMoves: [],
    pendingMoves: [],
    achievements: 12,
    battleVideos: ['https://youtube.com/watch?v=xyz123', 'https://vimeo.com/uvw456'],
    bio: 'Admin of Breakverse - helping breakers level up their game!',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@admin_breaker',
      facebook: 'Admin Breaker'
    }
  }
];

// Crews data
const crewsData = [
  {
    name: 'Specific Kidz',
    description: 'Breaking crew from Denmark',
    color: '#e6c77b',
    logo: 'specifickidz.png',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@specifickidz',
      facebook: 'Specific Kidz'
    }
  },
  {
    name: 'Famillia Loca',
    description: 'Breaking crew from Denmark',
    color: '#ff6b6b',
    logo: 'flc.png',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@famillialoca',
      facebook: 'Famillia Loca'
    }
  }
];

// Moves data (first 50 moves) - without recommendations for initial insert
const movesData = [
  { name: 'Two step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Salsa step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'CC', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Kick outs', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Yoga freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Turtle freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Butt spin', category: 'Power', level: 'Beginner', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Cartwheel', category: 'Tricks', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Squat down', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Corkspin drop', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Indian step', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Charlie rock', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Coffee grinder', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: '2 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: '3 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Hooks', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Zulu spin', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Baby love', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Knee rock', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Russian step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Baby freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Spider freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Headstand', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Back spin', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Baby swipe', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Ormen', category: 'Tricks', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Knee drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Knee rock drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Battle rock', category: 'Toprock', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Over/under lap', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: '6 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: '4 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: '5 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: '7 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: '8 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Peter pan', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Permanent increase', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Half sweeps', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Monkey swing', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Handstand', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Shoulder freeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Elbow freeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Chairfreeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Windmill', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Swipe', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Headspin', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' },
  { name: 'Turtles', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI' },
  { name: 'Hook', category: 'GoDowns', level: 'Intermediate', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
  { name: 'Macaco', category: 'Tricks', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o' },
  { name: 'Icey Ice', category: 'Tricks', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0' }
];

// Move recommendations data (separate from initial insert)
const moveRecommendations = {
  'Two step': ['Knee drop', 'Salsa step', 'CC'],
  'Salsa step': ['Two step', 'Indian step', 'Kick outs'],
  'CC': ['Two step', 'Kick outs', 'Yoga freeze'],
  'Kick outs': ['CC', 'Salsa step', 'Turtle freeze'],
  'Yoga freeze': ['CC', 'Turtle freeze', 'Baby freeze'],
  'Turtle freeze': ['Kick outs', 'Yoga freeze', 'Windmill'],
  'Butt spin': ['Back spin', 'Cartwheel', 'Squat down'],
  'Cartwheel': ['Butt spin', 'Macaco', 'Aerial'],
  'Squat down': ['Butt spin', 'Corkspin drop', 'Knee drop'],
  'Corkspin drop': ['Squat down', 'Knee drop', 'Hook'],
  'Indian step': ['Salsa step', 'Charlie rock', 'Battle rock'],
  'Charlie rock': ['Indian step', 'Battle rock', 'Skater'],
  'Coffee grinder': ['2 step', '3 step', '6 step'],
  '2 step': ['Coffee grinder', '3 step', 'Hooks'],
  '3 step': ['2 step', 'Coffee grinder', '4 step'],
  'Hooks': ['2 step', 'Zulu spin', 'Half sweeps'],
  'Zulu spin': ['Hooks', 'Baby love', 'Monkey swing'],
  'Baby love': ['Zulu spin', 'Knee rock', 'Russian step'],
  'Knee rock': ['Baby love', 'Russian step', 'Knee drop'],
  'Russian step': ['Knee rock', 'Baby love', 'Over/under lap'],
  'Baby freeze': ['Yoga freeze', 'Spider freeze', 'Halo'],
  'Spider freeze': ['Baby freeze', 'Headstand', 'Handstand'],
  'Headstand': ['Spider freeze', 'Handstand', 'Headspin'],
  'Back spin': ['Butt spin', 'Baby swipe', 'Windmill'],
  'Baby swipe': ['Back spin', 'Swipe', 'Turtles'],
  'Ormen': ['Cartwheel', 'Macaco', 'Icey Ice'],
  'Knee drop': ['Squat down', 'Knee rock', 'Hook'],
  'Knee rock drop': ['Knee drop', 'Knee rock', 'Power step back'],
  'Battle rock': ['Indian step', 'Charlie rock', 'Skater'],
  'Over/under lap': ['Russian step', '6 step', 'Pretzels'],
  '6 step': ['Coffee grinder', 'Over/under lap', 'Gorilla 6 step'],
  '4 step': ['3 step', '5 step', '7 step'],
  '5 step': ['4 step', '6 step', '7 step'],
  '7 step': ['6 step', '8 step', 'Peter pan'],
  '8 step': ['7 step', 'Peter pan', 'Permanent increase'],
  'Peter pan': ['7 step', '8 step', 'Monkey swing'],
  'Permanent increase': ['8 step', 'Half sweeps', 'Monkey swing'],
  'Half sweeps': ['Hooks', 'Permanent increase', 'Knock out'],
  'Monkey swing': ['Zulu spin', 'Peter pan', 'Permanent increase'],
  'Handstand': ['Headstand', 'Shoulder freeze', 'Elbow freeze'],
  'Shoulder freeze': ['Handstand', 'Elbow freeze', 'Chairfreeze'],
  'Elbow freeze': ['Shoulder freeze', 'Chairfreeze', '1-hand freeze'],
  'Chairfreeze': ['Shoulder freeze', 'Elbow freeze', '1-hand freeze'],
  'Windmill': ['Back spin', 'Turtle freeze', 'Swipe'],
  'Swipe': ['Baby swipe', 'Windmill', 'Headspin'],
  'Headspin': ['Headstand', 'Swipe', 'Turtles'],
  'Turtles': ['Turtle freeze', 'Headspin', 'Flare'],
  'Hook': ['Knee drop', 'Corkspin drop', 'Power step back'],
  'Macaco': ['Cartwheel', 'Ormen', 'Kick-up'],
  'Icey Ice': ['Ormen', 'Halo', 'Aerial']
};

// Badges data
const badgesData = [
  {
    name: 'Toprock Master',
    description: 'Complete all Toprock moves',
    image: 'topbadge.png',
    category: 'Toprock',
    requirement: 'Complete all moves in Toprock category'
  },
  {
    name: 'Footwork Master',
    description: 'Complete all Footwork moves',
    image: 'footwork.png',
    category: 'Footwork',
    requirement: 'Complete all moves in Footwork category'
  },
  {
    name: 'Freezes Master',
    description: 'Complete all Freezes moves',
    image: 'freezes.png',
    category: 'Freezes',
    requirement: 'Complete all moves in Freezes category'
  },
  {
    name: 'Power Master',
    description: 'Complete all Power moves',
    image: 'Powermoves.png',
    category: 'Power',
    requirement: 'Complete all moves in Power category'
  },
  {
    name: 'Tricks Master',
    description: 'Complete all Tricks moves',
    image: 'Tricks.png',
    category: 'Tricks',
    requirement: 'Complete all moves in Tricks category'
  },
  {
    name: 'GoDowns Master',
    description: 'Complete all GoDowns moves',
    image: 'Godown.png',
    category: 'GoDowns',
    requirement: 'Complete all moves in GoDowns category'
  },
  {
    name: 'Ground Master',
    description: 'Complete all ground power moves',
    image: 'ground.png',
    category: 'Power',
    requirement: 'Complete all ground power moves'
  },
  {
    name: 'Air Master',
    description: 'Complete all air power moves',
    image: 'air.png',
    category: 'Power',
    requirement: 'Complete all air power moves'
  },
  {
    name: 'Beginner',
    description: 'Complete beginner level moves',
    image: 'beginner.png',
    category: 'Level',
    requirement: 'Complete all beginner moves'
  },
  {
    name: 'Novice',
    description: 'Complete novice level moves',
    image: 'novice.png',
    category: 'Level',
    requirement: 'Complete all novice moves'
  },
  {
    name: 'Intermediate',
    description: 'Complete intermediate level moves',
    image: 'intermediate.png',
    category: 'Level',
    requirement: 'Complete all intermediate moves'
  },
  {
    name: 'Advanced',
    description: 'Complete advanced level moves',
    image: 'Advanced.png',
    category: 'Level',
    requirement: 'Complete all advanced moves'
  },
  {
    name: 'Skilled',
    description: 'Complete skilled level moves',
    image: 'skilled.png',
    category: 'Level',
    requirement: 'Complete all skilled moves'
  },
  {
    name: 'Master',
    description: 'Complete master level moves',
    image: 'master.png',
    category: 'Level',
    requirement: 'Complete all master moves'
  },
  {
    name: 'Grandmaster',
    description: 'Complete grandmaster level moves',
    image: 'grandmaster.png',
    category: 'Level',
    requirement: 'Complete all grandmaster moves'
  }
];

// Events data
const eventsData = [
  {
    title: "Nordic Break League 2025",
    date: "March 15, 2025",
    time: "18:00 - 22:00",
    location: "Copenhagen Breakdance Center",
    battleFormat: "2v2 international + kids battle",
    category: "Competition",
    description: "The biggest breaking competition of the year! Show off your skills and compete against the best breakers in Denmark. Categories include: Toprock, Footwork, Freezes, Power Moves, and All-Style. Cash prizes and trophies for winners.",
    image: "image00006.jpeg",
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 32,
    currentParticipants: 24,
    entryFee: "Free",
    prizes: "Cash prizes and trophies",
    organizer: "Nordic Break League",
    contactEmail: "info@nordicbreakleague.com",
    website: "https://nordicbreak.dk",
    socialMedia: {
      instagram: "@nordicbreakleague",
      facebook: "Nordic Break League"
    }
  },
  {
    title: "Workshop with DLoi - Power Moves Masterclass",
    date: "February 28, 2024",
    time: "14:00 - 17:00",
    location: "Urban Dance Studio, Copenhagen",
    participants: 18,
    maxParticipants: 20,
    category: "Workshop",
    description: "Join DLoi from Specific Kidz for an intensive 3-hour workshop focusing on power moves and transitions. Perfect for intermediate to advanced breakers looking to level up their game. Learn proper technique, safety, and progression methods.",
    image: "ws.png",
    status: "upcoming",
    featured: false,
    registrationOpen: true,
    entryFee: "150 DKK",
    prizes: "Certificate of completion",
    organizer: "Urban Dance Studio",
    contactEmail: "workshops@urbandancestudio.dk",
    website: "https://urbandancestudio.dk",
    socialMedia: {
      instagram: "@urbandancestudio",
      facebook: "Urban Dance Studio"
    }
  },
  {
    title: "Cypher Night - Open Floor",
    date: "February 10, 2024",
    time: "20:00 - 02:00",
    location: "Underground Club, Copenhagen",
    participants: 45,
    maxParticipants: 60,
    category: "Cypher",
    description: "A night of pure breaking culture! Open cypher with live DJ, no competition, just pure expression and community. All levels welcome. Bring your A-game and positive energy! Live DJ spinning classic breakbeats.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: false,
    registrationOpen: false,
    entryFee: "50 DKK",
    prizes: "None - pure cypher",
    organizer: "Underground Club",
    contactEmail: "events@undergroundclub.dk",
    website: "https://undergroundclub.dk",
    socialMedia: {
      instagram: "@undergroundclub",
      facebook: "Underground Club"
    }
  },
  {
    title: "Red Bull BC One Denmark Qualifier",
    date: "April 20, 2024",
    time: "16:00 - 23:00",
    location: "Kødbyen, Copenhagen",
    battleFormat: "1v1 battle",
    category: "Competition",
    description: "Qualify for the Red Bull BC One World Finals! The most prestigious breaking competition in the world. Only the best breakers from Denmark will compete for the chance to represent at the global stage.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 64,
    currentParticipants: 48,
    entryFee: "100 DKK",
    prizes: "Trip to World Finals + cash prize",
    organizer: "Red Bull",
    contactEmail: "bcone@redbull.dk",
    website: "https://www.redbull.com/bcone",
    socialMedia: {
      instagram: "@redbullbcone",
      facebook: "Red Bull BC One"
    }
  }
];

// Battles data
const battlesData = [
  {
    challenger: {
      id: "user1",
      name: "DLoi",
      level: "Advanced",
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user2", 
      name: "Yung M",
      level: "Skilled",
      crew: "Famillia Loca"
    },
    status: "pending",
    callOutDate: "2024-01-15T10:30:00Z",
    responseDate: null,
    acceptedBy: null,
    acceptedDate: null,
    roomId: null,
    videos: {
      challenger: null,
      opponent: null
    },
    adminReview: {
      isReady: false,
      judgedBy: null,
      winner: null,
      score: null,
      comments: null,
      judgedDate: null
    },
    category: "All-Style",
    description: "Let's see who has the better footwork! Been watching your moves and I think we should battle it out.",
    stakes: "Respect and bragging rights"
  },
  {
    challenger: {
      id: "user3",
      name: "Benji",
      level: "Advanced", 
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user1",
      name: "DLoi",
      level: "Advanced",
      crew: "Specific Kidz"
    },
    status: "accepted",
    callOutDate: "2024-01-10T14:20:00Z",
    responseDate: "2024-01-12T09:15:00Z",
    acceptedBy: "opponent",
    acceptedDate: "2024-01-12T09:15:00Z",
    roomId: "battle_room_2",
    videos: {
      challenger: null,
      opponent: null
    },
    adminReview: {
      isReady: false,
      judgedBy: null,
      winner: null,
      score: null,
      comments: null,
      judgedDate: null
    },
    category: "Power Moves",
    description: "Power move battle - let's see who can throw down harder! Been practicing my flares and I want to test them against you.",
    stakes: "Respect and bragging rights"
  },
  {
    challenger: {
      id: "user1",
      name: "DLoi", 
      level: "Advanced",
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user4",
      name: "Kien",
      level: "Intermediate",
      crew: "Specific Kidz"
    },
    status: "in_progress",
    callOutDate: "2024-01-08T16:45:00Z",
    responseDate: "2024-01-09T11:30:00Z", 
    acceptedBy: "opponent",
    acceptedDate: "2024-01-09T11:30:00Z",
    roomId: "battle_room_3",
    videos: {
      challenger: "https://example.com/video1.mp4",
      opponent: null
    },
    adminReview: {
      isReady: false,
      judgedBy: null,
      winner: null,
      score: null,
      comments: null,
      judgedDate: null
    },
    category: "Footwork",
    description: "Footwork battle - let's see who has the smoother moves!",
    stakes: "Respect and bragging rights"
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting comprehensive database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Crew.deleteMany({});
    await Move.deleteMany({});
    await Badge.deleteMany({});
    await Event.deleteMany({});
    await Battle.deleteMany({});

    // Seed Moves first (needed for user references)
    console.log('Seeding moves...');
    const createdMoves = await Move.insertMany(movesData);
    console.log(`✅ Created ${createdMoves.length} moves`);

    // Update moves with proper recommendations (ObjectIds)
    console.log('Updating move recommendations...');
    for (const move of createdMoves) {
      const recommendations = moveRecommendations[move.name];
      if (recommendations) {
        const recommendationIds = recommendations.map(recName => {
          const recMove = createdMoves.find(m => m.name === recName);
          return recMove ? recMove._id : null;
        }).filter(id => id !== null);
        
        await Move.findByIdAndUpdate(move._id, { recommendations: recommendationIds });
      }
    }

    // Seed Users first (needed for crew leaders)
    console.log('Seeding users...');
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Find moves by name for mastered and pending moves
        const masteredMoveIds = user.masteredMoves.map(moveName => {
          const move = createdMoves.find(m => m.name === moveName);
          return move ? move._id : null;
        }).filter(id => id !== null);
        
        const pendingMoveIds = user.pendingMoves.map(moveName => {
          const move = createdMoves.find(m => m.name === moveName);
          return move ? move._id : null;
        }).filter(id => id !== null);
        
        return { 
          ...user, 
          password: hashedPassword,
          masteredMoves: masteredMoveIds,
          pendingMoves: pendingMoveIds,
          crew: null // Will be set after crews are created
        };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Seed Crews with leaders
    console.log('Seeding crews...');
    const crewsWithLeaders = crewsData.map(crew => {
      // Find a user from this crew to be the leader
      const crewUser = createdUsers.find(user => user.crew === crew.name);
      return {
        ...crew,
        leader: crewUser ? crewUser._id : createdUsers[0]._id // fallback to first user
      };
    });
    const createdCrews = await Crew.insertMany(crewsWithLeaders);
    console.log(`✅ Created ${createdCrews.length} crews`);

    // Update users with crew references
    console.log('Updating user crew references...');
    for (const user of createdUsers) {
      const crew = createdCrews.find(c => c.name === user.crew);
      if (crew) {
        await User.findByIdAndUpdate(user._id, { crew: crew._id });
      }
    }



    // Seed Badges
    console.log('Seeding badges...');
    const createdBadges = await Badge.insertMany(badgesData);
    console.log(`✅ Created ${createdBadges.length} badges`);

    // Seed Events
    console.log('Seeding events...');
    const createdEvents = await Event.insertMany(eventsData);
    console.log(`✅ Created ${createdEvents.length} events`);

    // Seed Battles
    console.log('Seeding battles...');
    const createdBattles = await Battle.insertMany(battlesData);
    console.log(`✅ Created ${createdBattles.length} battles`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Crews: ${createdCrews.length}`);
    console.log(`- Moves: ${createdMoves.length}`);
    console.log(`- Badges: ${createdBadges.length}`);
    console.log(`- Events: ${createdEvents.length}`);
    console.log(`- Battles: ${createdBattles.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

export { seedDatabase }; 