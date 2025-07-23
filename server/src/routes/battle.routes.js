import { Router } from 'express';
import { 
  getAllBattles,
  getBattleById,
  createBattle,
  updateBattle,
  deleteBattle
} from '../controllers/battle.controller.js';

const router = Router();

// Get all battles
router.get('/', getAllBattles);

// Get battle by ID
router.get('/:id', getBattleById);

// Create battle
router.post('/', createBattle);

// Update battle
router.put('/:id', updateBattle);

// Delete battle
router.delete('/:id', deleteBattle);

export default router;