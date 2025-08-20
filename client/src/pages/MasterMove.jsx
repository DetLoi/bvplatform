import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUpload, FaPlay, FaCheck, FaSearch, FaPlus, FaFilter, FaChevronUp, FaChevronDown, FaList } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useBulkSubmissions } from '../hooks/useBulkSubmissions';
import { uploadAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import VideoPlayer from '../components/VideoPlayer';
import '../styles/pages/add-form.css';
import '../styles/pages/master-move.css';

const categories = ['All Moves', 'Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];

export default function MasterMove() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { requestMoveApproval, masteredMoves } = useProfile();
  const { createSubmission } = useBulkSubmissions();
  
  // State for move selection
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Moves');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  
  // State for video upload
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // State for panel expansion - start closed by default
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Update mobile detection on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // State for tracking moves being removed (for animations)
  const [removingMoves, setRemovingMoves] = useState(new Set());
  
  // Fetch moves
  const { moves, loading, error: movesError, fetchMoves } = useMoves({ skipInitialFetch: true });
  
  useEffect(() => {
    fetchMoves({ limit: 1000 }); // Get all moves
  }, []);

  // Handle pre-selected moves from quest tracker
  useEffect(() => {
    if (location.state?.preSelectedMoves && location.state.preSelectedMoves.length > 0) {
      const preSelectedMoves = location.state.preSelectedMoves;
      setSelectedMoves(preSelectedMoves);
      
      // Automatically open the side panel if requested
      if (location.state.openSidePanel) {
        setIsPanelExpanded(true);
      }
      
      // Clear the state to prevent re-application on re-renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Filter moves based on search, category, and level
  const filteredMoves = moves.filter(move => {
    const matchesSearch = move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         move.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Moves' || move.category === categoryFilter;
    const matchesLevel = levelFilter === 'All Levels' || move.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Group moves by level
  const movesByLevel = filteredMoves.reduce((acc, move) => {
    const level = move.level || 'Beginner';
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(move);
    return acc;
  }, {});

  // Sort levels in order
  const levelOrder = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'];
  const sortedLevels = Object.keys(movesByLevel).sort((a, b) => {
    return levelOrder.indexOf(a) - levelOrder.indexOf(b);
  });

  // Check if move is mastered
  const isMoveMastered = (move) => {
    return masteredMoves.some(masteredMove => {
      const masteredMoveId = String(masteredMove?._id || masteredMove);
      const currentMoveId = String(move?._id || '');
      if (masteredMoveId && currentMoveId) return masteredMoveId === currentMoveId;
      return masteredMove?.name && move?.name && masteredMove.name === move.name;
    });
  };

  // Check if move is selected
  const isMoveSelected = (move) => {
    return selectedMoves.some(selectedMove => selectedMove._id === move._id);
  };

  // Handle move selection/deselection
  const handleMoveToggle = (move) => {
    if (!currentUser) {
      toast.error('Please log in to select moves');
      return;
    }

    if (masteredMoves.includes(move._id)) {
      toast.error('You have already mastered this move');
      return;
    }

    setSelectedMoves(prev => {
      const isSelected = prev.some(m => m._id === move._id);
      if (isSelected) {
        // Start removal animation
        setRemovingMoves(prevRemoving => new Set([...prevRemoving, move._id]));
        
                 // Remove move after animation completes
         setTimeout(() => {
           setSelectedMoves(current => {
             const newMoves = current.filter(m => m._id !== move._id);
             // Don't auto-close panel when removing moves
             return newMoves;
           });
          setRemovingMoves(prevRemoving => {
            const newRemoving = new Set(prevRemoving);
            newRemoving.delete(move._id);
            return newRemoving;
          });
        }, 400); // Match CSS animation duration
        
        return prev; // Keep the move in the list during animation
      } else {
                 // Add move at the top of the list
         const newMoves = [move, ...prev];
         
         // On desktop, automatically show the panel when moves are added
         if (!isMobile && !isPanelExpanded) {
           setIsPanelExpanded(true);
         }
         
         return newMoves;
       }
     });
   };

  // Handle video file selection
  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video file size must be less than 100MB');
        return;
      }
      
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Handle video upload to local server
  const uploadVideoToServer = async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('userId', currentUser._id);
    formData.append('moveId', selectedMoves[0]?._id || '');
    
    try {
      const response = await uploadAPI.uploadVideo(formData);
      return response.url;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedMoves.length === 0) {
      toast.error('Please select at least one move');
      return;
    }
    
    if (!videoFile) {
      toast.error('Please upload a video demonstrating the moves');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      setIsUploading(true);
      const uploadedVideoUrl = await uploadVideoToServer(videoFile);
      setIsUploading(false);
      
      const submissionData = {
        userId: currentUser._id,
        moves: selectedMoves.map(move => ({
          moveId: move._id,
          name: move.name,
          category: move.category,
          level: move.level,
          xp: move.xp
        })),
        videoUrl: uploadedVideoUrl
      };
      
      await createSubmission(submissionData);
      
      toast.success(`Approval requested for ${selectedMoves.length} move(s)!`);
      navigate('/moves');
    } catch (err) {
      setError('Failed to submit master move. Please try again.');
      toast.error('Failed to submit master move. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/moves');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All Moves');
    setLevelFilter('All Levels');
  };

  if (loading) {
    return (
      <div className="master-move-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading moves...</p>
        </div>
      </div>
    );
  }

  if (movesError) {
    return (
      <div className="master-move-page">
        <div className="error-container">
          <p>Error loading moves: {movesError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="master-move-page">
      {/* Header */}
      <div className="master-move-header">
        <button className="master-move-back-btn" onClick={handleCancel}>
          <FaArrowLeft />
          Back to Moves
        </button>
        <h1>Master Moves</h1>
        <p>Select moves you want to master and upload a demonstration video</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search moves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All Levels">All Levels</option>
            {levelOrder.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {(searchTerm || categoryFilter !== 'All Moves' || levelFilter !== 'All Levels') && (
            <button onClick={clearFilters} className="clear-filters-btn">
              <FaTimes />
              Clear
            </button>
          )}
        </div>
      </div>

             {/* Selected Moves Summary - Toggle Design */}
       {/* Show toggle button only on mobile */}
       {isMobile && !isPanelExpanded && (
         <button 
           className="selected-moves-toggle"
           onClick={() => setIsPanelExpanded(true)}
           title="Åbn selected moves"
         >
           <FaList />
           <span className="toggle-text">Selected moves ({selectedMoves.length})</span>
         </button>
       )}
       
       {/* Show panel when expanded OR when there are moves on desktop */}
       {(isPanelExpanded || (!isMobile && selectedMoves.length > 0)) && (
         <div className="selected-moves-panel">
          <div className="selected-moves-header">
            <h3>Selected Moves ({selectedMoves.length})</h3>
            <div className="selected-moves-actions">
              {selectedMoves.length > 0 && (
                <button 
                  className="clear-moves-btn"
                                     onClick={() => {
                     setSelectedMoves([]);
                     // On desktop, automatically hide panel when no moves
                     if (!isMobile) {
                       setIsPanelExpanded(false);
                     }
                   }}
                  title="Clear all selected moves"
                >
                  <FaTimes />
                </button>
              )}
              {/* Only show close button on mobile */}
              {isMobile && (
                <button 
                  className="close-panel-btn"
                  onClick={() => setIsPanelExpanded(false)}
                  title="Luk"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          
          <div className="selected-moves-content">
            {/* Top Section: Scrollable Moves List */}
            <div className="selected-moves-scrollable">
              {selectedMoves.map((move) => (
                <div 
                  key={move._id} 
                  className={`selected-move-item ${removingMoves.has(move._id) ? 'removing' : ''}`}
                >
                  <div className="move-info">
                    <div className={`move-name level-${move.level?.toLowerCase()}`}>
                      {move.name}
                    </div>
                    <div className="move-details">
                      <span className="move-category">{move.category}</span>
                      <span className="move-xp">+{move.xp} XP</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMoveToggle(move)}
                    className="remove-move-btn"
                    title="Remove move"
                    disabled={removingMoves.has(move._id)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Fixed Bottom Sections */}
            <div className="panel-bottom-sections">
              {/* Video Upload Section */}
              <div className="video-upload-section">
                <h2>Upload Demonstration Video</h2>
                <p>Record yourself performing all selected moves and upload the video for approval</p>
                
                <div className="upload-container">
                  {!videoUrl ? (
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoSelect}
                        id="video-upload"
                        className="file-input"
                      />
                      <label htmlFor="video-upload" className="upload-label">
                        <FaUpload />
                        <span>Click to select video file</span>
                        <small>Max size: 100MB</small>
                      </label>
                    </div>
                  ) : (
                    <div className="video-preview">
                      <VideoPlayer
                        src={videoUrl}
                        className="preview-video"
                        title="Preview video"
                      />
                      <div className="video-actions">
                        <button
                          onClick={() => {
                            setVideoFile(null);
                            setVideoUrl(null);
                          }}
                          className="change-video-btn"
                        >
                          Change Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {isUploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p>Uploading video... {uploadProgress}%</p>
                  </div>
                )}
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="submit-section">
                <button
                  onClick={handleSubmit}
                  className="submit-btn"
                  disabled={isSubmitting || !videoFile}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Submit Mastery ({selectedMoves.length} moves)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moves Grid */}
      <div className="moves-container">
        {sortedLevels.map(level => (
          <div key={level} className="level-section">
            <h2 className={`level-title level-${level.toLowerCase()}`}>
              {level} Moves ({movesByLevel[level].length})
            </h2>
            <div className="moves-grid">
              {movesByLevel[level].map(move => {
                const mastered = isMoveMastered(move);
                const selected = isMoveSelected(move);
                
                return (
                  <div
                    key={move._id}
                    className={`master-move-card ${mastered ? 'mastered' : ''} ${selected ? 'selected' : ''}`}
                    onClick={() => !mastered && handleMoveToggle(move)}
                  >
                    <div className="move-info">
                      <h3 className={`move-name level-${move.level?.toLowerCase()}`}>
                        {move.name}
                      </h3>
                      <div className="move-category">{move.category}</div>
                      <div className="move-xp">+{move.xp} XP</div>
                    </div>

                    <div className="move-actions">
                      {mastered && (
                        <div className="mastered-indicator" title="Already mastered">
                          <FaCheck />
                          <span>Mastered</span>
                        </div>
                      )}
                      {selected && !mastered && (
                        <div className="selected-indicator">
                          <FaCheck />
                        </div>
                      )}
                      {!mastered && !selected && (
                        <div className="select-indicator">
                          <FaPlus />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
} 