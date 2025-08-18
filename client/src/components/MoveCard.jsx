import { FaPlay } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';

export default function MoveCard({ move, onVideoSelect = () => {} }) {
  const { masteredMoves } = useProfile();
  const levelClass = `level-${move.level?.toLowerCase() || 'beginner'}`;
  
  // Check if the current user has mastered this move (use ProfileContext which stays in sync)
  const isMastered = masteredMoves?.some((m) => {
    const masteredMoveId = String(m?._id || m);
    const currentMoveId = String(move?._id || '');
    if (masteredMoveId && currentMoveId) return masteredMoveId === currentMoveId;
    // Fallback by name if ids are unavailable
    return m?.name && move?.name && m.name === move.name;
  });

  return (
    <div className="move-card">
      <div className="move-info">
        <h3 className={`moves-page-move-name ${levelClass}`}>
          {move.name}
        </h3>
        <div className="move-cat">{move.category}</div>
        <div className="move-xp">+{move.xp} XP</div>
      </div>

      <div className="move-actions">
        {isMastered && (
          <div className="mastered-check" title="Move mastered">
            <FaCheck size={14} />
          </div>
        )}
        <button
          className="video-btn"
          aria-label={`Watch ${move.name} tutorial`}
          onClick={() => onVideoSelect(move)}
        >
          <FaPlay size={14} />
        </button>
      </div>
    </div>
  );
}
