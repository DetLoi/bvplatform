import { Router } from 'express';
import { 
  getAllUsers,
  getAllUsersWithPasswords,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addMasteredMove,
  removeMasteredMove,
  addPendingMove,
  approvePendingMove,
  rejectPendingMove,
  getUserStats,
  loginUser,
  recalculateAllUserLevels,
  recalculateAllUserBadges,
  getAllPendingMoveRequests
} from '../controllers/user.controller.js';

const router = Router();

// Login user
router.post('/login', loginUser);

// Get all users with filtering
router.get('/', getAllUsers);

// Get all users with password info for admin
router.get('/admin/with-passwords', getAllUsersWithPasswords);

// Get all pending move requests (admin only)
router.get('/pending-moves', getAllPendingMoveRequests);

// Get user by ID
router.get('/:id', getUserById);

// Get user statistics
router.get('/:userId/stats', getUserStats);

// Create user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Move management - reordered to avoid conflicts
router.post('/:userId/moves/:moveId/master', addMasteredMove);
router.delete('/:userId/moves/:moveId/master', removeMasteredMove);
router.post('/:userId/moves/:moveId/pending', addPendingMove);
router.put('/:userId/moves/:moveId/approve', approvePendingMove);
router.put('/:userId/moves/:moveId/reject', rejectPendingMove);

// Admin route to recalculate all user levels
router.post('/recalculate-levels', recalculateAllUserLevels);

// Admin route to recalculate all user badges
router.post('/recalculate-badges', recalculateAllUserBadges);

export default router; 