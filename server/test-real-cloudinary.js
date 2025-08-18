import { deleteVideoFromCloudinary } from './src/utils/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

// Test function with real Cloudinary URL format
async function testRealCloudinaryDeletion() {
  try {
    console.log('Testing Cloudinary video deletion with real URL format...');
    
    // Test with a real Cloudinary URL format (this won't actually delete anything)
    const realUrlFormat = 'https://res.cloudinary.com/dpwzysxp7/video/upload/v1703123456/breakverse/battles/actual-video-file.mp4';
    
    console.log('Real URL format:', realUrlFormat);
    
    // Test the URL parsing logic
    const urlParts = realUrlFormat.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    console.log('URL parts:', urlParts);
    console.log('Upload index:', uploadIndex);
    
    if (uploadIndex !== -1) {
      let publicId = urlParts.slice(uploadIndex + 2).join('/');
      console.log('Initial public ID:', publicId);
      
      // Remove file extension and version if present
      publicId = publicId.replace(/\.[^/.]+$/, ''); // Remove file extension
      publicId = publicId.replace(/^v\d+\//, ''); // Remove version prefix if present
      
      console.log('Final public ID:', publicId);
    }
    
    // Test the actual deletion function
    console.log('\nTesting actual deletion function...');
    const result = await deleteVideoFromCloudinary(realUrlFormat);
    console.log('Deletion result:', result);
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testRealCloudinaryDeletion(); 