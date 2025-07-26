import Move from '../models/move.models.js';

// Get all moves with filtering and pagination
export const getAllMoves = async (req, res) => {
  try {
    const { 
      category, 
      level, 
      search, 
      page = 1, 
      limit = 50,
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
    const move = await Move.create(req.body);
    res.status(201).json(move);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update move
export const updateMove = async (req, res) => {
  try {
    const move = await Move.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const move = await Move.findByIdAndDelete(req.params.id);
    
    if (!move) {
      return res.status(404).json({ message: 'Move not found' });
    }
    
    res.json({ message: 'Move deleted successfully' });
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
