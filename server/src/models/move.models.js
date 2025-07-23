import { Schema, model } from 'mongoose';

const moveSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },
    category: { 
      type: String, 
      enum: ['Toprock','Footwork','Freezes','Power','Tricks','GoDowns'], 
      required: true 
    },
    level: { 
      type: String, 
      enum: ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'],
      required: true 
    },
    xp: { 
      type: Number, 
      required: true,
      min: 0
    },
    videoUrl: { 
      type: String,
      required: true
    },
    description: { 
      type: String 
    },
    recommendations: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Move' 
    }],
    difficulty: { 
      type: Number, 
      min: 1, 
      max: 10, 
      default: 1 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Index for better query performance
moveSchema.index({ category: 1, level: 1 });
moveSchema.index({ name: 1 });

export default model('Move', moveSchema);
