import { FaCrosshairs, FaCrown, FaMedal } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

export function BattleLevel({ battleStats = {} }) {
  // Default battle stats if none provided
  const {
    battlesWon = 0,
    battlesLost = 0,
    battlesTied = 0,
    winStreak = 0,
    bestWinStreak = 0,
    battleLevel = 1,
    battleXP = 0
  } = battleStats;

  // Calculate battle level and rank
  const totalBattles = battlesWon + battlesLost + battlesTied;
  const winRate = totalBattles > 0 ? (battlesWon / totalBattles) * 100 : 0;
  
  // Battle ranking system based on battle level (1 level per 100 XP)
  const battleRanks = [
    { name: "Unranked", minLevel: 1, color: "#666" },
    { name: "Iron", minLevel: 2, color: "#8B4513" },
    { name: "Bronze", minLevel: 3, color: "#CD7F32" },
    { name: "Silver", minLevel: 5, color: "#C0C0C0" },
    { name: "Gold", minLevel: 8, color: "#FFD700" },
    { name: "Platinum", minLevel: 12, color: "#E5E4E2" },
    { name: "Diamond", minLevel: 16, color: "#B9F2FF" },
    { name: "Ascendant", minLevel: 20, color: "#FF6B6B" },
    { name: "Immortal", minLevel: 25, color: "#FFD700" },
    { name: "Radiant", minLevel: 30, color: "#FF6B6B" }
  ];

  // Determine current rank based on battle level
  let currentRank = battleRanks[0];
  for (let i = battleRanks.length - 1; i >= 0; i--) {
    if (battleLevel >= battleRanks[i].minLevel) {
      currentRank = battleRanks[i];
      break;
    }
  }

  // Calculate progress to next rank
  const nextRank = battleRanks.find(rank => rank.minLevel > battleLevel) || currentRank;
  const progressToNext = nextRank.minLevel > currentRank.minLevel 
    ? ((battleLevel - currentRank.minLevel) / (nextRank.minLevel - currentRank.minLevel)) * 100
    : 100;

  // Calculate battle XP progress (1 level per 100 XP)
  const currentLevelXP = (battleLevel - 1) * 100;
  const nextLevelXP = battleLevel * 100;
  const xpProgress = battleXP - currentLevelXP;
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  const battleProgress = totalXPNeeded > 0 ? Math.min(100, Math.round((xpProgress / totalXPNeeded) * 100)) : 100;

  return (
    <div className="bstats-level">
      <div className="bstats-content">
        {/* Battle XP Progress Bar */}
        <div className="bstats-progress-section">
          <div className="bstats-progress-header">
            <h3 className="bstats-progress-title">Battle Level {battleLevel}</h3>
            <p className="bstats-progress-subtitle">{currentRank.name} Rank</p>
          </div>
          <ProgressBar 
            progress={battleProgress}
            currentXP={battleXP}
            nextLevelXP={nextLevelXP}
            currentLevel={battleLevel}
          />
        </div>
        
        <div className="bstats-metrics">
          <div className="bstats-metric">
            <div className="bstats-info">
              <div className="bstats-value">{battleXP}</div>
              <div className="bstats-label">Battle XP</div>
            </div>
            <FaCrown className="bstats-icon" />
          </div>

          <div className="bstats-metric">
            <div className="bstats-info">
              <div className="bstats-value">{winRate.toFixed(1)}%</div>
              <div className="bstats-label">Win Rate</div>
            </div>
            <FaMedal className="bstats-icon" />
          </div>

          <div className="bstats-metric">
            <div className="bstats-info">
              <div className="bstats-value">{winStreak}</div>
              <div className="bstats-label">Current Streak</div>
            </div>
            <FaCrosshairs className="bstats-icon" />
          </div>
        </div>
        
        <div className="bstats-summary">
          <div className="bstats-summary-item">
            <span className="bstats-summary-label">Total Battles</span>
            <span className="bstats-summary-value">{totalBattles}</span>
          </div>
          <div className="bstats-summary-item">
            <span className="bstats-summary-label">Battles Won</span>
            <span className="bstats-summary-value">{battlesWon}</span>
          </div>
          <div className="bstats-summary-item">
            <span className="bstats-summary-label">Battles Lost</span>
            <span className="bstats-summary-value">{battlesLost}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 