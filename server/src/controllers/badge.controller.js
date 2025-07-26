import Badge from '../models/badge.models.js';

// Get all badges
export const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ level: 1, name: 1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get badge by ID
export const getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    
    res.json(badge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create badge
export const createBadge = async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update badge
export const updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    
    res.json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete badge
export const deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndDelete(req.params.id);
    
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    
    res.json({ message: 'Badge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 