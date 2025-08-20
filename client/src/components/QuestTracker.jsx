import React, { useState, useEffect } from 'react';
import { FaTimes, FaList, FaCheckCircle, FaTrophy, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuestTracker } from '../context/QuestTrackerContext';
import './QuestTracker.css';

const QuestTracker = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedMoves, setCompletedMoves] = useState(new Set());
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { questMoves, isActive, removeQuest, completeMove, isBattlesPage } = useQuestTracker();

  // Handle initial animation only once
  useEffect(() => {
    if (isActive && !isBattlesPage && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isActive, isBattlesPage, hasAnimated]);

  const handleMoveClick = (move) => {
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
  };

  const handleRemoveQuest = () => {
    if (removeQuest) {
      removeQuest();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Don't show quest tracker if not active or on battles page
  if (!isActive || isBattlesPage) {
    return null;
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
              {questMoves.map((move) => (
                <div 
                  key={move._id}
                  className={`quest-move-item ${completedMoves.has(move._id) ? 'completed' : ''}`}
                  onClick={() => handleMoveClick(move)}
                >
                  <div className="quest-move-info">
                    <h4 className="quest-move-title">{move.name}</h4>
                    <p className="quest-move-category">{move.category}</p>
                    <span className="quest-move-xp">{move.xp} XP</span>
                  </div>
                  <div className="quest-move-status">
                    {completedMoves.has(move._id) ? (
                      <FaCheckCircle className="quest-complete-icon" />
                    ) : (
                      <div className="quest-incomplete-circle" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="quest-progress">
              <div className="quest-progress-text">
                {completedMoves.size} / {questMoves.length} Completed
              </div>
              <div className="quest-progress-bar">
                <div 
                  className="quest-progress-fill"
                  style={{ width: `${(completedMoves.size / questMoves.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="quest-master-move">
              <button 
                className="quest-master-move-btn"
                onClick={() => {
                  // Get the selected moves from the quest tracker
                  const selectedMoves = questMoves.filter(move => completedMoves.has(move._id));
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
          <FaList />
          <span className="quest-count">{questMoves.length}</span>
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
            {questMoves.map((move) => (
              <div 
                key={move._id}
                className={`quest-move-item ${completedMoves.has(move._id) ? 'completed' : ''}`}
                onClick={() => handleMoveClick(move)}
              >
                <div className="quest-move-info">
                  <h4 className="quest-move-title">{move.name}</h4>
                  <p className="quest-move-category">{move.category}</p>
                  <span className="quest-move-xp">{move.xp} XP</span>
                </div>
                <div className="quest-move-status">
                  {completedMoves.has(move._id) ? (
                    <FaCheckCircle className="quest-complete-icon" />
                  ) : (
                    <div className="quest-incomplete-circle" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="quest-progress">
            <div className="quest-progress-text">
              {completedMoves.size} / {questMoves.length} Completed
            </div>
            <div className="quest-progress-bar">
              <div 
                className="quest-progress-fill"
                style={{ width: `${(completedMoves.size / questMoves.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="quest-master-move">
            <button 
              className="quest-master-move-btn"
              onClick={() => {
                // Get the selected moves from the quest tracker
                const selectedMoves = questMoves.filter(move => completedMoves.has(move._id));
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
