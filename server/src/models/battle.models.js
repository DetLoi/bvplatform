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
      enum: ['1v1', '2v2', '3v3', 'All Style'],
      default: '1v1'
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'in progress', 'judged', 'completed', 'declined', 'cancelled'],
      default: 'pending'
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
      index: true
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
      judgeId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
      },
      category: { 
        type: String, 
        required: true,
        enum: ['Foundation', 'Originality', 'Execution', 'Dynamics', 'Battle']
      },
      scoreA: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
      },
      scoreB: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
      },
      timestamp: { 
        type: Date, 
        default: Date.now 
      }
    }],
    judgingDone: {
      type: Boolean,
      default: false
    },
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