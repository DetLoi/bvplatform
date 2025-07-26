import { Router } from 'express';
import { uploadProfileImage, uploadCoverImage } from '../middleware/upload.js';
import { uploadProfileImageController, uploadCoverImageController } from '../controllers/upload.controller.js';

const router = Router();

// Upload profile image
router.post('/profile-image', uploadProfileImage, uploadProfileImageController);

// Upload cover image
router.post('/cover-image', uploadCoverImage, uploadCoverImageController);

export default router; 