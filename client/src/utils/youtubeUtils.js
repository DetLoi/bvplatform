// Utility functions for handling YouTube URLs

/**
 * Converts a YouTube watch URL to an embed URL
 * @param {string} youtubeUrl - The YouTube watch URL
 * @returns {string} - The YouTube embed URL
 */
export function convertToEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) return '';
  
  // Handle different YouTube URL formats
  let videoId = '';
  
  // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = youtubeUrl.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  // Short URL: https://youtu.be/VIDEO_ID
  const shortMatch = youtubeUrl.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }
  
  // Embed URL: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = youtubeUrl.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) {
    videoId = embedMatch[1];
  }
  
  if (!videoId) {
    console.warn('Could not extract video ID from URL:', youtubeUrl);
    return '';
  }
  
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Checks if a URL is a YouTube URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a YouTube URL
 */
export function isYouTubeUrl(url) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Creates an iframe element for YouTube embedding
 * @param {string} youtubeUrl - The YouTube URL
 * @param {Object} options - Additional options for the iframe
 * @returns {string} - HTML string for the iframe
 */
export function createYouTubeIframe(youtubeUrl, options = {}) {
  const embedUrl = convertToEmbedUrl(youtubeUrl);
  if (!embedUrl) return '';
  
  const {
    width = '100%',
    height = '100%',
    allowFullscreen = true,
    title = 'YouTube video player',
    ...otherOptions
  } = options;
  
  const iframeProps = {
    src: embedUrl,
    width,
    height,
    title,
    frameborder: '0',
    allow: allowFullscreen ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' : '',
    allowfullscreen: allowFullscreen,
    ...otherOptions
  };
  
  const propsString = Object.entries(iframeProps)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  return `<iframe ${propsString}></iframe>`;
} 