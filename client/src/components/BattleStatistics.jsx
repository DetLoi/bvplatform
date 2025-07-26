import { BattleLevel } from './BattleLevel';

export function BattleStatistics({ 
  battleStats = {}
}) {
  return (
    <div className="battle-statistics">
      <div className="statistics-header">
        <h2 className="statistics-title">Battle Statistics</h2>
        <p className="statistics-subtitle">Track your competitive progress</p>
      </div>
      
      <div className="statistics-content">
        <BattleLevel battleStats={battleStats} />
      </div>
    </div>
  );
} 