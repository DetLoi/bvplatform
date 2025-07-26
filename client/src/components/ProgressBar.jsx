export default function ProgressBar({ progress, currentXP, nextLevelXP, currentLevel }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-info">
        <span className="current-xp">{currentXP || 0} XP</span>
        <span className="next-level-xp">{nextLevelXP ? `${nextLevelXP} XP` : 'Max Level'}</span>
      </div>
    </div>
  );
}