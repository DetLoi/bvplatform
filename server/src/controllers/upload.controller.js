import User from '../models/user.models.js';
import path from 'path';
import fs from 'fs';

// Helper function to delete old image file
const deleteOldImage = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('/uploads/')) return;
  
  try {
    const filename = imageUrl.split('/uploads/')[1];
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old image: ${filename}`);
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