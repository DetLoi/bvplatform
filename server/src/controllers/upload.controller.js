import fs from 'fs';
import path from 'path';
import User from '../models/user.models.js';

// Helper function to delete old images
const deleteOldImage = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    const filePath = path.join('uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted old image:', filePath);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
};

// Upload profile image
export const uploadProfileImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get current user to check for existing image
    const currentUser = await User.findById(userId).select('-password');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile image if it exists
    if (currentUser.profileImage) {
      deleteOldImage(currentUser.profileImage);
    }

    // Create the file URL with full server URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Update user's profile image in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: fileUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: fileUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Error uploading profile image' });
  }
};

// Upload cover image
export const uploadCoverImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get current user to check for existing image
    const currentUser = await User.findById(userId).select('-password');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old cover image if it exists
    if (currentUser.coverImage) {
      deleteOldImage(currentUser.coverImage);
    }

    // Create the file URL with full server URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Update user's cover image in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { coverImage: fileUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Cover image uploaded successfully',
      imageUrl: fileUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error uploading cover image:', error);
    res.status(500).json({ message: 'Error uploading cover image' });
  }
};



// Upload video for master moves (LOCAL STORAGE)
export const uploadVideoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const userId = req.body.userId;
    const moveId = req.body.moveId;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Verify user exists
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the file URL with full server URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/videos/${req.file.filename}`;

    res.json({
      message: 'Video uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Error uploading video' });
  }
};

// Delete video file
export const deleteVideoController = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }

    const filePath = path.join('uploads', 'videos', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      message: 'Video deleted successfully',
      filename: filename
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Error deleting video' });
  }
};