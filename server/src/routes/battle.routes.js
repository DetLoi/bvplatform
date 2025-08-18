import { Router } from 'express';
import { 
  getAllBattles,
  getBattleById,
  getBattlesByUser,
  createBattle,
  updateBattle,
  deleteBattle,
  uploadVideo,
  getJudgeVote,
  submitJudgeVote,
  resolveBattle
} from '../controllers/battle.controller.js';

const router = Router();

// Get all battles
router.get('/', getAllBattles);

// Get battles by user ID
router.get('/user/:userId', getBattlesByUser);

// Get battle by ID
router.get('/:id', getBattleById);

// Create battle
router.post('/', createBattle);

// Upload video for battle
router.post('/:battleId/upload', uploadVideo);

// Judge voting routes
router.get('/:battleId/vote', getJudgeVote);
router.post('/:battleId/vote', submitJudgeVote);

// Resolve battle and update user stats
router.post('/:battleId/resolve', resolveBattle);

// Update battle
router.put('/:id', updateBattle);

// Delete battle
router.delete('/:id', deleteBattle);

export default router;