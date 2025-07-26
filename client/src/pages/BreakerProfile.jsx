import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { useMoves } from '../hooks/useMoves';
import { useBadges } from '../hooks/useBadges';
import { FaArrowLeft, FaUsers, FaTrophy, FaStar, FaCrown } from 'react-icons/fa';
import ProgressBar from '../components/ProgressBar';
import { LevelSummary } from '../components/LevelSummary';
import { BattleStatistics } from '../components/BattleStatistics';
import { isBadgeUnlocked } from '../utils/badgeUtils';
import '../styles/pages/breaker-profile.css';

export default function BreakerProfile() {
  const { breakerId } = useParams();
  const navigate = useNavigate();
  const [breaker, setBreaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use API hooks
  const { fetchUserById } = useUsers();
  const { moves: allMoves, loading: movesLoading } = useMoves({ limit: 1000 });
  const { badges, loading: badgesLoading } = useBadges();

  useEffect(() => {
    const fetchBreaker = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific user by ID
        const userData = await fetchUserById(breakerId);
        setBreaker(userData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching breaker:', err);
      } finally {
        setLoading(false);
      }
    };

    if (breakerId) {
      fetchBreaker();
    }
  }, [breakerId, fetchUserById]);

  // Show loading state while data is being fetched
  if (loading || movesLoading || badgesLoading) {
    return (
      <div className="breaker-profile-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="breaker-profile-page">
        <div className="loading">
          <h2>Error loading breaker</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/breakers')} className="back-button">
            <FaArrowLeft />
            <span>Back to Breakers</span>
          </button>
        </div>
      </div>
    );
  }

  if (!breaker) {
    return (
      <div className="breaker-profile-page">
        <div className="loading">
          <h2>Breaker not found</h2>
          <button onClick={() => navigate('/breakers')} className="back-button">
            <FaArrowLeft />
            <span>Back to Breakers</span>
          </button>
        </div>
      </div>
    );
  }

  // Calculate XP and level (using same thresholds as backend)
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  const totalXP = breaker.xp || 0;
  
  const getLevelFromXP = (xp) => {
    for (let i = xpThresholds.length - 1; i >= 0; i--) {
      if (xp >= xpThresholds[i]) return i + 1;
    }
    return 1;
  };
  
  const getNextLevelXP = (xp) => {
    const currentLevel = getLevelFromXP(xp);
    return xpThresholds[currentLevel] || null;
  };
  
  // Combined level calculation (same as backend)
  const calculateLevel = (xp, masteredMovesCount) => {
    // Base level from XP
    let xpLevel = 1;
    
    for (let i = 0; i < xpThresholds.length; i++) {
      if (xp >= xpThresholds[i]) {
        xpLevel = i + 1;
      } else {
        break;
      }
    }
    
    // Level from moves mastered (more weight on moves)
    const movesLevel = Math.min(Math.floor(masteredMovesCount / 2) + 1, 15);
    
    // Combine both factors, giving more weight to moves
    const combinedLevel = Math.round((movesLevel * 0.7) + (xpLevel * 0.3));
    
    return Math.min(Math.max(combinedLevel, 1), 15);
  };
  
  const getProgress = (xp, masteredMovesCount) => {
    const currentLevel = calculateLevel(xp, masteredMovesCount);
    const nextLevelXP = getNextLevelXP(xp);
    const currentLevelXP = currentLevel > 1 ? xpThresholds[currentLevel - 2] : 0;
    
    // Handle edge cases - cap at 99% to avoid showing 100% completion
    if (nextLevelXP === null || nextLevelXP === xp) return 99;
    if (currentLevelXP >= nextLevelXP) return 99;
    
    const totalXPNeeded = nextLevelXP - currentLevelXP;
    const xpProgress = xp - currentLevelXP;
    
    // Ensure progress is between 0 and 99 (never 100%)
    const progress = Math.max(0, Math.min(99, Math.round((xpProgress / totalXPNeeded) * 100)));
    
    return progress;
  };
  
  const level = calculateLevel(totalXP, breaker.masteredMoves?.length || 0);
  const progress = getProgress(totalXP, breaker.masteredMoves?.length || 0);

  // Calculate category summary data
  const totalByCategory = allMoves.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});
  const masteredByCategory = (breaker.masteredMoves || []).reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* Cover Photo - Outside main container */}
      <div className="cover-photo-wrapper">
        <img 
          src={breaker.coverImage || 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop'} 
          alt="Cover" 
          className="cover-photo" 
        />
      </div>

      <div className="main-content">
        <section className="moves-page">
          {/* Profile header */}
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-pic-wrapper">
                <img
                  src={breaker.profileImage || '/src/assets/placeholder.jpg'}
                  alt={breaker.name}
                  className="profile-pic"
                  onError={(e) => {
                    e.target.src = '/src/assets/placeholder.jpg';
                  }}
                />
              </div>
              <div>
                <h1 className="dashboard-title">{breaker.name}</h1>
                                 <div className="header-progress-container">
                   <p className="xp-text">Level {level}</p>
                   <ProgressBar 
                     progress={progress} 
                     currentXP={totalXP}
                     nextLevelXP={getNextLevelXP(totalXP)}
                     currentLevel={level}
                   />
                 </div>
              </div>
            </div>
            <button
              className="back-button"
              onClick={() => navigate('/breakers')}
            >
              <FaArrowLeft />
              <span>Back to Breakers</span>
            </button>
          </div>

          {/* Badges */}
          <div className="dashboard-grid mt-6">
            <div className="section-card">
              <h2 className="section-heading">Badges</h2>
              <div className="badges-wrapper">
                {breaker.badges && breaker.badges.length > 0 ? (
                  <div className="badges-row">
                    {breaker.badges.map((badge) => (
                      <div key={badge._id || badge.name} className="game-badge-minimal">
                        <div className="badge-icon">
                          {badge.image.startsWith('/src/assets/badges/') ? (
                            <img src={badge.image} alt={badge.name} className="badge-image" />
                          ) : badge.image.startsWith('/uploads/') ? (
                            <img src={`http://localhost:5000${badge.image}`} alt={badge.name} className="badge-image" />
                          ) : (
                            <span className="badge-emoji">{badge.image}</span>
                          )}
                        </div>
                        <div className="badge-title">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-badges-cta">
                    <div className="cta-icon">🏆</div>
                    <h3>No badges earned yet</h3>
                    <p>Master moves in each category to unlock prestigious badges</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Battle Statistics Section */}
          <div className="section-card mt-6">
            <BattleStatistics 
              battleStats={{
                battlesWon: 0, // TODO: Connect to actual battle data
                battlesLost: 0,
                battlesTied: 0,
                winStreak: 0,
                bestWinStreak: 0,
                totalBattles: 0
              }}
            />
          </div>

          {/* Level Summary Section */}
          <div className="section-card mt-6">
            <div className="section-header">
              <h2 className="section-heading">Foundation Progress</h2>
              <p className="section-subtitle">Track your progress by category</p>
            </div>
            <LevelSummary masteredByCategory={masteredByCategory} totalByCategory={totalByCategory} />
          </div>

          {/* Mastered Moves */}
          <div className="section-card mt-8">
            <h2 className="section-heading">Mastered Moves</h2>
            {breaker.masteredMoves && breaker.masteredMoves.length ? (
              <div className="mastered-grid">
                {breaker.masteredMoves.map((move) => (
                  <div key={move.name} className="mastered-card">
                    <h3 className={`move-name level-${move.level?.toLowerCase()}`}>{move.name}</h3>
                    <p className="move-cat">{move.category}</p>
                    <p className="move-xp">+{move.xp} XP</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No moves mastered yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
} 