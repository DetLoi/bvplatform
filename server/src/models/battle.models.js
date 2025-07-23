import { Schema, model } from 'mongoose';

const battleSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String 
    },
    category: { 
      type: String, 
      enum: ['1v1', '2v2', '3v3', 'Crew Battle', 'All Style'],
      default: '1v1'
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'in_progress', 'judged', 'completed', 'declined'],
      default: 'pending'
    },
    challenger: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    opponent: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    videos: {
      challenger: { 
        type: String 
      },
      opponent: { 
        type: String 
      }
    },
    votes: [{
      voter: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
      },
      vote: { 
        type: String, 
        enum: ['challenger', 'opponent', 'tie'] 
      },
      timestamp: { 
        type: Date, 
        default: Date.now 
      }
    }],
    winner: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    stakes: { 
      type: String 
    },
    deadline: { 
      type: Date 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Index for better query performance
battleSchema.index({ status: 1, challenger: 1, opponent: 1 });
battleSchema.index({ category: 1 });

export default model('Battle', battleSchema); 