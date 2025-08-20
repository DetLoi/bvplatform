import Badge from '../models/badge.models.js';
import Move from '../models/move.models.js';
import User from '../models/user.models.js';

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
    
    // Handle requirements field - convert move names to ObjectIds and handle manual users
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

    // Handle manual users assignment
    if (req.body.manualUsers) {
      let manualUsers;
      try {
        manualUsers = JSON.parse(req.body.manualUsers);
      } catch (e) {
        manualUsers = req.body.manualUsers;
      }
      
      if (Array.isArray(manualUsers)) {
        const userIds = [];
        
        for (const username of manualUsers) {
          if (typeof username === 'string') {
            // Find user by username or email
            const userDoc = await User.findOne({
              $or: [
                { username: username.trim() },
                { email: username.trim() }
              ]
            });
            if (userDoc) {
              userIds.push(userDoc._id);
            }
          } else if (username && typeof username === 'object' && username._id) {
            // If it's already an ObjectId, use it
            userIds.push(username._id);
          }
        }
        
        badgeData.requirements = {
          ...badgeData.requirements,
          manualUsers: userIds
        };
      }
    }

    // Handle badge type and user limit
    if (req.body.badgeType) {
      badgeData.requirements = {
        ...badgeData.requirements,
        badgeType: req.body.badgeType
      };
    }

    if (req.body.userLimit) {
      badgeData.requirements = {
        ...badgeData.requirements,
        userLimit: parseInt(req.body.userLimit)
      };
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

// Assign OG Membership badge to first 20 users
export const assignOGMembershipBadge = async (req, res) => {
  try {
    // Find or create the OG Membership badge
    let ogBadge = await Badge.findOne({ 
      'requirements.badgeType': 'og_membership',
      name: 'OG Membership'
    });

    if (!ogBadge) {
      // Create the OG Membership badge if it doesn't exist
      ogBadge = await Badge.create({
        name: 'OG Membership',
        description: 'One of the first 20 members to join Breakverse. A true OG!',
        category: 'Special',
        level: 'Legendary',
        emoji: '👑',
        rarity: 'Legendary',
        image: '/assets/badges/og-membership.png', // You'll need to add this image
        requirements: {
          badgeType: 'og_membership',
          userLimit: 20,
          moves: [],
          xpRequired: 0,
          levelRequired: 1
        }
      });
    }

    // Get the first 20 users by creation date
    const first20Users = await User.find()
      .sort({ createdAt: 1 })
      .limit(20)
      .select('_id username email');

    // Update the badge with the first 20 users
    ogBadge.requirements.manualUsers = first20Users.map(user => user._id);
    await ogBadge.save();

    // Assign the badge to these users
    for (const user of first20Users) {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { badges: ogBadge._id }
      });
    }

    res.json({
      message: 'OG Membership badge assigned successfully',
      badge: ogBadge,
      assignedUsers: first20Users.length
    });
  } catch (error) {
    console.error('Error assigning OG Membership badge:', error);
    res.status(500).json({ error: error.message });
  }
};

// Manually assign badge to specific users
export const manuallyAssignBadge = async (req, res) => {
  try {
    const { badgeId, userIds } = req.body;

    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    // Add users to the badge's manual users list
    badge.requirements.manualUsers = [
      ...new Set([...badge.requirements.manualUsers || [], ...userIds])
    ];
    await badge.save();

    // Assign the badge to the users
    for (const userId of userIds) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { badges: badge._id }
      });
    }

    res.json({
      message: 'Badge assigned successfully',
      badge: badge
    });
  } catch (error) {
    console.error('Error manually assigning badge:', error);
    res.status(500).json({ error: error.message });
  }
}; 