import { useState, useEffect } from 'react';
import { convertToEmbedUrl, isYouTubeUrl } from '../utils/youtubeUtils';

export default function VideoPlayer({ 
  src, 
  className = '', 
  title = 'Video player',
  onError = () => {},
  ...props 
}) {
  const [isYouTube, setIsYouTube] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    if (src) {
      const youtube = isYouTubeUrl(src);
      setIsYouTube(youtube);
      
      if (youtube) {
        const embed = convertToEmbedUrl(src);
        setEmbedUrl(embed);
      }
    }
  }, [src]);

  if (!src) {
    return (
      <div className={`video-placeholder ${className}`}>
        <p>No video available</p>
      </div>
    );
  }

  if (isYouTube && embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className={`youtube-iframe ${className}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...props}
      />
    );
  }

  // For non-YouTube videos, use the regular video element
  return (
    <video
      src={src}
      className={`video-player ${className}`}
      controls
      onError={onError}
      {...props}
    />
  );
} 