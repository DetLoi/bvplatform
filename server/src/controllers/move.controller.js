import Move from '../models/move.models.js';
import User from '../models/user.models.js';
import Badge from '../models/badge.models.js';
import BulkSubmission from '../models/bulkSubmission.models.js';

// Get all moves with filtering and pagination
export const getAllMoves = async (req, res) => {
  try {
    const { 
      category, 
      level, 
      search, 
      page = 1, 
      limit = 1000, // Increased default limit to get all moves
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (level) {
      // Support both single level and array of levels
      if (Array.isArray(level)) {
        filter.level = { $in: level };
      } else {
        filter.level = level;
      }
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const moves = await Move.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('recommendations', 'name category level');

    const total = await Move.countDocuments(filter);

    res.json({
      moves,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get move by ID
export const getMoveById = async (req, res) => {
  try {
    const move = await Move.findById(req.params.id)
      .populate('recommendations', 'name category level xp');
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    res.json(move);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new move
export const createMove = async (req, res) => {
  try {
    let moveData = { ...req.body };
    
    // Handle recommendations field - convert move names to ObjectIds
    if (req.body.recommendations && Array.isArray(req.body.recommendations)) {
      const recommendationIds = [];
      
      for (const rec of req.body.recommendations) {
        if (typeof rec === 'string') {
          // If it's a string (move name), find the move and get its ObjectId
          const moveDoc = await Move.findOne({ name: rec.trim() });
          if (moveDoc) {
            recommendationIds.push(moveDoc._id);
          }
        } else if (rec && typeof rec === 'object' && rec._id) {
          // If it's already an ObjectId, use it
          recommendationIds.push(rec._id);
        }
      }
      
      moveData.recommendations = recommendationIds;
    }
    
    const move = await Move.create(moveData);
    res.status(201).json(move);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update move
export const updateMove = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle recommendations field - convert move names to ObjectIds
    if (req.body.recommendations && Array.isArray(req.body.recommendations)) {
      const recommendationIds = [];
      
      for (const rec of req.body.recommendations) {
        if (typeof rec === 'string') {
          // If it's a string (move name), find the move and get its ObjectId
          const moveDoc = await Move.findOne({ name: rec.trim() });
          if (moveDoc) {
            recommendationIds.push(moveDoc._id);
          }
        } else if (rec && typeof rec === 'object' && rec._id) {
          // If it's already an ObjectId, use it
          recommendationIds.push(rec._id);
        }
      }
      
      updateData.recommendations = recommendationIds;
    }
    
    const move = await Move.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    res.json(move);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete move
export const deleteMove = async (req, res) => {
  try {
    const moveId = req.params.id;

    // Find the move first to ensure it exists and to access its data if needed
    const existingMove = await Move.findById(moveId);
    if (!existingMove) {
      return res.status(404).json({ message: 'Move not found' });
    }

    // 1) Remove this move from other moves' recommendations
    const recommendationsUpdate = await Move.updateMany(
      { recommendations: moveId },
      { $pull: { recommendations: moveId } }
    );

    // 2) Remove this move from all badge requirements
    const affectedBadges = await Badge.find({ 'requirements.moves': moveId });
    let badgesUpdated = 0;
    for (const badge of affectedBadges) {
      const originalLength = (badge.requirements?.moves || []).length;
      badge.requirements.moves = badge.requirements.moves.filter(id => id.toString() !== moveId.toString());
      // Keep badge active and just reduce the set of required moves
      // If no required moves remain, the badge will not auto-assign with current logic
      await badge.save();
      if (badge.requirements.moves.length !== originalLength) badgesUpdated += 1;
    }

    // 3) Update all users: remove from mastered/pending, recalc badges
    const users = await User.find();
    let usersTouched = 0;
    let totalNewBadges = 0;
    let totalRemovedBadges = 0;
    for (const user of users) {
      const hadMastered = user.masteredMoves.some(id => id.toString() === moveId.toString());
      const hadPending = user.pendingMoves.some(id => id.toString() === moveId.toString());

      // Pull from arrays if present
      if (hadMastered) {
        user.masteredMoves = user.masteredMoves.filter(id => id.toString() !== moveId.toString());
      }
      if (hadPending) {
        user.pendingMoves = user.pendingMoves.filter(id => id.toString() !== moveId.toString());
      }

      // Recalculate badges for all users because badge requirements may have changed
      const badgeResult = await user.checkAndAssignBadges();
      const hasChanges = hadMastered || hadPending || (badgeResult.newBadges.length > 0) || (badgeResult.removedBadges.length > 0);
      if (hasChanges) {
        await user.save();
        usersTouched += 1;
        totalNewBadges += badgeResult.newBadges.length;
        totalRemovedBadges += badgeResult.removedBadges.length;
      }
    }

    // 3b) Remove the move from any pending bulk submissions
    const bulkUpdate = await BulkSubmission.updateMany(
      { 'moves.moveId': moveId },
      { $pull: { moves: { moveId } } }
    );

    // 4) Finally, delete the move itself
    await Move.findByIdAndDelete(moveId);

    res.json({ 
      message: 'Move deleted successfully',
      cleanup: {
        recommendationsUpdated: recommendationsUpdate.modifiedCount || 0,
        badgesUpdated,
        usersUpdated: usersTouched,
        bulkSubmissionsUpdated: bulkUpdate.modifiedCount || 0,
        badgeAssignments: {
          newBadgesAssigned: totalNewBadges,
          badgesRemoved: totalRemovedBadges
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get moves by category
export const getMovesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const moves = await Move.find({ 
      category, 
      isActive: true 
    }).sort('name');
    
    res.json(moves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get moves by level
export const getMovesByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const moves = await Move.find({ 
      level, 
      isActive: true 
    }).sort('name');
    
    res.json(moves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
