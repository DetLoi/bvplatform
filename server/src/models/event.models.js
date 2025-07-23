import { Schema, model } from 'mongoose';

const eventSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      enum: ['Workshop', 'Competition', 'Jam', 'Battle', 'Showcase'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    date: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date 
    },
    location: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String 
    },
    website: { 
      type: String 
    },
    organizer: { 
      type: String, 
      required: true 
    },
    participants: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    maxParticipants: { 
      type: Number 
    },
    price: { 
      type: Number, 
      default: 0 
    },
    currency: { 
      type: String, 
      default: 'USD' 
    },
    tags: [{ 
      type: String 
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Index for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ location: 1 });

export default model('Event', eventSchema); 