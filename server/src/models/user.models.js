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
      required: true,
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

// Auto-calculate level before saving
userSchema.pre('save', function(next) {
  // Only auto-calculate level if XP or masteredMoves have changed
  if (this.isModified('xp') || this.isModified('masteredMoves')) {
    this.level = this.calculateLevel();
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level from XP and moves mastered
userSchema.methods.calculateLevel = function() {
  // Base calculation on XP
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  let level = 1;
  
  for (let i = 0; i < xpThresholds.length; i++) {
    if (this.xp >= xpThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  // Bonus levels based on number of moves mastered
  const totalMoves = this.masteredMoves ? this.masteredMoves.length : 0;
  const moveBonus = Math.floor(totalMoves / 5); // 1 bonus level for every 5 moves
  
  return Math.min(level + moveBonus, 50); // Cap at level 50
};

// Method to get next level XP
userSchema.methods.getNextLevelXP = function() {
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  const currentLevel = this.calculateLevel();
  
  // Calculate the base XP level (without move bonus)
  let baseLevel = 1;
  for (let i = 0; i < xpThresholds.length; i++) {
    if (this.xp >= xpThresholds[i]) {
      baseLevel = i + 1;
    } else {
      break;
    }
  }
  
  // If we're at max XP level, return current XP
  if (baseLevel >= 10) return this.xp;
  
  // Return the XP needed for the next base level
  return xpThresholds[baseLevel];
};

// Method to get progress to next level
userSchema.methods.getProgress = function() {
  const currentLevel = this.calculateLevel();
  const nextLevelXP = this.getNextLevelXP();
  const currentLevelXP = currentLevel > 1 ? [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000][currentLevel - 2] : 0;
  
  if (nextLevelXP === this.xp) return 100;
  
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = this.xp - currentLevelXP;
  
  return Math.round((xpProgress / totalXPNeeded) * 100);
};

export default model('User', userSchema); 