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
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000
    },
    battleVideos: [{ 
      type: String 
    }],
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'banned'], 
      default: 'active' 
    },
    roles: {
      type: [String],
      enum: ['student', 'instructor', 'judge', 'admin'],
      default: ['student']
    },
    
    // Instructor assignment for students
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Only set if user has student role
      validate: {
        validator: function(instructorId) {
          // If instructor is set, user must be a student
          if (instructorId && !this.hasRole('student')) {
            return false;
          }
          return true;
        },
        message: 'Only students can have an instructor assigned'
      }
    },

    badges: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Badge' 
    }],
    // Battle statistics - readonly fields managed by system
    battleXP: {
      type: Number,
      default: 0,
      min: 0
    },
    battleLevel: {
      type: Number,
      default: 1,
      min: 1
    },
    battleWins: {
      type: Number,
      default: 0,
      min: 0
    },
    battleLosses: {
      type: Number,
      default: 0,
      min: 0
    },
    battlesParticipated: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { 
    timestamps: true 
  }
);

// Verification fields
userSchema.add({
  isVerified: {
    type: Boolean,
    default: true // keep existing users functional; new /register sets this to false explicitly
  },
  verificationCodeHash: {
    type: String,
    select: false
  },
  verificationCodeExpiry: {
    type: Date,
    select: false
  }
});

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

// Method to check if user has a specific role
userSchema.methods.hasRole = function(role) {
  return this.roles && this.roles.includes(role);
};

// Method to check if user is admin (backward compatibility)
userSchema.methods.isAdmin = function() {
  return this.hasRole('admin') || this.isAdmin === true;
};

// Method to check if user is judge
userSchema.methods.isJudge = function() {
  return this.hasRole('judge');
};

// Method to check if user is instructor
userSchema.methods.isInstructor = function() {
  return this.hasRole('instructor');
};

// Method to check if user is student
userSchema.methods.isStudent = function() {
  return this.hasRole('student');
};

// Static method to get all instructors
userSchema.statics.getInstructors = function() {
  return this.find({ roles: { $in: ['instructor'] } })
    .select('username name email profileImage bio')
    .sort({ username: 1 });
};

// Static method to get students by instructor
userSchema.statics.getStudentsByInstructor = function(instructorId) {
  return this.find({ instructor: instructorId })
    .select('username name email profileImage bio level xp')
    .sort({ username: 1 });
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

// Method to update battle statistics
userSchema.methods.updateBattleStats = async function(battleResult) {
  const { won } = battleResult;
  
  // Increment battles participated
  this.battlesParticipated += 1;
  
  // Base XP for participation
  let xpGained = 20;
  
  if (won) {
    // Win bonus
    this.battleWins += 1;
    xpGained += 30; // Additional XP for winning
  } else {
    // Loss
    this.battleLosses += 1;
  }
  
  // Add battle XP
  this.battleXP += xpGained;
  
  // Recalculate battle level (1 level per 100 XP)
  this.battleLevel = Math.floor(this.battleXP / 100) + 1;
  
  // Save the user
  await this.save();
  
  return {
    xpGained,
    newBattleXP: this.battleXP,
    newBattleLevel: this.battleLevel,
    battlesParticipated: this.battlesParticipated,
    battleWins: this.battleWins,
    battleLosses: this.battleLosses
  };
};

// Static method to update battle stats for a user by ID
userSchema.statics.updateUserBattleStats = async function(userId, battleResult) {
  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  return await user.updateBattleStats(battleResult);
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
    const removedBadges = [];
    
    for (const badge of allBadges) {
      let shouldAssign = false;
      
      // Check if badge has requirements field with moves array (new structure)
      if (badge.requirements && badge.requirements.moves && Array.isArray(badge.requirements.moves)) {
        const requiredMoveIds = badge.requirements.moves;
        const requiredMoves = [];
        
        // Get the move names for the required move IDs
        for (const moveId of requiredMoveIds) {
          const move = await Move.findById(moveId);
          if (move) {
            requiredMoves.push(move.name);
          }
        }
        
        // Check if all required moves are mastered
        const masteredInCategory = masteredMoveNames.filter(moveName => 
          requiredMoves.includes(moveName)
        );
        shouldAssign = masteredInCategory.length === requiredMoves.length && requiredMoves.length > 0;
      } else {
        // Legacy fallback for badges without requirements field
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
      }
      
      // Check if user currently has this badge
      const hasBadge = this.badges.includes(badge._id);
      
      if (shouldAssign && !hasBadge) {
        // Add badge if earned and not already owned
        this.badges.push(badge._id);
        newBadges.push(badge);
      } else if (!shouldAssign && hasBadge) {
        // Remove badge if no longer earned but currently owned
        this.badges = this.badges.filter(id => id.toString() !== badge._id.toString());
        removedBadges.push(badge);
      }
    }
    
    return { newBadges, removedBadges };
  } catch (error) {
    console.error('Error checking badges:', error);
    return { newBadges: [], removedBadges: [] };
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