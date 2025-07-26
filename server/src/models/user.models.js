import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: function() {
        // Only require password on new documents, not on updates
        return this.isNew;
      },
      minlength: 6
    },
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    level: { 
      type: Number, 
      default: 1,
      min: 1,
      max: 100
    },
    xp: { 
      type: Number, 
      default: 0,
      min: 0
    },
    masteredMoves: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Move' 
    }],
    pendingMoves: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Move' 
    }],
    profileImage: { 
      type: String 
    },
    coverImage: { 
      type: String 
    },
    battleVideos: [{ 
      type: String 
    }],
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'admin', 'banned'], 
      default: 'active' 
    },
    crew: { 
      type: Schema.Types.ObjectId, 
      ref: 'Crew' 
    },
    badges: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Badge' 
    }],
    isAdmin: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Auto-recalculate level and XP before saving
userSchema.pre('save', async function(next) {
  try {
    // If mastered moves have changed, recalculate XP
    if (this.isModified('masteredMoves')) {
      const Move = model('Move');
      const moves = await Move.find({ _id: { $in: this.masteredMoves } });
      this.xp = moves.reduce((sum, move) => sum + move.xp, 0);
    }
    
    // Always recalculate level based on current state
    this.level = this.calculateLevel();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level from moves and XP
userSchema.methods.calculateLevel = function() {
  // Base level from XP
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  let xpLevel = 1;
  
  for (let i = 0; i < xpThresholds.length; i++) {
    if (this.xp >= xpThresholds[i]) {
      xpLevel = i + 1;
    } else {
      break;
    }
  }
  
  // Level from moves mastered (more weight on moves)
  const movesLevel = Math.min(Math.floor(this.masteredMoves.length / 2) + 1, 15);
  
  // Combine both factors, giving more weight to moves
  const combinedLevel = Math.round((movesLevel * 0.7) + (xpLevel * 0.3));
  
  return Math.min(Math.max(combinedLevel, 1), 15);
};

// Method to get next level XP
userSchema.methods.getNextLevelXP = function() {
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  const currentLevel = this.calculateLevel();
  
  if (currentLevel >= 10) return this.xp;
  return xpThresholds[currentLevel];
};

// Method to get progress to next level
userSchema.methods.getProgress = function() {
  const currentLevel = this.calculateLevel();
  const nextLevelXP = this.getNextLevelXP();
  const currentLevelXP = currentLevel > 1 ? [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000][currentLevel - 2] : 0;
  
  // Handle edge cases
  if (nextLevelXP === null || nextLevelXP === this.xp) return 100;
  if (currentLevelXP >= nextLevelXP) return 100;
  
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = this.xp - currentLevelXP;
  
  // Ensure progress is between 0 and 100
  const progress = Math.max(0, Math.min(100, Math.round((xpProgress / totalXPNeeded) * 100)));
  
  return progress;
};

// Method to check and assign badges based on moves and level
userSchema.methods.checkAndAssignBadges = async function() {
  const Badge = model('Badge');
  const Move = model('Move');
  
  try {
    // Get all badges
    const allBadges = await Badge.find({ isActive: true });
    
    // Get user's mastered moves with full details
    const masteredMoves = await Move.find({ _id: { $in: this.masteredMoves } });
    const masteredMoveNames = masteredMoves.map(move => move.name);
    
    const newBadges = [];
    
    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (this.badges.includes(badge._id)) continue;
      
      let shouldAssign = false;
      
      // Check category badges
      if (badge.category && badge.category !== 'Special') {
        const categoryMoves = this.getCategoryMoves(badge.category);
        const masteredInCategory = masteredMoveNames.filter(moveName => 
          categoryMoves.includes(moveName)
        );
        shouldAssign = masteredInCategory.length === categoryMoves.length;
      }
      
      // Check level badges
      if (badge.category === 'Special' && badge.level) {
        const levelMoves = this.getLevelMoves(badge.level);
        const masteredInLevel = masteredMoveNames.filter(moveName => 
          levelMoves.includes(moveName)
        );
        shouldAssign = masteredInLevel.length === levelMoves.length;
      }
      
      // Check Grandmaster badge (requires all level badges)
      if (badge.name === 'Grandmaster') {
        const levelBadgeNames = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master'];
        const allLevelMoves = levelBadgeNames.flatMap(level => this.getLevelMoves(level));
        const masteredLevelMoves = masteredMoveNames.filter(moveName => allLevelMoves.includes(moveName));
        shouldAssign = masteredLevelMoves.length === allLevelMoves.length;
      }
      
      // Check power subcategory badges
      if (badge.name === 'Ground Master') {
        const groundPowerMoves = ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin'];
        const masteredGroundPower = masteredMoveNames.filter(moveName => 
          groundPowerMoves.includes(moveName)
        );
        shouldAssign = masteredGroundPower.length === groundPowerMoves.length;
      }
      
      if (badge.name === 'Air Master') {
        const airPowerMoves = ['Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
        const masteredAirPower = masteredMoveNames.filter(moveName => 
          airPowerMoves.includes(moveName)
        );
        shouldAssign = masteredAirPower.length === airPowerMoves.length;
      }
      
      if (shouldAssign) {
        this.badges.push(badge._id);
        newBadges.push(badge);
      }
    }
    
    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
};

// Helper method to get category moves
userSchema.methods.getCategoryMoves = function(category) {
  const categoryMovesMap = {
    'Toprock': ['Two step', 'Salsa step', 'Indian step', 'Charlie rock', 'Battle rock', 'Skater', 'Jerk rock'],
    'Footwork': ['CC', 'Kick outs', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Gorilla 6 step', 'Knock out', 'Pretzels'],
    'Freezes': ['Yoga freeze', 'Turtle freeze', 'Baby freeze', 'Spider freeze', 'Headstand', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Airchair', 'Suicide', 'L-kick', 'V-kick'],
    'Power': ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'],
    'Tricks': ['Cartwheel', 'Ormen', 'Icey Ice', 'Macaco', 'Kick-up', 'Aerial', 'Butterfly'],
    'GoDowns': ['Squat down', 'Corkspin drop', 'Knee drop', 'Knee rock', 'Hook', 'Power step back', 'Power front kick', 'Coindrop', 'Power back kick']
  };
  return categoryMovesMap[category] || [];
};

// Helper method to get level moves
userSchema.methods.getLevelMoves = function(level) {
  const levelMovesMap = {
    'beginner': ['Two step', 'Salsa step', 'CC', 'Kick outs', 'Yoga freeze', 'Turtle freeze', 'Butt spin', 'Cartwheel', 'Squat down', 'Corkspin drop'],
    'novice': ['Indian step', 'Charlie rock', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Baby freeze', 'Spider freeze', 'Headstand', 'Back spin', 'Baby swipe', 'Ormen', 'Knee drop', 'Knee rock drop'],
    'intermediate': ['Battle rock', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Hook', 'Macaco', 'Icey Ice'],
    'advanced': ['Skater', 'Jerk rock', 'Gorilla 6 step', 'Knock out', 'Pretzels', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Power step back', 'Power front kick', 'Kick-up', 'Aerial', 'Butterfly'],
    'skilled': ['Airchair', 'Suicide', 'L-kick', 'V-kick', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin', 'Coindrop'],
    'master': ['Halo freeze', 'Sandwich', 'Hollowback', 'Airflare', 'Airtrack', 'Starstruck', 'Critical', 'Corkscrew'],
    'grandmaster': [] // Special case - will show level badges instead
  };
  return levelMovesMap[level.toLowerCase()] || [];
};

export default model('User', userSchema); 