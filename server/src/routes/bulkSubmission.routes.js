import { Router } from 'express';
import {
  createBulkSubmission,
  getAllBulkSubmissions,
  getBulkSubmissionsByUser,
  approveBulkSubmission,
  rejectBulkSubmission,
  deleteBulkSubmission
} from '../controllers/bulkSubmission.controller.js';

const router = Router();

// Create bulk submission
router.post('/', createBulkSubmission);

// Get all bulk submissions (admin)
router.get('/', getAllBulkSubmissions);

// Get bulk submissions by user
router.get('/user/:userId', getBulkSubmissionsByUser);

// Approve bulk submission
router.put('/:submissionId/approve', approveBulkSubmission);

// Reject bulk submission
router.put('/:submissionId/reject', rejectBulkSubmission);

// Delete bulk submission
router.delete('/:submissionId', deleteBulkSubmission);

export default router; 