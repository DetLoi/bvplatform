import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    type: {
      type: String,
      enum: [
        'callout',
        'battle_accepted',
        'battle_declined',
        'battle_cancelled',
        'video_uploaded',
        'battle_judged',
        'battle_ready_for_judging',
        // New user-related notification types
        'level_up',
        'move_approved',
        'move_rejected',
        'badge_earned',
        // Also support resolved to fix existing usage
        'battle_resolved'
      ],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    battle: {
      type: Schema.Types.ObjectId,
      ref: 'Battle'
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    },
    link: {
      type: String,
      default: '/battles'
    }
  },
  { timestamps: true }
);

// Index for better query performance
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export default model('Notification', notificationSchema); 