import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import MoveCard from '../components/MoveCard';
import RecommendationsPanel from '../components/RecommendationsPanel';
import { toast } from 'react-hot-toast';

const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];

// Default category videos (replace with real URLs)
const categoryVideos = {
  Toprock: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Footwork: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Freezes: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Power: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Tricks: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  GoDowns: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export function Moves({ setToastMessage }) {
  const [category, setCategory] = useState('Toprock');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMove, setSelectedMove] = useState(null);
  const movesPageRef = useRef(null);
  const [searchParams] = useSearchParams();
  
  // Use the API hook
  const { moves, loading, error, fetchMovesByCategory } = useMoves();

  // Handle URL parameter for specific move
  useEffect(() => {
    const moveParam = searchParams.get('move');
    if (moveParam && moves.length > 0) {
      const move = moves.find(m => m.name === moveParam);
      if (move) {
        setCategory(move.category);
        handleVideoSelect(move);
      }
    }
  }, [searchParams, moves]);

  // Fetch moves by category when category changes
  useEffect(() => {
    fetchMovesByCategory(category);
  }, [category, fetchMovesByCategory]);

  function handleAddMove(move) {
    toast.success(`Request sent to certified instructor for ${move.name}!`);
  }

  function handleVideoSelect(move) {
    setSelectedVideo(move.videoUrl);
    setSelectedMove(move);
    
    // Scroll to the very top of the moves page (including tabs)
    if (movesPageRef.current) {
      const headerHeight = 80; // Approximate header height
      const elementTop = movesPageRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight - 20; // Extra 20px for breathing room
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  function handleCategoryChange(newCategory) {
    setCategory(newCategory);
    setSelectedVideo(categoryVideos[newCategory]);
    setSelectedMove(null);
  }

  // Set initial video when component mounts or category changes
  useEffect(() => {
    if (!selectedVideo) {
      setSelectedVideo(categoryVideos[category]);
    }
  }, [category, selectedVideo]);

  // Show loading state
  if (loading) {
    return (
      <section className="moves-page" ref={movesPageRef}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading moves...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="moves-page" ref={movesPageRef}>
        <div className="error-container">
          <p>Error loading moves: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <section className="moves-page" ref={movesPageRef}>
      {/* Category Tabs */}
      <div className="moves-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Video Section with Recommendations */}
      <div className={`video-section ${selectedMove ? 'has-recommendations' : ''}`}>
        {selectedMove ? (
          <>
            <div className="video-container">
              <video
                src={selectedVideo || categoryVideos[category]}
                controls
                className="moves-video"
                aria-label={selectedMove ? `${selectedMove.name} tutorial` : `${category} overview`}
              />
            </div>
            
            {/* Recommendations Panel */}
            <RecommendationsPanel 
              selectedMove={selectedMove} 
              onMoveSelect={handleVideoSelect}
              currentCategory={category}
            />
            
            <div className="video-info">
              <h3 className="video-title">
                {selectedMove ? `Learn ${selectedMove.name}` : `Learn ${category} Moves`}
              </h3>
              <p className="video-description">
                {selectedMove 
                  ? `Master the ${selectedMove.name} move with step-by-step instructions.`
                  : `Watch and learn the fundamentals of ${category.toLowerCase()} moves. Master the basics before moving to advanced techniques.`
                }
              </p>
            </div>
          </>
        ) : (
          <div className="video-flex-container">
            <div className="video-container">
              <video
                src={selectedVideo || categoryVideos[category]}
                controls
                className="moves-video"
                aria-label={`${category} overview`}
              />
            </div>
            
            <div className="video-info">
              <h3 className="video-title">
                Learn {category} Moves
              </h3>
              <p className="video-description">
                Watch and learn the fundamentals of {category.toLowerCase()} moves. Master the basics before moving to advanced techniques.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Moves Grid */}
      <div className="moves-grid">
        {moves && moves.length > 0 ? (
          moves.map((move) => (
            <MoveCard 
              key={move.name} 
              move={move} 
              onAdd={handleAddMove}
              onVideoSelect={() => handleVideoSelect(move)}
            />
          ))
        ) : (
          <div className="no-moves">
            <p>No moves found for {category}</p>
          </div>
        )}
      </div>
    </section>
  );
}
