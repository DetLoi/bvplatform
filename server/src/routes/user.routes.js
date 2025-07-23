import { Router } from 'express';
import { 
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addMasteredMove,
  removeMasteredMove,
  addPendingMove,
  approvePendingMove,
  rejectPendingMove,
  getUserStats
} from '../controllers/user.controller.js';

const router = Router();

// Get all users with filtering
router.get('/', getAllUsers);

// Get user statistics
router.get('/:userId/stats', getUserStats);

// Get single user
router.get('/:id', getUserById);

// Create user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Move management
router.post('/:userId/moves/:moveId/master', addMasteredMove);
router.delete('/:userId/moves/:moveId/master', removeMasteredMove);
router.post('/:userId/moves/:moveId/pending', addPendingMove);
router.put('/:userId/moves/:moveId/approve', approvePendingMove);
router.put('/:userId/moves/:moveId/reject', rejectPendingMove);

export default router; 