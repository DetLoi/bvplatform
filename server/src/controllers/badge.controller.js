import Badge from '../models/badge.models.js';
import Move from '../models/move.models.js';

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
    let badgeData = { ...req.body };
    
    // Handle file upload if present
    if (req.file) {
      badgeData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // If no file uploaded but image URL provided
      badgeData.image = req.body.image;
    }
    
    // Handle requirements field - convert move names to ObjectIds
    if (req.body.requirements) {
      let requirements;
      try {
        requirements = JSON.parse(req.body.requirements);
      } catch (e) {
        requirements = req.body.requirements;
      }
      
      if (Array.isArray(requirements)) {
        const requirementIds = [];
        
        for (const moveName of requirements) {
          if (typeof moveName === 'string') {
            // If it's a string (move name), find the move and get its ObjectId
            const moveDoc = await Move.findOne({ name: moveName.trim() });
            if (moveDoc) {
              requirementIds.push(moveDoc._id);
            }
          } else if (moveName && typeof moveName === 'object' && moveName._id) {
            // If it's already an ObjectId, use it
            requirementIds.push(moveName._id);
          }
        }
        
        badgeData.requirements = {
          moves: requirementIds,
          xpRequired: 0,
          levelRequired: 1
        };
      }
    }
    
    // Set default level if not provided
    if (!badgeData.level) {
      badgeData.level = 'Beginner';
    }
    
    const badge = await Badge.create(badgeData);
    res.status(201).json(badge);
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update badge
export const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Badge.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    const updateData = { ...req.body };

    // If file uploaded, update image path
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Normalize requirements similar to createBadge
    if (req.body.requirements) {
      let requirements;
      try {
        requirements = JSON.parse(req.body.requirements);
      } catch (e) {
        requirements = req.body.requirements;
      }

      // If provided as array of move names/objects, map to ObjectIds
      if (Array.isArray(requirements)) {
        const requirementIds = [];
        for (const entry of requirements) {
          if (typeof entry === 'string') {
            const moveDoc = await Move.findOne({ name: entry.trim() });
            if (moveDoc) requirementIds.push(moveDoc._id);
          } else if (entry && typeof entry === 'object' && entry._id) {
            requirementIds.push(entry._id);
          }
        }

        updateData.requirements = {
          ...(existing.requirements || {}),
          moves: requirementIds,
          xpRequired: Number(existing.requirements?.xpRequired || 0),
          levelRequired: Number(existing.requirements?.levelRequired || 1),
        };
      }
    }

    const badge = await Badge.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

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