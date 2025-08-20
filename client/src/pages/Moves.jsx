import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import MoveCard from '../components/MoveCard';
import RecommendationsPanel from '../components/RecommendationsPanel';
import VideoPlayer from '../components/VideoPlayer';
import IntroGuideModal from '../components/IntroGuideModal';
import { useQuestTracker } from '../context/QuestTrackerContext';
import { toast } from 'react-hot-toast';
import { movesAPI } from '../services/api';

const categories = ['All Moves', 'Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];

// Default category videos (replace with real URLs)
const categoryVideos = {
  'All Moves': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Toprock: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Footwork: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Freezes: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Power: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  Tricks: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  GoDowns: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export function Moves({ setToastMessage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { masteredMoves } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Moves';
  const [category, setCategory] = useState(initialCategory);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMove, setSelectedMove] = useState(null);
           const [showIntroGuide, setShowIntroGuide] = useState(false);
         const [isPageDimmed, setIsPageDimmed] = useState(false);
         const { activateQuest } = useQuestTracker(); // Use context instead of local state
  
  // Show intro guide automatically for first time users
  useEffect(() => {
    if (currentUser?.isFirstTimeUser && !currentUser?.hasSeenIntroGuide) {
      console.log('First time user detected, showing intro guide automatically');
      setShowIntroGuide(true);
    }
  }, [currentUser]);
  const movesPageRef = useRef(null);
  const hasAppliedUrlSelectionRef = useRef(false);
  
  // Use a single instance of the API hook
  const { moves, loading, error, fetchMovesByCategory, fetchMoves } = useMoves({ skipInitialFetch: true });
  
  // State to track all moves for recommendations
  const [allMoves, setAllMoves] = useState([]);
  


  // Fetch all moves on component mount for move lookup
  useEffect(() => {
    const fetchAllMoves = async () => {
      try {
        const response = await movesAPI.getAll({ limit: 1000 });
        const moves = response.moves || [];
        setAllMoves(moves);
      } catch (err) {
        console.error('Error fetching all moves:', err);
      }
    };
    
    fetchAllMoves();
  }, []); // Only run once on mount

  // Sync category from URL first; if only move is provided, infer category from allMoves
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const moveParam = searchParams.get('move');
    console.log('URL param effect - categoryParam:', categoryParam, 'moveParam:', moveParam, 'allMoves length:', allMoves.length);

    if (categoryParam && categoryParam !== category) {
      setCategory(categoryParam);
      hasAppliedUrlSelectionRef.current = false;
      return;
    }

    if (!categoryParam && moveParam && allMoves.length > 0) {
      const found = allMoves.find(m => m.name === moveParam);
      console.log('URL param effect - inferred move:', found);
      if (found && found.category !== category) {
        setCategory(found.category);
        hasAppliedUrlSelectionRef.current = false;
      }
    }
  }, [searchParams, allMoves, category]);

  // Fetch moves by category when category changes
  useEffect(() => {
    console.log('Category changed to:', category);
    const fetchMovesForCategory = async () => {
      try {
        if (category === 'All Moves') {
          // Fetch all moves without any level filter to show everything
          await fetchMoves({ limit: 1000 }); // Request a high limit to get all moves
        } else {
          await fetchMovesByCategory(category);
        }
      } catch (err) {
        console.error('Error fetching moves by category:', err);
      }
    };

    fetchMovesForCategory();
  }, [category]); // Remove fetchMoves and fetchMovesByCategory from dependencies

  // Handle video selection after moves are loaded for a specific category
  useEffect(() => {
    const moveParam = searchParams.get('move');
    console.log('Video selection effect - moveParam:', moveParam, 'moves length:', moves.length, 'category:', category, 'applied:', hasAppliedUrlSelectionRef.current);

    if (!moveParam) {
      hasAppliedUrlSelectionRef.current = false;
      return;
    }

    if (category === 'All Moves') return; // wait until on specific tab
    if (hasAppliedUrlSelectionRef.current && selectedMove && selectedMove.name === moveParam) return;

    if (moves.length > 0) {
      const move = moves.find(m => m.name === moveParam && m.category === category);
      console.log('Found move in category moves:', move);
      if (move) {
        console.log('Calling handleVideoSelect for:', move.name);
        handleVideoSelect(move);
      }
    }
  }, [moves, category, searchParams, selectedMove]);

  function handleAddMove(move) {
    toast.success(`Request sent to certified instructor for ${move.name}!`);
  }

  function handleVideoSelect(move) {
    console.log('handleVideoSelect called with:', move);
    
    // Safety check - ensure move has required properties
    if (!move || !move.videoUrl) {
      console.warn('Invalid move data for video selection:', move);
      return;
    }
    
    // Enrich selected move with full data (including recommendations) from the full moves list if available
    const sourceList = (allMoves && allMoves.length) ? allMoves : moves;
    const enriched = sourceList.find(m => (m._id && m._id === move._id) || m.name === move.name) || move;
    console.log('Enriched move:', enriched);
    setSelectedVideo(enriched.videoUrl);
    setSelectedMove(enriched);
    hasAppliedUrlSelectionRef.current = true;
    // For manual or URL selection, clear move param to avoid URL effect blocking subsequent clicks
    setSearchParams({ category });
    
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

           // Quest tracker functions
         function handleActivateQuest(moves) {
           console.log('Activating quest with moves:', moves);
           activateQuest(moves);
         }

  function handleCategoryChange(newCategory) {
    setCategory(newCategory);
    setSelectedVideo(categoryVideos[newCategory]);
    setSelectedMove(null);
    hasAppliedUrlSelectionRef.current = false;
    
    // Update URL parameters when manually changing categories
    setSearchParams({ category: newCategory });
  }

  // Set initial video when component mounts or category changes (skip when deep-linking to a move)
  useEffect(() => {
    const moveParam = searchParams.get('move');
    if (!selectedVideo && !moveParam) {
      setSelectedVideo(categoryVideos[category]);
    }
  }, [category, selectedVideo, searchParams]);

  // Show loading state
  if (loading) {
    return (
      <div className="main-content fullpage-loading">
        <section className="moves-page" ref={movesPageRef}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading moves...</p>
          </div>
        </section>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="main-content fullpage-loading">
        <section className="moves-page" ref={movesPageRef}>
          <div className="error-container">
            <p>Error loading moves: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </section>
      </div>
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
      
                    {/* Master Move Button and Intro Guide Button */}
       <div className="master-move-section">
         <button 
           className="master-move-btn"
           onClick={() => navigate('/master-move')}
         >
          Click here to prove a point
         </button>
         
         <button 
           className="intro-guide-page-btn"
           onClick={() => setShowIntroGuide(true)}
         >
           📚 Se guide
         </button>
       </div>
      
      {/* Video Section with Recommendations */}
      <div
        className={`video-section ${selectedMove ? 'has-recommendations' : ''}`}
      >
        {selectedMove ? (
          <>
            <div className="video-container">
              <VideoPlayer
                src={selectedVideo || categoryVideos[category]}
                className="moves-video"
                title={selectedMove ? `${selectedMove.name} tutorial` : `${category} overview`}
              />
            </div>
            
                         {/* Recommendations Panel */}
             <RecommendationsPanel 
               selectedMove={selectedMove} 
               onMoveSelect={handleVideoSelect}
               currentCategory={category}
               moves={allMoves && allMoves.length ? allMoves : moves}
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
              <VideoPlayer
                src={selectedVideo || categoryVideos[category]}
                className="moves-video"
                title={`${category} overview`}
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
           category === 'All Moves' ? (
            // Group moves by level for All Moves tab
            (() => {
              // Map database level values to our expected order
              const levelOrder = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master'];
              const groupedMoves = {};
              
              // Group moves by level
              moves.forEach(move => {
                const level = move.level || 'Beginner';
                if (!groupedMoves[level]) {
                  groupedMoves[level] = [];
                }
                groupedMoves[level].push(move);
              });
              
              return levelOrder.map(level => {
                const levelMoves = groupedMoves[level];
                if (!levelMoves || levelMoves.length === 0) return null;
                
                return (
                  <div key={level} className="level-section">
                    <h3 className="level-title">{level.charAt(0).toUpperCase() + level.slice(1)}</h3>
                    <div className="level-moves-grid">
                      {levelMoves.map((move) => (
                        <div key={move.name}>
                          <MoveCard 
                            move={move} 
                            onAdd={handleAddMove}
                            onVideoSelect={() => handleVideoSelect(move)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()
          ) : (
            // Regular grid for specific categories – sorted by level (Beginner → Master)
            (() => {
              const levelOrder = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master'];
              const sortKey = (lvl) => {
                const idx = levelOrder.indexOf(lvl || 'Beginner');
                return idx === -1 ? levelOrder.length : idx;
              };
              const sortedMoves = [...moves].sort((a, b) => {
                const levelDiff = sortKey(a.level) - sortKey(b.level);
                if (levelDiff !== 0) return levelDiff;
                return String(a.name).localeCompare(String(b.name));
              });
              return sortedMoves.map((move) => (
              <div key={move.name}>
                <MoveCard 
                  move={move} 
                  onAdd={handleAddMove}
                  onVideoSelect={() => handleVideoSelect(move)}
                />
              </div>
              ));
            })()
          )
        ) : (
          <div className="no-moves">
            <p>No moves found for {category}</p>
          </div>
        )}
      </div>


      
      {/* Intro Guide Modal */}
               <IntroGuideModal 
                 show={showIntroGuide}
                 onClose={() => {
                   console.log('onClose called, setting showIntroGuide to false');
                   setShowIntroGuide(false);
                 }}
                 onMoveSelect={(move) => {
                   console.log('Move selected from guide:', move);
                   // Set the selected move to trigger video player
                   setSelectedMove(move);
                   setSelectedVideo(move.videoUrl || move.video);
                 }}
                 userMasteredMoves={(() => {
                   console.log('Sending mastered moves to guide from ProfileContext:', masteredMoves);
                   return masteredMoves || [];
                 })()}
                                  onFirstTimeStart={() => {
                   console.log('First time user started, dimming page');
                   setIsPageDimmed(true);
                 }}
                 onActivateQuest={handleActivateQuest}
                 />


               
               {/* Dimmed Page Overlay */}
               {isPageDimmed && (
                 <div className="dimmed-page-overlay">
                   <div className="guide-highlight-container">
                     <div className="guide-highlight-text">
                       <p>Du kan finde øveguiden her</p>
                       <button 
                         className="close-dimmed-btn"
                         onClick={() => setIsPageDimmed(false)}
                       >
                         Luk
                       </button>
                     </div>
                   </div>
                 </div>
               )}
    </section>
  );
}
