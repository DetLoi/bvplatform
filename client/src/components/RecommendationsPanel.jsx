import { useState } from 'react';

export default function RecommendationsPanel({ selectedMove, onMoveSelect, currentCategory, moves }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Only show panel when a specific move is selected
  if (!selectedMove || !selectedMove.recommendations) {
    return null;
  }

  // Show specific recommendations for the selected move
  const recommendedMoves = selectedMove.recommendations
    .map(moveName => moves.find(move => move.name === moveName))
    .filter(Boolean);

  if (recommendedMoves.length === 0) {
    return null;
  }

  // Show max 3 moves when collapsed, all when expanded
  const displayedMoves = isExpanded ? recommendedMoves : recommendedMoves.slice(0, 3);
  const hasMoreMoves = recommendedMoves.length > 3;

  return (
    <div className="recommendations-panel">
      <h3 className="recommendations-title">Recommended Moves</h3>
      <p className="recommendations-subtitle">
        These moves work great with {selectedMove.name}
      </p>
      <div className="recommendations-grid">
        {displayedMoves.map((move) => (
          <button
            key={move.name}
            className="recommendation-card"
            onClick={() => onMoveSelect(move)}
          >
            <div className="recommendation-info">
              <h4 className={`recommendation-name level-${move.level?.toLowerCase()}`}>
                {move.name}
              </h4>
              <div className="recommendation-category">{move.category}</div>
              <div className="recommendation-xp">+{move.xp} XP</div>
            </div>
            <div className="recommendation-play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
      
      {hasMoreMoves && (
        <button 
          className="recommendations-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Show less' : 'Show more'}
        >
          <span className="toggle-text">
            {isExpanded ? 'Show less' : `Show ${recommendedMoves.length - 3} more`}
          </span>
          <svg 
            className={`toggle-arrow ${isExpanded ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
      )}
    </div>
  );
} 