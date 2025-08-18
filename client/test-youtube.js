// Test file for YouTube URL conversion
import { convertToEmbedUrl, isYouTubeUrl } from './src/utils/youtubeUtils.js';

// Test cases
const testUrls = [
  'https://www.youtube.com/watch?v=8jLOx1hD3_o',
  'https://youtu.be/8jLOx1hD3_o',
  'https://www.youtube.com/embed/8jLOx1hD3_o',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s',
  'https://youtu.be/dQw4w9WgXcQ?t=30',
  'not-a-youtube-url',
  '',
  null
];

console.log('Testing YouTube URL conversion:');
console.log('================================');

testUrls.forEach(url => {
  console.log(`\nInput: ${url}`);
  console.log(`Is YouTube: ${isYouTubeUrl(url)}`);
  console.log(`Embed URL: ${convertToEmbedUrl(url)}`);
});

console.log('\nTest completed!'); 