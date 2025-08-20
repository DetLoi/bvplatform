import { Router } from 'express';
import { 
  getAllBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge,
  assignOGMembershipBadge,
  manuallyAssignBadge
} from '../controllers/badge.controller.js';
import { uploadBadgeImage } from '../middleware/upload.js';

const router = Router();

// Get all badges
router.get('/', getAllBadges);

// Get badge by ID
router.get('/:id', getBadgeById);

// Create badge
router.post('/', uploadBadgeImage, createBadge);

// Update badge
router.put('/:id', uploadBadgeImage, updateBadge);

// Delete badge
router.delete('/:id', deleteBadge);

// Assign OG Membership badge to first 20 users
router.post('/assign-og-membership', assignOGMembershipBadge);

// Manually assign badge to specific users
router.post('/assign-manual', manuallyAssignBadge);

export default router; 