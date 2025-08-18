import Notification from '../models/notification.models.js';
import User from '../models/user.models.js';
import Battle from '../models/battle.models.js';

// Get notifications for a user
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { read, limit = 50 } = req.query;
    
    let query = { recipient: userId };
    
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name username profileImage')
      .populate('battle', 'title status')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name username profileImage')
      .populate('battle', 'title status');
    
    res.status(201).json(populatedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create battle notification helper function
export const createBattleNotification = async (recipientId, senderId, type, battleId, customMessage = null) => {
  try {
    const sender = senderId ? await User.findById(senderId).select('name username') : null;
    const battle = await Battle.findById(battleId).select('title');
    
    let title, message;
    
    switch (type) {
      case 'callout':
        title = 'New Battle Challenge';
        message = customMessage || `${sender?.name || 'Someone'} has challenged you to a battle!`;
        break;
      case 'battle_accepted':
        title = 'Battle Accepted';
        message = customMessage || `${sender?.name || 'Your opponent'} has accepted your battle challenge!`;
        break;
      case 'battle_declined':
        title = 'Battle Declined';
        message = customMessage || `${sender?.name || 'Your opponent'} has declined your battle challenge.`;
        break;
      case 'battle_cancelled':
        title = 'Battle Cancelled';
        message = customMessage || `${sender?.name || 'Your opponent'} has cancelled their battle challenge.`;
        break;
      case 'video_uploaded':
        title = 'Video Uploaded';
        message = customMessage || `${sender?.name || 'Your opponent'} has uploaded their battle video.`;
        break;
      case 'battle_judged':
        title = 'Battle Judged';
        message = customMessage || `Your battle has been judged and concluded.`;
        break;
      case 'battle_ready_for_judging':
        title = 'Battle Ready for Judging';
        message = customMessage || `Both videos have been uploaded! Your battle is now ready for judging.`;
        break;
      case 'level_up':
        title = 'Level Up!';
        message = customMessage || `Congratulations! You reached a new level.`;
        break;
      case 'move_approved':
        title = 'Move Approved';
        message = customMessage || `Your move application was approved!`;
        break;
      case 'move_rejected':
        title = 'Move Rejected';
        message = customMessage || `Your move application was rejected.`;
        break;
      case 'badge_earned':
        title = 'Badge Earned';
        message = customMessage || `You earned a new badge!`;
        break;
      case 'battle_resolved':
        title = 'Battle Resolved';
        message = customMessage || `Your battle has been resolved.`;
        break;
      default:
        title = 'Battle Update';
        message = customMessage || 'You have a new battle update.';
    }
    
    // Determine the appropriate link based on notification type
    let link = '/battles';
    if (type === 'battle_accepted') {
      link = '/battles?tab=active';
    } else if (type === 'callout') {
      link = '/battles?tab=pending';
    } else if (type === 'video_uploaded') {
      link = '/battles?tab=completed';
    } else if (type === 'battle_judged') {
      link = '/battles?tab=judged';
    } else if (type === 'battle_ready_for_judging') {
      link = `/battles/${battleId}`;
    } else if (type === 'level_up') {
      link = `/breakers/${recipientId}`;
    } else if (type === 'move_approved' || type === 'move_rejected') {
      link = `/moves`;
    } else if (type === 'badge_earned') {
      link = `/badges`;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      battle: battleId,
      link
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating battle notification:', error);
    throw error;
  }
};

// Notify all judges when a battle is completed
export const notifyJudges = async (battle) => {
  try {
    // Find all users with judge role
    const judges = await User.find({ roles: 'judge' }).select('_id name username');
    
    if (judges.length === 0) {
      console.log('No judges found in the system');
      return;
    }
    
    // Get battle details for notification
    const populatedBattle = await Battle.findById(battle._id)
      .populate('challenger', 'name username')
      .populate('opponent', 'name username');
    
    const title = 'Battle Ready for Judging';
    const message = `Battle "${populatedBattle.title}" between ${populatedBattle.challenger.name} and ${populatedBattle.opponent.name} is ready for judging. Both videos have been uploaded.`;
    const link = `/battles/${battle._id}`;
    
    // Create notifications for all judges
    const notificationPromises = judges.map(judge => 
      Notification.create({
        recipient: judge._id,
        sender: null, // System notification
        type: 'battle_ready_for_judging',
        title,
        message,
        battle: battle._id,
        link
      })
    );
    
    await Promise.all(notificationPromises);
    
    console.log(`Notifications sent to ${judges.length} judges for battle ${battle._id}`);
  } catch (error) {
    console.error('Error notifying judges:', error);
    // Don't throw error to avoid breaking the upload process
  }
}; 