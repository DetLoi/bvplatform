import { Router } from 'express';
import { 
  getAllBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge
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
router.put('/:id', updateBadge);

// Delete badge
router.delete('/:id', deleteBadge);

export default router; 