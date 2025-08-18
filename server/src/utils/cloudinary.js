import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpwzysxp7',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key_here',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret_here',
});

/**
 * Delete a video from Cloudinary
 * @param {string} videoUrl - The Cloudinary URL of the video to delete
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
export const deleteVideoFromCloudinary = async (videoUrl) => {
  try {
    if (!videoUrl) {
      console.log('No video URL provided for deletion');
      return null;
    }

    // Extract public ID from Cloudinary URL
    // Example URL: https://res.cloudinary.com/dpwzysxp7/video/upload/v1234567890/breakverse/battles/filename.mp4
    const urlParts = videoUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      console.log('Invalid Cloudinary URL format:', videoUrl);
      return null;
    }

    // Get the path after 'upload' and before any version parameter
    let publicId = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension and version if present
    publicId = publicId.replace(/\.[^/.]+$/, ''); // Remove file extension
    publicId = publicId.replace(/^v\d+\//, ''); // Remove version prefix if present

    console.log('Deleting video with public ID:', publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    });

    console.log('Video deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple videos from Cloudinary
 * @param {Array<string>} videoUrls - Array of Cloudinary URLs to delete
 * @returns {Promise<Array>} - Array of deletion results
 */
export const deleteMultipleVideosFromCloudinary = async (videoUrls) => {
  try {
    const deletionPromises = videoUrls
      .filter(url => url) // Filter out null/undefined URLs
      .map(url => deleteVideoFromCloudinary(url));
    
    const results = await Promise.allSettled(deletionPromises);
    
    console.log('Multiple video deletion results:', results);
    return results;
  } catch (error) {
    console.error('Error deleting multiple videos from Cloudinary:', error);
    throw error;
  }
}; 