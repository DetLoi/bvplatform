import React, { useState, useEffect } from 'react';
import { FaTimes, FaList, FaCheckCircle, FaTrophy, FaChevronUp, FaChevronDown, FaQuestion } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuestTracker } from '../context/QuestTrackerContext';
import './QuestTracker.css';

const QuestTracker = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedMoves, setCompletedMoves] = useState(new Set());
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely get quest tracker context with error handling
  let questTrackerContext;
  try {
    questTrackerContext = useQuestTracker();
  } catch (err) {
    console.error('Error getting quest tracker context:', err);
    return null; // Don't render if context is not available
  }
  
  const { questMoves, isActive, removeQuest, completeMove, isBattlesPage } = questTrackerContext;

  // Handle initial animation only once
  useEffect(() => {
    try {
      if (isActive && !isBattlesPage && !hasAnimated) {
        setHasAnimated(true);
      }
    } catch (err) {
      console.error('Error in quest tracker animation effect:', err);
      setError(err.message);
    }
  }, [isActive, isBattlesPage, hasAnimated]);

  const handleMoveClick = (move) => {
    try {
      if (!move || !move._id) {
        console.warn('Invalid move data:', move);
        return;
      }
      
      if (completeMove) {
        completeMove(move);
      }
      
      // Toggle completion status
      setCompletedMoves(prev => {
        const newSet = new Set(prev);
        if (newSet.has(move._id)) {
          newSet.delete(move._id);
        } else {
          newSet.add(move._id);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Error handling move click:', err);
      setError(err.message);
    }
  };

  const handleRemoveQuest = () => {
    try {
      if (removeQuest) {
        removeQuest();
      }
    } catch (err) {
      console.error('Error removing quest:', err);
      setError(err.message);
    }
  };

  const toggleMinimize = () => {
    try {
      setIsMinimized(!isMinimized);
    } catch (err) {
      console.error('Error toggling minimize:', err);
      setError(err.message);
    }
  };

  // Don't show quest tracker if not active or on battles page
  if (!isActive || isBattlesPage) {
    return null;
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="quest-tracker-error">
        <div className="quest-tracker-header">
          <h3>Quest Tracker Error</h3>
          <button 
            className="quest-remove-btn"
            onClick={() => setError(null)}
            title="Clear error"
          >
            <FaTimes />
          </button>
        </div>
        <div className="quest-error-content">
          <p>An error occurred: {error}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Desktop version - fixed panel on left side
  if (window.innerWidth > 768) {
    return (
      <div className={`quest-tracker-desktop ${hasAnimated ? 'animated' : ''} ${isMinimized ? 'minimized' : ''}`}>
        <div className="quest-tracker-header">
          <h3>Quest Tracker</h3>
          <div className="quest-header-actions">
            <button 
              className="quest-minimize-btn"
              onClick={toggleMinimize}
              title={isMinimized ? "Udvid" : "Minimer"}
            >
              {isMinimized ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            <button 
              className="quest-remove-btn"
              onClick={handleRemoveQuest}
              title="Fjern quest"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            <div className="quest-moves-list">
              {Array.isArray(questMoves) && questMoves.map((move) => {
                if (!move || !move._id) {
                  console.warn('Invalid move in quest moves:', move);
                  return null;
                }
                
                return (
                  <div 
                    key={move._id}
                    className={`quest-move-item ${completedMoves.has(move._id) ? 'completed' : ''}`}
                    onClick={() => handleMoveClick(move)}
                  >
                    <div className="quest-move-info">
                      <h4 className="quest-move-title">{move.name || 'Unknown Move'}</h4>
                      <p className="quest-move-category">{move.category || 'Unknown Category'}</p>
                      <span className="quest-move-xp">{move.xp || 0} XP</span>
                    </div>
                    <div className="quest-move-status">
                      {completedMoves.has(move._id) ? (
                        <FaCheckCircle className="quest-complete-icon" />
                      ) : (
                        <div className="quest-incomplete-circle" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="quest-progress">
              <div className="quest-progress-text">
                {completedMoves.size} / {Array.isArray(questMoves) ? questMoves.length : 0} Completed
              </div>
              <div className="quest-progress-bar">
                <div 
                  className="quest-progress-fill"
                  style={{ 
                    width: `${Array.isArray(questMoves) && questMoves.length > 0 
                      ? (completedMoves.size / questMoves.length) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="quest-master-move">
              <button 
                className="quest-master-move-btn"
                onClick={() => {
                  try {
                    // Get the selected moves from the quest tracker
                    const selectedMoves = Array.isArray(questMoves) 
                      ? questMoves.filter(move => move && move._id && completedMoves.has(move._id))
                      : [];
                    
                    if (selectedMoves.length > 0) {
                      // Navigate with selected moves as state
                      navigate('/master-move', { 
                        state: { 
                          preSelectedMoves: selectedMoves,
                          openSidePanel: true 
                        } 
                      });
                    } else {
                      // Navigate normally if no moves are selected
                      navigate('/master-move');
                    }
                  } catch (err) {
                    console.error('Error navigating to master move:', err);
                    setError(err.message);
                  }
                }}
                title={completedMoves.size > 0 ? `Master ${completedMoves.size} Selected Move(s)` : "Gå til Master Move"}
              >
                <FaTrophy />
                <span>
                  {completedMoves.size > 0 
                    ? `Master ${completedMoves.size} Move${completedMoves.size !== 1 ? 's' : ''}`
                    : 'Master Move'
                  }
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Mobile version - fixed icon that expands to list
  return (
    <div className="quest-tracker-mobile">
      {!isExpanded ? (
        <button 
          className="quest-tracker-toggle"
          onClick={() => setIsExpanded(true)}
          title="Åbn quest tracker"
        >
          <FaQuestion />
          <span className="quest-count">{Array.isArray(questMoves) ? questMoves.length : 0}</span>
        </button>
      ) : (
        <div className="quest-tracker-panel">
          <div className="quest-tracker-header">
            <h3>Quest Tracker</h3>
            <div className="quest-header-actions">
              <button 
                className="quest-remove-btn"
                onClick={handleRemoveQuest}
                title="Fjern quest"
              >
                <FaTimes />
              </button>
              <button 
                className="quest-close-btn"
                onClick={() => setIsExpanded(false)}
                title="Luk"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="quest-moves-list">
            {Array.isArray(questMoves) && questMoves.map((move) => {
              if (!move || !move._id) {
                console.warn('Invalid move in quest moves:', move);
                return null;
              }
              
              return (
                <div 
                  key={move._id}
                  className={`quest-move-item ${completedMoves.has(move._id) ? 'completed' : ''}`}
                  onClick={() => handleMoveClick(move)}
                >
                  <div className="quest-move-info">
                    <h4 className="quest-move-title">{move.name || 'Unknown Move'}</h4>
                    <p className="quest-move-category">{move.category || 'Unknown Category'}</p>
                    <span className="quest-move-xp">{move.xp || 0} XP</span>
                  </div>
                  <div className="quest-move-status">
                    {completedMoves.has(move._id) ? (
                      <FaCheckCircle className="quest-complete-icon" />
                    ) : (
                      <div className="quest-incomplete-circle" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="quest-progress">
            <div className="quest-progress-text">
              {completedMoves.size} / {Array.isArray(questMoves) ? questMoves.length : 0} Completed
            </div>
            <div className="quest-progress-bar">
              <div 
                className="quest-progress-fill"
                style={{ 
                  width: `${Array.isArray(questMoves) && questMoves.length > 0 
                    ? (completedMoves.size / questMoves.length) * 100 
                    : 0}%` 
                }}
              />
            </div>
          </div>
          
          <div className="quest-master-move">
            <button 
              className="quest-master-move-btn"
              onClick={() => {
                try {
                  // Get the selected moves from the quest tracker
                  const selectedMoves = Array.isArray(questMoves) 
                    ? questMoves.filter(move => move && move._id && completedMoves.has(move._id))
                    : [];
                  
                  if (selectedMoves.length > 0) {
                    // Navigate with selected moves as state
                    navigate('/master-move', { 
                      state: { 
                        preSelectedMoves: selectedMoves,
                        openSidePanel: true 
                      } 
                    });
                  } else {
                    // Navigate normally if no moves are selected
                    navigate('/master-move');
                  }
                } catch (err) {
                  console.error('Error navigating to master move:', err);
                  setError(err.message);
                }
              }}
              title={completedMoves.size > 0 ? `Master ${completedMoves.size} Selected Move(s)` : "Gå til Master Move"}
            >
              <FaTrophy />
              <span>
                {completedMoves.size > 0 
                  ? `Master ${completedMoves.size} Move${completedMoves.size !== 1 ? 's' : ''}`
                  : 'Master Move'
                }
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestTracker;
