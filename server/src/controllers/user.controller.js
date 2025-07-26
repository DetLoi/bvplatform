import User from '../models/user.models.js';
import Move from '../models/move.models.js';
import Badge from '../models/badge.models.js';
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
      .populate('crew', 'name')
      .populate('badges', 'name image emoji');

    const total = await User.countDocuments(filter);

    res.json({
      users,
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
      .populate('crew', 'name')
      .populate('badges', 'name image emoji');

    const total = await User.countDocuments(filter);

    res.json({
      users,
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
      .populate('crew', 'name logo color')
      .populate('badges', 'name image emoji category level');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Brugernavn og adgangskode er påkrævet' });
    }
    
    const user = await User.findOne({ username })
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('crew', 'name logo color')
      .populate('badges', 'name image emoji category level');
    
    if (!user) {
      return res.status(401).json({ message: 'Ugyldigt brugernavn eller adgangskode' });
    }
    
    // Compare password using the model's method
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Ugyldigt brugernavn eller adgangskode' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
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
    
    // Check for new badges
    const newBadges = await user.checkAndAssignBadges();
    
    // Get updated user data with populated fields
    const updatedUser = await User.findById(id)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('crew', 'name logo color')
      .populate('badges', 'name image emoji category level');
    
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
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
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
    
    // Add move to mastered moves and add XP
    user.masteredMoves.push(moveId);
    user.xp += move.xp;
    user.level = user.calculateLevel(); // Auto-calculate level based on moves
    
    // Remove from pending moves if it exists
    user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId);
    
    // Check and assign new badges
    const newBadges = await user.checkAndAssignBadges();
    
    await user.save();
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('crew', 'name logo color')
      .populate('badges', 'name image emoji category level');
    
    res.json({ 
      message: 'Move added to mastered moves',
      user: updatedUser,
      newBadges: newBadges.length > 0 ? newBadges : null
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
    const newBadges = await user.checkAndAssignBadges();
    
    await user.save();
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('crew', 'name logo color')
      .populate('badges', 'name image emoji category level');
    
    res.json({ 
      message: 'Move removed from mastered moves',
      user: updatedUser,
      newBadges: newBadges.length > 0 ? newBadges : null
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
      user: await User.findById(userId).select('-password')
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
    
    // Move from pending to mastered
    user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId);
    user.masteredMoves.push(moveId);
    user.xp += move.xp;
    user.level = user.calculateLevel(); // Auto-calculate level based on moves
    
    // Check and assign new badges
    const newBadges = await user.checkAndAssignBadges();
    
    await user.save();
    
    // Populate the user data for response
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('crew', 'name logo color')
      .populate('badges', 'name image emoji category level');
    
    res.json({ 
      message: 'Move request approved',
      user: updatedUser,
      newBadges: newBadges.length > 0 ? newBadges : null
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
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove move from pending moves
    user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId);
    await user.save();
    
    res.json({ 
      message: 'Move request rejected',
      user: await User.findById(userId).select('-password')
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