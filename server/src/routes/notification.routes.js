import express from 'express';
import {
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

// Get notifications for a user
router.get('/user/:userId', getNotificationsByUser);

// Get unread count for a user
router.get('/user/:userId/unread', getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', markAllAsRead);

// Create a notification
router.post('/', createNotification);

// Delete a notification
router.delete('/:notificationId', deleteNotification);

export default router; 