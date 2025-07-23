import { Schema, model } from 'mongoose';

const crewSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },
    description: { 
      type: String 
    },
    logo: { 
      type: String 
    },
    color: { 
      type: String, 
      default: '#ffd700' 
    },
    members: [{
      user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
      },
      role: { 
        type: String, 
        enum: ['Leader', 'Co-Leader', 'Member', 'Recruit'],
        default: 'Member'
      },
      joinedAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    leader: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    founded: { 
      type: Date, 
      default: Date.now 
    },
    location: { 
      type: String 
    },
    website: { 
      type: String 
    },
    socialMedia: {
      instagram: { 
        type: String 
      },
      facebook: { 
        type: String 
      },
      youtube: { 
        type: String 
      }
    },
    achievements: [{
      title: { 
        type: String 
      },
      description: { 
        type: String 
      },
      date: { 
        type: Date 
      }
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isPublic: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Index for better query performance
crewSchema.index({ name: 1 });
crewSchema.index({ leader: 1 });
crewSchema.index({ 'members.user': 1 });

export default model('Crew', crewSchema); 