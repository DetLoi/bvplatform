import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.models.js';
import Crew from '../models/crew.models.js';

dotenv.config();

const missingUsers = [
  // Specific Kidz members
  {
    username: 'dloi',
    email: 'dloi@breakverse.com',
    name: 'DLoi',
    level: 15,
    xp: 8500,
    specialty: 'Power Moves',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'benji',
    email: 'benji@breakverse.com',
    name: 'Benji',
    level: 13,
    xp: 7200,
    specialty: 'Footwork',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'kien',
    email: 'kien@breakverse.com',
    name: 'Kien',
    level: 12,
    xp: 6500,
    specialty: 'Spins',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'pele',
    email: 'pele@breakverse.com',
    name: 'Pele',
    level: 11,
    xp: 5800,
    specialty: 'Freezes',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'oritami',
    email: 'oritami@breakverse.com',
    name: 'Oritami',
    level: 10,
    xp: 5200,
    specialty: 'Toprock',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'yungm',
    email: 'yungm@breakverse.com',
    name: 'Yung M',
    level: 9,
    xp: 4600,
    specialty: 'Windmills',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'niels',
    email: 'niels@breakverse.com',
    name: 'Niels',
    level: 8,
    xp: 4000,
    specialty: 'Headspins',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'armony',
    email: 'armony@breakverse.com',
    name: 'Armony',
    level: 7,
    xp: 3400,
    specialty: 'Backspins',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'cptjomar',
    email: 'cptjomar@breakverse.com',
    name: 'Cpt. Jomar',
    level: 6,
    xp: 2800,
    specialty: 'Baby Freezes',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'ronway',
    email: 'ronway@breakverse.com',
    name: 'Ronway',
    level: 5,
    xp: 2200,
    specialty: 'Basics',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'illwill',
    email: 'illwill@breakverse.com',
    name: 'Ill Will',
    level: 4,
    xp: 1600,
    specialty: 'Basics',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'luca',
    email: 'luca@breakverse.com',
    name: 'Luca',
    level: 3,
    xp: 1000,
    specialty: 'Basics',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  // Famillia Loca members
  {
    username: 'emilio',
    email: 'emilio@breakverse.com',
    name: 'Emilio',
    level: 12,
    xp: 6800,
    specialty: 'Power Moves',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'andy',
    email: 'andy@breakverse.com',
    name: 'Andy',
    level: 10,
    xp: 5200,
    specialty: 'Spins',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'danielito',
    email: 'danielito@breakverse.com',
    name: 'Danielito',
    level: 8,
    xp: 3800,
    specialty: 'Freezes',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'alireza',
    email: 'alireza@breakverse.com',
    name: 'Alireza',
    level: 7,
    xp: 3200,
    specialty: 'Footwork',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'bravo',
    email: 'bravo@breakverse.com',
    name: 'Bravo',
    level: 6,
    xp: 2600,
    specialty: 'Toprock',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

const addMissingUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('👥 Adding missing users...');
    
    for (const userData of missingUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`⚠️ User ${userData.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        masteredMoves: [],
        pendingMoves: [],
        badges: [],
        crew: null
      });

      console.log(`✅ Created user: ${userData.username} (${userData.name})`);
    }

    console.log('🎉 All missing users added successfully!');
    
    // Update crews with proper member references
    console.log('🔄 Updating crews with member references...');
    
    // Get all users
    const allUsers = await User.find();
    const userMap = {};
    allUsers.forEach(user => {
      userMap[user.username.toLowerCase()] = user._id;
    });

    // Update Specific Kidz crew
    const specificKidzCrew = await Crew.findOne({ name: 'Specific Kidz' });
    if (specificKidzCrew) {
      const specificKidzMembers = [
        'dloi', 'benji', 'kien', 'pele', 'oritami', 'yungm', 
        'niels', 'armony', 'cptjomar', 'ronway', 'illwill', 'luca'
      ].map(username => userMap[username]).filter(id => id);
      
      await Crew.findByIdAndUpdate(specificKidzCrew._id, {
        members: specificKidzMembers
      });
      console.log('✅ Updated Specific Kidz crew members');
    }

    // Update Famillia Loca crew
    const familiaLocaCrew = await Crew.findOne({ name: 'Famillia Loca' });
    if (familiaLocaCrew) {
      const familiaLocaMembers = [
        'emilio', 'andy', 'danielito', 'alireza', 'bravo'
      ].map(username => userMap[username]).filter(id => id);
      
      await Crew.findByIdAndUpdate(familiaLocaCrew._id, {
        members: familiaLocaMembers
      });
      console.log('✅ Updated Famillia Loca crew members');
    }

    console.log('🎉 Crew member updates completed!');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addMissingUsers(); 