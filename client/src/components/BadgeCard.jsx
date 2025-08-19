import { useNavigate } from 'react-router-dom';
import { getBadgeProgress } from '../utils/badgeUtils';
import { getImageUrl } from '../utils/imageUtils';

export default function BadgeCard({ badge, isEarned, masteredMoves = [], allMoves = [] }) {
  const navigate = useNavigate();
  
  // Calculate progress for category badges using new utilities
  const getProgress = () => {
    if (isEarned) return 100;
    return getBadgeProgress(badge, masteredMoves, allMoves);
  };

  const progress = getProgress();

  const handleClick = () => {
    navigate(`/badges/${badge._id || badge.name}`);
  };

  return (
    <div className={`badge-card ${isEarned ? 'earned' : 'locked'}`} onClick={handleClick}>
      <div className="badge-icon">
        {badge.image && !badge.image.startsWith('🏆') && !badge.image.startsWith('🎖️') ? (
          <img src={getImageUrl(badge.image)} alt={badge.name} className="badge-image" />
        ) : (
          <span className="badge-emoji">{badge.image}</span>
        )}
      </div>
      <div className="badge-info">
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-description">{badge.description}</p>
        {!isEarned && progress > 0 && (
          <div className="badge-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{progress}% Complete</span>
          </div>
        )}
      </div>
      <div className="badge-status">
        {isEarned ? (
          <span className="status-earned">✓ Earned</span>
        ) : (
          <span className="status-locked">🔒 Locked</span>
        )}
      </div>
    </div>
  );
}
