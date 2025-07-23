import { Router } from 'express';
import { 
  getAllCrews,
  getCrewById,
  createCrew,
  updateCrew,
  deleteCrew
} from '../controllers/crew.controller.js';

const router = Router();

// Get all crews
router.get('/', getAllCrews);

// Get crew by ID
router.get('/:id', getCrewById);

// Create crew
router.post('/', createCrew);

// Update crew
router.put('/:id', updateCrew);

// Delete crew
router.delete('/:id', deleteCrew);

export default router; 