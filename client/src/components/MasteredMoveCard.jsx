import React from 'react';

const MasteredMoveCard = ({ move }) => {
  return (
    <div className="mastered-card">
      <h3 className={`move-name level-${move.level?.toLowerCase()}`}>{move.name}</h3>
      <p className="move-cat">{move.category}</p>
      <p className="move-xp">+{move.xp} XP</p>
    </div>
  );
};

export default MasteredMoveCard;
