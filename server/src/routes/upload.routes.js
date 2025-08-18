import { Router } from 'express';
import { uploadProfileImage, uploadCoverImage, uploadVideo } from '../middleware/upload.js';
import { 
  uploadProfileImageController, 
  uploadCoverImageController, 
  uploadVideoController,
  deleteVideoController 
} from '../controllers/upload.controller.js';

const router = Router();

// Upload profile image
router.post('/profile-image', uploadProfileImage, uploadProfileImageController);

// Upload cover image
router.post('/cover-image', uploadCoverImage, uploadCoverImageController);

// Upload video for master moves
router.post('/video', uploadVideo, uploadVideoController);

// Delete video file
router.delete('/video/:filename', deleteVideoController);

export default router; 