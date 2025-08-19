import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useBadges } from '../hooks/useBadges';
import { useMoves } from '../hooks/useMoves';
import { FaArrowLeft, FaTrophy, FaCheck, FaLock, FaLightbulb, FaStar, FaFire } from 'react-icons/fa';
import { useEffect } from 'react';
import { isBadgeUnlocked, getBadgeRequiredMoves, getBadgeProgress } from '../utils/badgeUtils';
import { getImageUrl } from '../utils/imageUtils';
import '../styles/pages/badge-detail.css';

export default function BadgeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { masteredMoves } = useProfile();
  
  // Use API hooks
  const { badges, loading: badgesLoading } = useBadges();
  const { moves, loading: movesLoading } = useMoves();

  // Prevent scroll to top when navigating to badge detail
  useEffect(() => {
    // Option 1: Scroll to top smoothly (current behavior)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Option 2: Don't scroll to top at all (uncomment if you want this)
    // window.scrollTo(0, 0);
    
    // Option 3: Maintain scroll position (uncomment if you want this)
    // const scrollPosition = sessionStorage.getItem('scrollPosition');
    // if (scrollPosition) {
    //   window.scrollTo(0, parseInt(scrollPosition));
    // }
  }, [id]);

  // Show loading state
  if (badgesLoading || movesLoading) {
    return (
      <div className="badge-detail-page">
        <div className="badge-detail-container">
          <div className="loading-spinner"></div>
          <p>Loading badge...</p>
        </div>
      </div>
    );
  }

  const badge = badges.find(b => b.id === id || b._id === id);
  
  if (!badge) {
    return (
      <div className="badge-detail-page">
        <div className="badge-detail-container">
          <h1>Badge not found</h1>
          <button onClick={() => navigate('/badges')} className="back-button">
            <FaArrowLeft size={16} />
            <span>Back to Badges</span>
          </button>
        </div>
      </div>
    );
  }

  const isEarned = isBadgeUnlocked(badge, masteredMoves, moves);
  const requiredMoves = getBadgeRequiredMoves(badge, moves);
  const progress = getBadgeProgress(badge, masteredMoves, moves);
  
  // Get mastered moves for this badge
  const masteredInCategory = masteredMoves.filter(move => 
    requiredMoves.includes(move.name)
  );

  // Get tips based on badge type
  const getBadgeTips = () => {
    if (badge.name === 'Grandmaster') {
      return [
        "Focus on earning all level mastery badges first",
        "Master each level completely before moving to the next",
        "Practice consistently across all move categories",
        "Build a strong foundation with beginner and intermediate moves"
      ];
    } else if (badge.category === 'Level') {
      return [
        "Focus on mastering all moves in this level",
        "Practice regularly to build consistency",
        "Don't rush - quality over quantity",
        "Build a strong foundation for the next level"
      ];
    } else if (badge.category === 'Toprock') {
      return [
        "Focus on rhythm and musicality",
        "Practice with different tempos",
        "Learn to transition smoothly between steps",
        "Develop your own unique style"
      ];
    } else if (badge.category === 'Footwork') {
      return [
        "Master the basic steps first",
        "Focus on clean execution",
        "Practice combinations and transitions",
        "Build speed gradually"
      ];
    } else if (badge.category === 'Freezes') {
      return [
        "Build strength in your core and arms",
        "Practice balance exercises",
        "Start with easier freezes",
        "Hold positions longer each time"
      ];
    } else if (badge.category === 'Power') {
      return [
        "Build explosive strength",
        "Practice momentum and flow",
        "Master the basics before advanced moves",
        "Focus on technique over speed"
      ];
    } else if (badge.category === 'Tricks') {
      return [
        "Practice in a safe environment",
        "Master the fundamentals first",
        "Build confidence gradually",
        "Focus on clean execution"
      ];
    } else if (badge.category === 'GoDowns') {
      return [
        "Learn smooth transitions",
        "Practice control and precision",
        "Master the basic drops first",
        "Focus on flow between moves"
      ];
    }
    return [
      "Practice regularly",
      "Focus on technique",
      "Build strength gradually",
      "Stay consistent with training"
    ];
  };

  const tips = getBadgeTips();

  return (
    <div className="badge-detail-page">
      <div className="badge-detail-container">
        {/* Header */}
        <div className="badge-detail-header">
          <button onClick={() => navigate('/badges')} className="back-button">
            <FaArrowLeft size={16} />
            <span>Back to Badges</span>
          </button>
        </div>

        {/* Badge Info */}
        <div className="badge-detail-content">
          <div className="badge-hero">
            <div className="badge-icon-large">
              {badge.image && !badge.image.startsWith('🏆') && !badge.image.startsWith('🎖️') ? (
                <img src={getImageUrl(badge.image)} alt={badge.name} className="badge-image-large" />
              ) : (
                <span className="badge-emoji-large">{badge.image}</span>
              )}
              {isEarned ? (
                <div className="badge-status-earned">
                  <FaTrophy size={24} />
                  <span>Earned!</span>
                </div>
              ) : (
                <div className="badge-status-locked">
                  <FaLock size={24} />
                  <span>Locked</span>
                </div>
              )}
            </div>
            <div className="badge-info">
              <h1 className="badge-title">{badge.name}</h1>
              <p className="badge-description">{badge.description}</p>
              {isEarned && (
                <div className="badge-achievement">
                  <FaStar className="achievement-icon" />
                  <span>Congratulations! You've mastered this category!</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-header">
              <h3>Progress</h3>
              <span className="progress-percentage">{progress}% Complete</span>
            </div>
            <div className="progress-bar-large">
              <div className="progress-fill-large" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span>{masteredInCategory.length} / {requiredMoves.length} moves mastered</span>
            </div>
          </div>

          {/* Required Moves */}
          <div className="required-moves-section">
            <h3>Required Moves</h3>
            {requiredMoves.length > 0 ? (
              <div className="moves-grid">
                {requiredMoves.map((moveName) => {
                  const move = moves.find(m => m.name === moveName);
                  const isMastered = masteredMoves.some(m => m.name === moveName);
                  
                  const handleMoveClick = () => {
                    // Navigate to moves page with the specific move selected for video and its category
                    const params = new URLSearchParams();
                    if (move && move.category) params.set('category', move.category);
                    params.set('move', moveName);
                    navigate(`/moves?${params.toString()}`);
                  };
                  
                  return (
                    <div 
                      key={moveName} 
                      className={`move-card ${isMastered ? 'mastered' : 'locked'}`}
                      onClick={handleMoveClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="move-status">
                        {isMastered ? <FaCheck size={16} /> : <FaLock size={16} />}
                      </div>
                      <div className="move-info">
                        <h4 className="move-name">{moveName}</h4>
                        <p className="move-category">{move?.category} • {move?.level}</p>
                        <p className="move-xp">+{move?.xp} XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-requirements">
                <p>No specific moves required for this badge.</p>
                <p>This badge may be earned through other achievements.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
} 