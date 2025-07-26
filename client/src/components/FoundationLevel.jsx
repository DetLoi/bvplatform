import { FaDumbbell, FaTrophy, FaStar } from 'react-icons/fa';

export function FoundationLevel({ masteredMoves, totalMoves, xp, level, progress }) {
  // Calculate foundation level based on moves mastered
  const foundationLevel = Math.floor(masteredMoves.length / 5) + 1; // Every 5 moves = 1 level
  const foundationProgress = (masteredMoves.length % 5) / 5 * 100;
  
  // Foundation level titles
  const foundationTitles = {
    1: "Novice Breaker",
    2: "Apprentice Breaker", 
    3: "Skilled Breaker",
    4: "Experienced Breaker",
    5: "Advanced Breaker",
    6: "Expert Breaker",
    7: "Master Breaker",
    8: "Grandmaster Breaker",
    9: "Legendary Breaker",
    10: "Mythic Breaker"
  };

  const currentTitle = foundationTitles[foundationLevel] || "Legendary Breaker";

  return (
    <div className="foundation-level">
      <div className="foundation-header">
        <div className="foundation-icon">
          <FaDumbbell />
        </div>
        <div className="foundation-info">
          <h3 className="foundation-title">Foundation Level</h3>
          <p className="foundation-subtitle">Based on moves mastered</p>
        </div>
      </div>
      
      <div className="foundation-content">
        <div className="foundation-level-display">
          <div className="level-number">{foundationLevel}</div>
          <div className="level-title">{currentTitle}</div>
        </div>
        
        <div className="foundation-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${foundationProgress}%` }}
            />
          </div>
          <div className="progress-text">
            {masteredMoves.length} moves mastered • {5 - (masteredMoves.length % 5)} more to next level
          </div>
        </div>
        
        <div className="foundation-stats">
          <div className="stat-item">
            <FaTrophy className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{masteredMoves.length}</div>
              <div className="stat-label">Moves Mastered</div>
            </div>
          </div>
          
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{xp}</div>
              <div className="stat-label">Total XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 