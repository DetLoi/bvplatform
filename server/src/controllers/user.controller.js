import User from '../models/user.models.js';
import Move from '../models/move.models.js';
import Badge from '../models/badge.models.js';
import Battle from '../models/battle.models.js';
import BulkSubmission from '../models/bulkSubmission.models.js';
import Event from '../models/event.models.js';
import Notification from '../models/notification.models.js';
import { createBattleNotification } from './notification.controller.js';
import bcrypt from 'bcryptjs';

// Get all users with filtering and pagination
export const getAllUsers = async (req, res) => {
  try {
    const { 
      search, 
      status, 
      level,
      page = 1, 
      limit = 20,
      sortBy = 'username',
      sortOrder = 'asc'
    } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (level) filter.level = { $gte: parseInt(level) };

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji');

    // Ensure battle statistics fields are included in the response
    const usersWithBattleStats = users.map(user => {
      const userObj = user.toObject();
      userObj.battleXP = user.battleXP || 0;
      userObj.battleLevel = user.battleLevel || 1;
      userObj.battleWins = user.battleWins || 0;
      userObj.battleLosses = user.battleLosses || 0;
      userObj.battlesParticipated = user.battlesParticipated || 0;
      return userObj;
    });

    const total = await User.countDocuments(filter);

    res.json({
      users: usersWithBattleStats,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users with password info for admin
export const getAllUsersWithPasswords = async (req, res) => {
  try {
    const { 
      search, 
      status, 
      level,
      page = 1, 
      limit = 20,
      sortBy = 'username',
      sortOrder = 'asc'
    } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (level) filter.level = { $gte: parseInt(level) };

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji')
      .populate('instructor', 'username name email');

    // Ensure battle statistics fields are included in the response
    const usersWithBattleStats = users.map(user => {
      const userObj = user.toObject();
      userObj.battleXP = user.battleXP || 0;
      userObj.battleLevel = user.battleLevel || 1;
      userObj.battleWins = user.battleWins || 0;
      userObj.battleLosses = user.battleLosses || 0;
      userObj.battlesParticipated = user.battlesParticipated || 0;
      
      // Add student count for instructors
      if (user.hasRole('instructor')) {
        userObj.students = []; // Will be populated if needed
      }
      
      return userObj;
    });

    const total = await User.countDocuments(filter);

    res.json({
      users: usersWithBattleStats,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure battle statistics fields are included in the response
    const userResponse = user.toObject();
    userResponse.battleXP = user.battleXP || 0;
    userResponse.battleLevel = user.battleLevel || 1;
    userResponse.battleWins = user.battleWins || 0;
    userResponse.battleLosses = user.battleLosses || 0;
    userResponse.battlesParticipated = user.battlesParticipated || 0;
    
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await User.findOne({ username })
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Compare password using the model's method
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Prevent login for explicitly unverified accounts (legacy users without the flag won't be blocked)
    if (user.isVerified === false) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    // Ensure battle statistics fields are included in the response
    userResponse.battleXP = user.battleXP || 0;
    userResponse.battleLevel = user.battleLevel || 1;
    userResponse.battleWins = user.battleWins || 0;
    userResponse.battleLosses = user.battleLosses || 0;
    userResponse.battlesParticipated = user.battlesParticipated || 0;
    
    res.json({
      success: true,
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Protect battle statistics fields - these should only be updated by the system
    const protectedFields = ['battleXP', 'battleLevel', 'battleWins', 'battleLosses', 'battlesParticipated'];
    protectedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
        console.warn(`Attempted to update protected field: ${field} for user ${id}`);
      }
    });
    
    const oldLevel = user.level;
    // If mastered moves are being updated, recalculate level and XP
    if (updateData.masteredMoves && Array.isArray(updateData.masteredMoves)) {
      // Get the moves to calculate total XP
      const moves = await Move.find({ _id: { $in: updateData.masteredMoves } });
      const totalXP = moves.reduce((sum, move) => sum + move.xp, 0);
      
      // Update XP based on mastered moves
      updateData.xp = totalXP;
    }
    
    // Handle password update specifically to ensure hashing
    if (updateData.password && updateData.password.trim() !== '') {
      // Set password directly to trigger the pre-save hook
      user.password = updateData.password;
      delete updateData.password; // Remove from updateData to avoid double assignment
    }
    
    // Update other fields
    Object.assign(user, updateData);
    
    // Save the user - this will trigger the pre-save hooks for password hashing
    await user.save();
    // Level-up notification if level changed upwards
    if (typeof oldLevel === 'number' && user.level > oldLevel) {
      try {
        await createBattleNotification(user._id, null, 'level_up', null, `You reached level ${user.level}!`);
      } catch (e) {
        console.error('Error creating level up notification:', e);
      }
    }
    
    // Check for new badges
    const newBadges = await user.checkAndAssignBadges();
    // Notify for badges earned via general user update
    if (newBadges && newBadges.length > 0) {
      try {
        for (const b of newBadges) {
          await createBattleNotification(user._id, null, 'badge_earned', null, `You earned the ${b.name} badge!`);
        }
      } catch (e) {
        console.error('Error creating badge earned notification(s) in updateUser:', e);
      }
    }
    
    // Get updated user data with populated fields
    const updatedUser = await User.findById(id)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    res.json({
      ...updatedUser.toObject(),
      newBadges: newBadges.length > 0 ? newBadges : null
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find the user first to ensure it exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Clean up Battle references
    const battleUpdates = await Battle.updateMany(
      {
        $or: [
          { challenger: userId },
          { opponent: userId },
          { winner: userId },
          { judges: userId }
        ]
      },
      {
        $unset: {
          challenger: "",
          opponent: "",
          winner: "",
          judges: ""
        }
      }
    );

    // 2. Clean up BulkSubmission references
    const bulkSubmissionUpdates = await BulkSubmission.updateMany(
      {
        $or: [
          { user: userId },
          { instructor: userId }
        ]
      },
      {
        $unset: {
          user: "",
          instructor: ""
        }
      }
    );

    // 3. Clean up Event references
    const eventUpdates = await Event.updateMany(
      { organizer: userId },
      { $unset: { organizer: "" } }
    );

    // 4. Clean up User instructor references
    const userUpdates = await User.updateMany(
      { instructor: userId },
      { $unset: { instructor: "" } }
    );

    // 5. Clean up Notification references
    const notificationUpdates = await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { sender: userId }
        ]
      },
      {
        $unset: {
          recipient: "",
          sender: ""
        }
      }
    );

    // 6. Finally, delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      message: 'User deleted successfully',
      cleanup: {
        battlesUpdated: battleUpdates.modifiedCount || 0,
        bulkSubmissionsUpdated: bulkSubmissionUpdates.modifiedCount || 0,
        eventsUpdated: eventUpdates.modifiedCount || 0,
        usersUpdated: userUpdates.modifiedCount || 0,
        notificationsUpdated: notificationUpdates.modifiedCount || 0
      }
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: err.message });
  }
};

// Mark intro guide as seen
export const markIntroGuideAsSeen = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.hasSeenIntroGuide = true;
    user.isFirstTimeUser = false;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Intro guide marked as seen and user marked as not first time',
      hasSeenIntroGuide: true,
      isFirstTimeUser: false
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add mastered move to user
export const addMasteredMove = async (req, res) => {
  try {
    const { userId, moveId } = req.params;
    
    const user = await User.findById(userId);
    const move = await Move.findById(moveId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    // Check if move is already mastered
    if (user.masteredMoves.includes(moveId)) {
      return res.status(400).json({ message: 'Move already mastered' });
    }
    
    // Track level before changes
    const oldLevel = user.level;
    // Add move to mastered moves and add XP
    user.masteredMoves.push(moveId);
    user.xp += move.xp;
    user.level = user.calculateLevel(); // Auto-calculate level based on moves
    
    // Remove from pending moves if it exists
    user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId);
    
    // Check and assign new badges
    const badgeResult = await user.checkAndAssignBadges();
    
    await user.save();
    // Notifications: level up and newly earned badges
    try {
      if (typeof oldLevel === 'number' && user.level > oldLevel) {
        await createBattleNotification(user._id, null, 'level_up', null, `You reached level ${user.level}!`);
      }
      if (badgeResult.newBadges && badgeResult.newBadges.length > 0) {
        for (const b of badgeResult.newBadges) {
          await createBattleNotification(user._id, null, 'badge_earned', null, `You earned the ${b.name} badge!`);
        }
      }
    } catch (e) {
      console.error('Error creating notifications for addMasteredMove:', e);
    }
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    res.json({ 
      message: 'Move added to mastered moves',
      user: updatedUser,
      newBadges: badgeResult.newBadges.length > 0 ? badgeResult.newBadges : null,
      removedBadges: badgeResult.removedBadges.length > 0 ? badgeResult.removedBadges : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove mastered move from user
export const removeMasteredMove = async (req, res) => {
  try {
    const { userId, moveId } = req.params;
    
    const user = await User.findById(userId);
    const move = await Move.findById(moveId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    // Check if move is mastered
    if (!user.masteredMoves.includes(moveId)) {
      return res.status(400).json({ message: 'Move not mastered' });
    }
    
    // Remove move from mastered moves and subtract XP
    user.masteredMoves = user.masteredMoves.filter(id => id.toString() !== moveId);
    user.xp = Math.max(0, user.xp - move.xp);
    user.level = user.calculateLevel(); // Auto-calculate level based on moves
    
    // Check and assign new badges (in case some badges should be removed)
    const badgeResult = await user.checkAndAssignBadges();
    
    await user.save();
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    res.json({ 
      message: 'Move removed from mastered moves',
      user: updatedUser,
      newBadges: badgeResult.newBadges.length > 0 ? badgeResult.newBadges : null,
      removedBadges: badgeResult.removedBadges.length > 0 ? badgeResult.removedBadges : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add pending move request
export const addPendingMove = async (req, res) => {
  try {
    const { userId, moveId } = req.params;
    
    const user = await User.findById(userId);
    const move = await Move.findById(moveId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    // Check if move is already pending or mastered
    if (user.pendingMoves.includes(moveId)) {
      return res.status(400).json({ message: 'Move request already pending' });
    }
    
    if (user.masteredMoves.includes(moveId)) {
      return res.status(400).json({ message: 'Move already mastered' });
    }
    
    // Add move to pending moves
    user.pendingMoves.push(moveId);
    await user.save();
    
    res.json({ 
      message: 'Move request added',
      user: await User.findById(userId)
        .select('-password')
        .populate('masteredMoves', 'name category level xp')
        .populate('pendingMoves', 'name category level xp')
        .populate('badges', 'name image emoji category level')
        .populate('instructor', 'username name email')
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve pending move request
export const approvePendingMove = async (req, res) => {
  try {
    const { userId, moveId } = req.params;
    
    const user = await User.findById(userId);
    const move = await Move.findById(moveId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    // Check if move is pending
    if (!user.pendingMoves.includes(moveId)) {
      return res.status(400).json({ message: 'Move not pending' });
    }
    
    // Track level before changes
    const oldLevel = user.level;
    // Move from pending to mastered
    user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId);
    user.masteredMoves.push(moveId);
    user.xp += move.xp;
    user.level = user.calculateLevel(); // Auto-calculate level based on moves
    
    // Check and assign new badges
    const badgeResult = await user.checkAndAssignBadges();
    
    await user.save();
    // Notifications: move approved, level up and badges
    try {
      await createBattleNotification(user._id, null, 'move_approved', null, `Your move "${move.name}" was approved!`);
      if (typeof oldLevel === 'number' && user.level > oldLevel) {
        await createBattleNotification(user._id, null, 'level_up', null, `You reached level ${user.level}!`);
      }
      if (badgeResult.newBadges && badgeResult.newBadges.length > 0) {
        for (const b of badgeResult.newBadges) {
          await createBattleNotification(user._id, null, 'badge_earned', null, `You earned the ${b.name} badge!`);
        }
      }
    } catch (e) {
      console.error('Error creating notifications for approvePendingMove:', e);
    }
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    res.json({ 
      message: 'Move request approved',
      user: updatedUser,
      newBadges: badgeResult.newBadges.length > 0 ? badgeResult.newBadges : null,
      removedBadges: badgeResult.removedBadges.length > 0 ? badgeResult.removedBadges : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject pending move request
export const rejectPendingMove = async (req, res) => {
  try {
    const { userId, moveId } = req.params;
    
    const user = await User.findById(userId);
    const move = await Move.findById(moveId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove move from pending moves
    user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId);
    await user.save();
    // Notification: move rejected
    try {
      const moveName = move?.name || 'Your move';
      await createBattleNotification(user._id, null, 'move_rejected', null, `${moveName} application was rejected.`);
    } catch (e) {
      console.error('Error creating notification for rejectPendingMove:', e);
    }
    
    res.json({ 
      message: 'Move request rejected',
      user: await User.findById(userId)
        .select('-password')
        .populate('masteredMoves', 'name category level xp')
        .populate('pendingMoves', 'name category level xp')
        .populate('badges', 'name image emoji category level')
        .populate('instructor', 'username name email')
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('masteredMoves', 'category level xp')
      .populate('badges', 'category level');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate statistics
    const stats = {
      totalMoves: user.masteredMoves.length,
      totalXP: user.xp,
      level: user.level,
      progress: user.getProgress(),
      nextLevelXP: user.getNextLevelXP(),
      movesByCategory: {},
      movesByLevel: {},
      totalBadges: user.badges.length
    };
    
    // Count moves by category
    user.masteredMoves.forEach(move => {
      stats.movesByCategory[move.category] = (stats.movesByCategory[move.category] || 0) + 1;
      stats.movesByLevel[move.level] = (stats.movesByLevel[move.level] || 0) + 1;
    });
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Recalculate all users' levels based on their moves
export const recalculateAllUserLevels = async (req, res) => {
  try {
    const users = await User.find().populate('masteredMoves');
    let updatedCount = 0;
    
    for (const user of users) {
      const oldLevel = user.level;
      user.level = user.calculateLevel();
      
      if (oldLevel !== user.level) {
        await user.save();
        updatedCount++;
      }
    }
    
    res.json({ 
      message: `Updated levels for ${updatedCount} users`,
      updatedCount,
      totalUsers: users.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recalculate all users' badges based on their moves
export const recalculateAllUserBadges = async (req, res) => {
  try {
    const users = await User.find().populate('masteredMoves');
    let updatedCount = 0;
    let totalNewBadges = 0;
    
    for (const user of users) {
      const oldBadgeCount = user.badges.length;
      const newBadges = await user.checkAndAssignBadges();
      
      if (newBadges.length > 0) {
        await user.save();
        updatedCount++;
        totalNewBadges += newBadges.length;
      }
    }
    
    res.json({ 
      message: `Updated badges for ${updatedCount} users`,
      updatedCount,
      totalNewBadges,
      totalUsers: users.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Get all pending move requests (for admin)
export const getAllPendingMoveRequests = async (req, res) => {
  try {
    const users = await User.find({ 'pendingMoves.0': { $exists: true } })
      .select('username name level pendingMoves')
      .populate('pendingMoves', 'name category level xp videoUrl description');
    
    const pendingRequests = [];
    
    users.forEach(user => {
      user.pendingMoves.forEach(move => {
        pendingRequests.push({
          id: `${user._id}-${move._id}`,
          userId: user._id,
          userName: user.name || user.username,
          userLevel: user.level,
          moveId: move._id,
          moveName: move.name,
          moveCategory: move.category,
          moveLevel: move.level,
          moveXP: move.xp,
          videoUrl: move.videoUrl,
          description: move.description,
          requestDate: user.updatedAt,
          status: 'pending'
        });
      });
    });
    
    res.json(pendingRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Get all instructors
export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.getInstructors();
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get students by instructor
export const getStudentsByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    // Verify the instructor exists and has instructor role
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    if (!instructor.hasRole('instructor')) {
      return res.status(400).json({ message: 'User is not an instructor' });
    }
    
    const students = await User.getStudentsByInstructor(instructorId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign instructor to student
export const assignInstructor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { instructorId } = req.body;
    
    // Verify the student exists
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Verify the student has student role
    if (!student.hasRole('student')) {
      return res.status(400).json({ message: 'Only students can have an instructor assigned' });
    }
    
    // If instructorId is provided, verify the instructor exists and has instructor role
    if (instructorId) {
      const instructor = await User.findById(instructorId);
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
      
      if (!instructor.hasRole('instructor')) {
        return res.status(400).json({ message: 'User is not an instructor' });
      }
      
      student.instructor = instructorId;
    } else {
      // Remove instructor assignment
      student.instructor = undefined;
    }
    
    await student.save();
    
    // Populate all necessary fields for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    res.json({ 
      message: instructorId ? 'Instructor assigned successfully' : 'Instructor removed successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove instructor from student
export const removeInstructor = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (!student.hasRole('student')) {
      return res.status(400).json({ message: 'Only students can have an instructor assigned' });
    }
    
    student.instructor = undefined;
    await student.save();
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level')
      .populate('instructor', 'username name email');
    
    res.json({ 
      message: 'Instructor removed successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 