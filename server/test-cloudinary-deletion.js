import { deleteVideoFromCloudinary, deleteMultipleVideosFromCloudinary } from './src/utils/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

// Test function
async function testCloudinaryDeletion() {
  try {
    console.log('Testing Cloudinary video deletion...');
    
    // Test with a sample Cloudinary URL (this won't actually delete anything)
    const sampleUrl = 'https://res.cloudinary.com/dpwzysxp7/video/upload/v1234567890/breakverse/battles/test-video.mp4';
    
    console.log('Sample URL:', sampleUrl);
    
    // Test single video deletion
    console.log('\nTesting single video deletion...');
    const result = await deleteVideoFromCloudinary(sampleUrl);
    console.log('Result:', result);
    
    // Test multiple video deletion
    console.log('\nTesting multiple video deletion...');
    const multipleUrls = [
      'https://res.cloudinary.com/dpwzysxp7/video/upload/v1234567890/breakverse/battles/test-video1.mp4',
      'https://res.cloudinary.com/dpwzysxp7/video/upload/v1234567890/breakverse/battles/test-video2.mp4'
    ];
    
    const multipleResult = await deleteMultipleVideosFromCloudinary(multipleUrls);
    console.log('Multiple deletion result:', multipleResult);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testCloudinaryDeletion(); 