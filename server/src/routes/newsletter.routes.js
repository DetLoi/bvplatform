import { Router } from 'express';
import { subscribe, list, remove } from '../controllers/newsletter.controller.js';

const router = Router();

// Public subscribe endpoint
router.post('/subscribe', subscribe);

// Admin endpoints (simple, no auth gate here since admin panel already protected by frontend)
router.get('/', list);
router.delete('/:id', remove);

export default router;


