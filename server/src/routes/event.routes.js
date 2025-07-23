import { Router } from 'express';
import { 
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';

const router = Router();

// Get all events
router.get('/', getAllEvents);

// Get event by ID
router.get('/:id', getEventById);

// Create event
router.post('/', createEvent);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

export default router; 