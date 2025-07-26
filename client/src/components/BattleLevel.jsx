import { FaCrosshairs, FaCrown, FaMedal } from 'react-icons/fa';

export function BattleLevel({ battleStats = {} }) {
  // Default battle stats if none provided
  const {
    battlesWon = 0,
    battlesLost = 0,
    battlesTied = 0,
    winStreak = 0,
    bestWinStreak = 0
  } = battleStats;

  // Calculate battle level and rank
  const totalBattles = battlesWon + battlesLost + battlesTied;
  const winRate = totalBattles > 0 ? (battlesWon / totalBattles) * 100 : 0;
  
  // Battle ranking system (similar to Valorant)
  const battleRanks = [
    { name: "Unranked", minWins: 0, color: "#666" },
    { name: "Iron", minWins: 1, color: "#8B4513" },
    { name: "Bronze", minWins: 3, color: "#CD7F32" },
    { name: "Silver", minWins: 5, color: "#C0C0C0" },
    { name: "Gold", minWins: 8, color: "#FFD700" },
    { name: "Platinum", minWins: 12, color: "#E5E4E2" },
    { name: "Diamond", minWins: 16, color: "#B9F2FF" },
    { name: "Ascendant", minWins: 20, color: "#FF6B6B" },
    { name: "Immortal", minWins: 25, color: "#FFD700" },
    { name: "Radiant", minWins: 30, color: "#FF6B6B" }
  ];

  // Determine current rank
  let currentRank = battleRanks[0];
  for (let i = battleRanks.length - 1; i >= 0; i--) {
    if (battlesWon >= battleRanks[i].minWins) {
      currentRank = battleRanks[i];
      break;
    }
  }

  // Calculate progress to next rank
  const nextRank = battleRanks.find(rank => rank.minWins > battlesWon) || currentRank;
  const progressToNext = nextRank.minWins > currentRank.minWins 
    ? ((battlesWon - currentRank.minWins) / (nextRank.minWins - currentRank.minWins)) * 100
    : 100;

  return (
    <div className="battle-level">
      <div className="battle-content">
        <div className="battle-rank-display">
          <div className="rank-badge" style={{ backgroundColor: currentRank.color }}>
            <div className="rank-name">{currentRank.name}</div>
            <div className="rank-wins">{battlesWon} wins</div>
          </div>
          <div className="rank-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${progressToNext}%`,
                  backgroundColor: currentRank.color 
                }}
              />
            </div>
            <div className="progress-text">
              {nextRank.minWins - battlesWon > 0 
                ? `${nextRank.minWins - battlesWon} more wins to ${nextRank.name}`
                : "Max rank achieved!"
              }
            </div>
          </div>
        </div>
        
        <div className="battle-stats">
          <div className="stat-item">
            <FaCrown className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{battlesWon}</div>
              <div className="stat-label">Battles Won</div>
            </div>
          </div>
          
          <div className="stat-item">
            <FaMedal className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{winRate.toFixed(1)}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
          
          <div className="stat-item">
            <FaCrosshairs className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{winStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>
          </div>
        </div>
        
        <div className="battle-summary">
          <div className="summary-item">
            <span className="summary-label">Total Battles:</span>
            <span className="summary-value">{totalBattles}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Best Streak:</span>
            <span className="summary-value">{bestWinStreak}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Battles Lost:</span>
            <span className="summary-value">{battlesLost}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 