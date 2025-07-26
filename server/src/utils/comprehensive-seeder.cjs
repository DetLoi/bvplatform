const bcrypt = require('bcryptjs');
const User = require('../models/user.models');
const Crew = require('../models/crew.models');
const Move = require('../models/move.models');
const Badge = require('../models/badge.models');
const Event = require('../models/event.models');
const Battle = require('../models/battle.models');

// Users data with simple passwords and dummy emails
const usersData = [
  {
    username: 'admin',
    name: 'Admin User',
    email: 'admin@breakverse.com',
    password: 'admin123',
    level: 15,
    xp: 15000,
    joinDate: '2024-01-01',
    status: 'admin',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Power Moves',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Windmill', 'Headspin', 'Flare', 'Back spin', 'Baby swipe', 'Turtles', 'Tapmill'],
    pendingMoves: [],
    achievements: 12,
    battleVideos: ['https://youtube.com/watch?v=xyz123', 'https://vimeo.com/uvw456'],
    bio: 'Admin of Breakverse - helping breakers level up their game!',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@admin_breaker',
      facebook: 'Admin Breaker'
    }
  },
  {
    username: 'dloi',
    name: 'DLoi',
    email: 'dloi@breakverse.com',
    password: 'dloi123',
    level: 12,
    xp: 8500,
    joinDate: '2024-01-15',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Power Moves',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Windmill', 'Headspin'],
    pendingMoves: ['Flare', 'Tapmill'],
    achievements: 8,
    battleVideos: ['https://youtube.com/watch?v=dloi_battle1'],
    bio: 'Power move specialist from Specific Kidz crew',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@dloi_breaker',
      facebook: 'DLoi Breaker'
    }
  },
  {
    username: 'benji',
    name: 'Benji',
    email: 'benji@breakverse.com',
    password: 'benji123',
    level: 10,
    xp: 6500,
    joinDate: '2024-02-01',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Footwork',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Coffee grinder', '2 step', '3 step'],
    pendingMoves: ['6 step', 'Hooks'],
    achievements: 6,
    battleVideos: ['https://youtube.com/watch?v=benji_footwork'],
    bio: 'Footwork master with smooth transitions',
    location: 'Aarhus, Denmark',
    socialMedia: {
      instagram: '@benji_footwork',
      facebook: 'Benji Footwork'
    }
  },
  {
    username: 'kien',
    name: 'Kien',
    email: 'kien@breakverse.com',
    password: 'kien123',
    level: 12,
    xp: 6500,
    joinDate: '2024-01-20',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Spins',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Back spin', 'Headspin'],
    pendingMoves: ['Flare', 'Tapmill'],
    achievements: 6,
    battleVideos: ['https://youtube.com/watch?v=kien_spins'],
    bio: 'Spin specialist with smooth transitions',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@kien_spins',
      facebook: 'Kien Spins'
    }
  },
  {
    username: 'pele',
    name: 'Pele',
    email: 'pele@breakverse.com',
    password: 'pele123',
    level: 11,
    xp: 5800,
    joinDate: '2024-01-25',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Freezes',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Yoga freeze', 'Turtle freeze', 'Baby freeze'],
    pendingMoves: ['Spider freeze', 'Headstand'],
    achievements: 5,
    battleVideos: ['https://youtube.com/watch?v=pele_freezes'],
    bio: 'Freeze master with solid holds',
    location: 'Aarhus, Denmark',
    socialMedia: {
      instagram: '@pele_freezes',
      facebook: 'Pele Freezes'
    }
  },
  {
    username: 'oritami',
    name: 'Oritami',
    email: 'oritami@breakverse.com',
    password: 'oritami123',
    level: 10,
    xp: 5200,
    joinDate: '2024-02-05',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Toprock',
    masteredMoves: ['Two step', 'Salsa step', 'Indian step', 'Charlie rock'],
    pendingMoves: ['Battle rock', 'Skater'],
    achievements: 4,
    battleVideos: ['https://youtube.com/watch?v=oritami_toprock'],
    bio: 'Toprock specialist with smooth style',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@oritami_toprock',
      facebook: 'Oritami Toprock'
    }
  },
  {
    username: 'yungm',
    name: 'Yung M',
    email: 'yungm@breakverse.com',
    password: 'yungm123',
    level: 9,
    xp: 4600,
    joinDate: '2024-02-10',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Windmills',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Windmill'],
    pendingMoves: ['Swipe', 'Headspin'],
    achievements: 3,
    battleVideos: ['https://youtube.com/watch?v=yungm_windmills'],
    bio: 'Windmill specialist with power moves',
    location: 'Aarhus, Denmark',
    socialMedia: {
      instagram: '@yungm_windmills',
      facebook: 'Yung M Windmills'
    }
  },
  {
    username: 'ronway',
    name: 'Ronway',
    email: 'ronway@breakverse.com',
    password: 'ronway123',
    level: 5,
    xp: 2200,
    joinDate: '2024-02-15',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Basics',
    masteredMoves: ['Two step', 'Salsa step'],
    pendingMoves: ['CC', 'Kick outs'],
    achievements: 1,
    battleVideos: ['https://youtube.com/watch?v=ronway_basics'],
    bio: 'Learning the basics and building foundation',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@ronway_basics',
      facebook: 'Ronway Basics'
    }
  },
  {
    username: 'illwill',
    name: 'Ill Will',
    email: 'illwill@breakverse.com',
    password: 'illwill123',
    level: 4,
    xp: 1600,
    joinDate: '2024-02-20',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Basics',
    masteredMoves: ['Two step'],
    pendingMoves: ['Salsa step', 'CC'],
    achievements: 1,
    battleVideos: ['https://youtube.com/watch?v=illwill_basics'],
    bio: 'Just starting my breaking journey',
    location: 'Aarhus, Denmark',
    socialMedia: {
      instagram: '@illwill_basics',
      facebook: 'Ill Will Basics'
    }
  },
  {
    username: 'luca',
    name: 'Luca',
    email: 'luca@breakverse.com',
    password: 'luca123',
    level: 3,
    xp: 1000,
    joinDate: '2024-02-25',
    status: 'user',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    crew: 'Specific Kidz',
    specialty: 'Basics',
    masteredMoves: ['Two step'],
    pendingMoves: ['Salsa step'],
    achievements: 0,
    battleVideos: ['https://youtube.com/watch?v=luca_basics'],
    bio: 'New to breaking, excited to learn!',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@luca_basics',
      facebook: 'Luca Basics'
    }
  }
];

// Crews data
const crewsData = [
  {
    name: 'Specific Kidz',
    description: 'Breaking crew from Denmark',
    memberCount: 12,
    totalXP: 32500,
    level: 14,
    color: '#e6c77b',
    logo: 'specifickidz.png'
  },
  {
    name: 'Famillia Loca',
    description: 'Breaking crew from Denmark',
    memberCount: 6,
    totalXP: 14500,
    level: 9,
    color: '#ff6b6b',
    logo: 'flc.png'
  }
];

// Moves data (first 50 moves)
const movesData = [
  { name: 'Two step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Knee drop', 'Salsa step', 'CC'] },
  { name: 'Salsa step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Two step', 'Indian step', 'Kick outs'] },
  { name: 'CC', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Two step', 'Kick outs', 'Yoga freeze'] },
  { name: 'Kick outs', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['CC', 'Salsa step', 'Turtle freeze'] },
  { name: 'Yoga freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['CC', 'Turtle freeze', 'Baby freeze'] },
  { name: 'Turtle freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Kick outs', 'Yoga freeze', 'Windmill'] },
  { name: 'Butt spin', category: 'Power', level: 'Beginner', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Back spin', 'Cartwheel', 'Squat down'] },
  { name: 'Cartwheel', category: 'Tricks', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Butt spin', 'Macaco', 'Aerial'] },
  { name: 'Squat down', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Butt spin', 'Corkspin drop', 'Knee drop'] },
  { name: 'Corkspin drop', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Squat down', 'Knee drop', 'Hook'] },
  { name: 'Indian step', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Salsa step', 'Charlie rock', 'Battle rock'] },
  { name: 'Charlie rock', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Indian step', 'Battle rock', 'Skater'] },
  { name: 'Coffee grinder', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['2 step', '3 step', '6 step'] },
  { name: '2 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Coffee grinder', '3 step', 'Hooks'] },
  { name: '3 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['2 step', 'Coffee grinder', '4 step'] },
  { name: 'Hooks', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['2 step', 'Zulu spin', 'Half sweeps'] },
  { name: 'Zulu spin', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Hooks', 'Baby love', 'Monkey swing'] },
  { name: 'Baby love', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Zulu spin', 'Knee rock', 'Russian step'] },
  { name: 'Knee rock', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Baby love', 'Russian step', 'Knee drop'] },
  { name: 'Russian step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Knee rock', 'Baby love', 'Over/under lap'] },
  { name: 'Baby freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Yoga freeze', 'Spider freeze', 'Halo'] },
  { name: 'Spider freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Baby freeze', 'Headstand', 'Handstand'] },
  { name: 'Headstand', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Spider freeze', 'Handstand', 'Headspin'] },
  { name: 'Back spin', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Butt spin', 'Baby swipe', 'Windmill'] },
  { name: 'Baby swipe', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Back spin', 'Swipe', 'Turtles'] },
  { name: 'Ormen', category: 'Tricks', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Cartwheel', 'Macaco', 'Icey Ice'] },
  { name: 'Knee drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Squat down', 'Knee rock', 'Hook'] },
  { name: 'Knee rock drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Knee drop', 'Knee rock', 'Power step back'] },
  { name: 'Battle rock', category: 'Toprock', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Indian step', 'Charlie rock', 'Skater'] },
  { name: 'Over/under lap', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Russian step', '6 step', 'Pretzels'] },
  { name: '6 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Coffee grinder', 'Over/under lap', 'Gorilla 6 step'] },
  { name: '4 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['3 step', '5 step', '7 step'] },
  { name: '5 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['4 step', '6 step', '7 step'] },
  { name: '7 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['6 step', '8 step', 'Peter pan'] },
  { name: '8 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['7 step', 'Peter pan', 'Permanent increase'] },
  { name: 'Peter pan', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['7 step', '8 step', 'Monkey swing'] },
  { name: 'Permanent increase', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['8 step', 'Half sweeps', 'Monkey swing'] },
  { name: 'Half sweeps', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Hooks', 'Permanent increase', 'Knock out'] },
  { name: 'Monkey swing', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Zulu spin', 'Peter pan', 'Permanent increase'] },
  { name: 'Handstand', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Headstand', 'Shoulder freeze', 'Elbow freeze'] },
  { name: 'Shoulder freeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Handstand', 'Elbow freeze', 'Chairfreeze'] },
  { name: 'Elbow freeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Shoulder freeze', 'Chairfreeze', '1-hand freeze'] },
  { name: 'Chairfreeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Shoulder freeze', 'Elbow freeze', '1-hand freeze'] },
  { name: 'Windmill', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Back spin', 'Turtle freeze', 'Swipe'] },
  { name: 'Swipe', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Baby swipe', 'Windmill', 'Headspin'] },
  { name: 'Headspin', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Headstand', 'Swipe', 'Turtles'] },
  { name: 'Turtles', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Turtle freeze', 'Headspin', 'Flare'] },
  { name: 'Hook', category: 'GoDowns', level: 'Intermediate', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Knee drop', 'Corkspin drop', 'Power step back'] },
  { name: 'Macaco', category: 'Tricks', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Cartwheel', 'Ormen', 'Kick-up'] },
  { name: 'Icey Ice', category: 'Tricks', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Ormen', 'Halo', 'Aerial'] }
];

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

    // Seed Users
    console.log('Seeding users...');
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Seed Crews
    console.log('Seeding crews...');
    const createdCrews = await Crew.insertMany(crewsData);
    console.log(`✅ Created ${createdCrews.length} crews`);

    // Seed Moves
    console.log('Seeding moves...');
    const createdMoves = await Move.insertMany(movesData);
    console.log(`✅ Created ${createdMoves.length} moves`);

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

module.exports = { seedDatabase }; 