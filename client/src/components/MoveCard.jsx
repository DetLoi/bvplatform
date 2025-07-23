import { useProfile } from '../context/ProfileContext';
import { FaPlay, FaPlus, FaMinus, FaClock, FaCheck } from 'react-icons/fa';

export default function MoveCard({ move, onAdd = () => {}, onVideoSelect = () => {} }) {
  const { 
    addMasteredMove, 
    removeMasteredMove, 
    requestMoveApproval,
    masteredMoves, 
    pendingMoves 
  } = useProfile();
  
  const isMastered = masteredMoves.some((m) => m.name === move.name);
  const isPending = pendingMoves.some((m) => m.name === move.name);
  const levelClass = `level-${move.level?.toLowerCase() || 'beginner'}`;

  function handleClick() {
    if (!isMastered && !isPending) {
      requestMoveApproval(move);
      onAdd(move); // trigger toast in parent
    }
    // Removed the ability for users to remove mastered moves
    // Only admins can remove mastered moves through the admin panel
  }

  return (
    <div className="move-card">
      <div className="move-info">
        <h3 className={`move-name ${levelClass}`}>{move.name}</h3>
        <div className="move-cat">{move.category}</div>
        <div className="move-xp">+{move.xp} XP</div>
      </div>

      <div className="move-actions">
        <button
          className="video-btn"
          aria-label={`Watch ${move.name} tutorial`}
          onClick={() => onVideoSelect(move)}
        >
          <FaPlay size={14} />
        </button>

        <button
          className={`add-master-btn ${isMastered ? 'mastered' : ''} ${isPending ? 'pending' : ''}`}
          aria-label={
            isMastered ? 'Move mastered (contact admin to remove)' : 
            isPending ? 'Request pending' : 
            'Request move approval'
          }
          onClick={handleClick}
          disabled={isMastered}
        >
          {isMastered ? (
            <FaCheck size={12} />
          ) : isPending ? (
            <FaClock size={12} />
          ) : (
            <FaPlus size={12} />
          )}
        </button>
      </div>
    </div>
  );
}
