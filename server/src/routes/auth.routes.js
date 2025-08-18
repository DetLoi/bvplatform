import { Router } from 'express';
import { register, verify } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/verify', verify);

export default router;


