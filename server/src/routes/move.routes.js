import { Router } from 'express';
import { 
  getAllMoves, 
  getMoveById, 
  createMove, 
  updateMove, 
  deleteMove,
  getMovesByCategory,
  getMovesByLevel
} from '../controllers/move.controller.js';

const router = Router();

// Get all moves with filtering
router.get('/', getAllMoves);

// Get moves by category
router.get('/category/:category', getMovesByCategory);

// Get moves by level
router.get('/level/:level', getMovesByLevel);

// Get single move
router.get('/:id', getMoveById);

// Create move
router.post('/', createMove);

// Update move
router.put('/:id', updateMove);

// Delete move
router.delete('/:id', deleteMove);

export default router;
