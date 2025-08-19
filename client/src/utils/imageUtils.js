// Utility function to handle image URLs consistently
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a server upload path, add the server URL
  if (imagePath.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  }
  
  // If it's an asset path, return as is (these are served from the public folder)
  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  // For any other relative paths, assume they're assets
  return imagePath;
};

// Utility function to check if an image path is a server upload
export const isServerUpload = (imagePath) => {
  return imagePath && imagePath.startsWith('/uploads/');
};

// Utility function to get the appropriate image source for different contexts
export const getImageSrc = (imagePath, fallbackPath = null) => {
  const url = getImageUrl(imagePath);
  if (url) return url;
  
  // Return fallback if provided
  return fallbackPath;
};
