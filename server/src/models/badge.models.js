import { Schema, model } from 'mongoose';

const badgeSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true,
      trim: true
    },
    level: { 
      type: String, 
      enum: ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'],
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    emoji: { 
      type: String 
    },
    requirements: {
      moves: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Move' 
      }],
      xpRequired: { 
        type: Number, 
        default: 0 
      },
      levelRequired: { 
        type: Number, 
        default: 1 
      },
      specialRequirements: { 
        type: String 
      }
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    rarity: { 
      type: String, 
      enum: ['Common', 'Rare', 'Epic', 'Legendary'],
      default: 'Common'
    }
  },
  { timestamps: true }
);

// Index for better query performance
badgeSchema.index({ category: 1, level: 1 });
badgeSchema.index({ name: 1 });

export default model('Badge', badgeSchema); 