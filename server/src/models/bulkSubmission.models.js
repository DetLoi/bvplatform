import mongoose from 'mongoose';

const bulkSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moves: [{
    moveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Move',
      required: true
    },
    name: String,
    category: String,
    level: String,
    xp: Number
  }],
  videoUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
bulkSubmissionSchema.index({ userId: 1, status: 1 });
bulkSubmissionSchema.index({ status: 1, submittedAt: -1 });

const BulkSubmission = mongoose.model('BulkSubmission', bulkSubmissionSchema);

export default BulkSubmission; 