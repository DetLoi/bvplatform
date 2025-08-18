import { BattleLevel } from './BattleLevel';

export function BattleStatistics({ 
  battleStats = {}
}) {
  return (
    <div className="section-card section-card--centered-header">
      <div className="section-header">
        <h2 className="section-heading">Battle Statistics</h2>
        <p className="section-subtitle">Track your competitive progress</p>
      </div>

      <div className="bstats-body">
        <BattleLevel battleStats={battleStats} />
      </div>
    </div>
  );
} 