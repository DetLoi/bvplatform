import BulkSubmission from '../models/bulkSubmission.models.js';
import User from '../models/user.models.js';
import Move from '../models/move.models.js';
import { createBattleNotification } from './notification.controller.js';
import fs from 'fs';
import path from 'path';

// Helper function to delete video file
const deleteVideoFile = (videoUrl) => {
  if (!videoUrl) return;
  
  try {
    // Extract filename from URL
    // Example URL: http://localhost:5000/uploads/videos/video-1234567890-123456789.mp4
    const urlParts = videoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const filePath = path.join('uploads', 'videos', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted video file:', filePath);
    }
  } catch (error) {
    console.error('Error deleting video file:', error);
  }
};

// Create bulk submission
export const createBulkSubmission = async (req, res) => {
  try {
    console.log('Creating bulk submission with data:', req.body);
    const { userId, moves, videoUrl } = req.body;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.username);
    
    // Validate moves exist and get move details
    const moveIds = moves.map(move => move.moveId);
    console.log('Move IDs:', moveIds);
    const moveDetails = await Move.find({ _id: { $in: moveIds } });
    console.log('Found moves:', moveDetails.length, 'out of', moves.length);
    
    if (moveDetails.length !== moves.length) {
      console.log('Some moves not found');
      return res.status(400).json({ message: 'Some moves not found' });
    }
    
    // Create moves array with full details
    const movesWithDetails = moves.map(move => {
      const moveDetail = moveDetails.find(m => m._id.toString() === move.moveId);
      return {
        moveId: move.moveId,
        name: moveDetail.name,
        category: moveDetail.category,
        level: moveDetail.level,
        xp: moveDetail.xp
      };
    });
    
    console.log('Moves with details:', movesWithDetails);
    console.log('Video URL:', videoUrl);
    
    // Create bulk submission
    const bulkSubmission = new BulkSubmission({
      userId,
      moves: movesWithDetails,
      videoUrl,
      status: 'pending'
    });
    
    await bulkSubmission.save();
    console.log('Bulk submission saved with ID:', bulkSubmission._id);
    
    res.status(201).json({
      message: 'Bulk submission created successfully',
      submission: bulkSubmission
    });
  } catch (err) {
    console.error('Error creating bulk submission:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all bulk submissions
export const getAllBulkSubmissions = async (req, res) => {
  try {
    console.log('Fetching all bulk submissions...');
    const submissions = await BulkSubmission.find()
      .populate('userId', 'username name level xp profileImage')
      .populate('reviewedBy', 'username name')
      .sort({ createdAt: -1 });
    
    console.log('Found bulk submissions:', submissions.length);
    console.log('Submissions:', submissions.map(s => ({
      id: s._id,
      userId: s.userId?.username,
      status: s.status,
      movesCount: s.moves.length
    })));
    
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching bulk submissions:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get bulk submissions by user
export const getBulkSubmissionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const submissions = await BulkSubmission.find({ userId })
      .populate('userId', 'username name level xp profileImage')
      .populate('reviewedBy', 'username name')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching user bulk submissions:', err);
    res.status(500).json({ message: err.message });
  }
};

// Approve bulk submission
export const approveBulkSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user?._id; // Assuming admin user is in req.user
    
    const submission = await BulkSubmission.findById(submissionId)
      .populate('userId', 'username name level xp profileImage');
    
    if (!submission) {
      return res.status(404).json({ message: 'Bulk submission not found' });
    }
    
    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission already processed' });
    }
    
    // Update submission status
    submission.status = 'approved';
    submission.reviewedAt = new Date();
    submission.reviewedBy = adminId;
    submission.adminNotes = adminNotes;
    
    await submission.save();
    
    // Add all moves to user's mastered moves
    const user = await User.findById(submission.userId._id);
    const moveIds = submission.moves.map(move => move.moveId);
    const totalXP = submission.moves.reduce((sum, move) => sum + move.xp, 0);
    
    // Add moves to mastered moves (avoid duplicates)
    for (const moveId of moveIds) {
      if (!user.masteredMoves.includes(moveId)) {
        user.masteredMoves.push(moveId);
      }
    }
    
    // Update user XP and level
    const oldLevel = user.level;
    user.xp += totalXP;
    user.level = user.calculateLevel();
    
    // Check and assign new badges
    const badgeResult = await user.checkAndAssignBadges();
    
    await user.save();
    // Notifications: level up and badges after bulk approval
    try {
      if (typeof oldLevel === 'number' && user.level > oldLevel) {
        await createBattleNotification(user._id, null, 'level_up', null, `You reached level ${user.level}!`);
      }
      if (badgeResult.newBadges && badgeResult.newBadges.length > 0) {
        for (const b of badgeResult.newBadges) {
          await createBattleNotification(user._id, null, 'badge_earned', null, `You earned the ${b.name} badge!`);
        }
      }
    } catch (e) {
      console.error('Error creating notifications for bulk approval:', e);
    }
    
    // Delete video file after approval
    deleteVideoFile(submission.videoUrl);
    
    // Get updated user data
    const updatedUser = await User.findById(submission.userId._id)
      .select('-password')
      .populate('masteredMoves', 'name category level xp')
      .populate('pendingMoves', 'name category level xp')
      .populate('badges', 'name image emoji category level');
    
    res.json({
      message: 'Bulk submission approved',
      submission,
      user: updatedUser,
      newBadges: badgeResult.newBadges.length > 0 ? badgeResult.newBadges : null,
      removedBadges: badgeResult.removedBadges.length > 0 ? badgeResult.removedBadges : null
    });
  } catch (err) {
    console.error('Error approving bulk submission:', err);
    res.status(500).json({ message: err.message });
  }
};

// Reject bulk submission
export const rejectBulkSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user?._id; // Assuming admin user is in req.user
    
    const submission = await BulkSubmission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Bulk submission not found' });
    }
    
    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission already processed' });
    }
    
    // Update submission status
    submission.status = 'rejected';
    submission.reviewedAt = new Date();
    submission.reviewedBy = adminId;
    submission.adminNotes = adminNotes;
    
    await submission.save();
    
    // Delete video file after rejection
    deleteVideoFile(submission.videoUrl);
    
    res.json({
      message: 'Bulk submission rejected',
      submission
    });
  } catch (err) {
    console.error('Error rejecting bulk submission:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete bulk submission
export const deleteBulkSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await BulkSubmission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Bulk submission not found' });
    }
    
    // Delete video file before deleting submission
    deleteVideoFile(submission.videoUrl);
    
    // Delete the submission
    await BulkSubmission.findByIdAndDelete(submissionId);
    
    res.json({ message: 'Bulk submission deleted successfully' });
  } catch (err) {
    console.error('Error deleting bulk submission:', err);
    res.status(500).json({ message: err.message });
  }
}; 