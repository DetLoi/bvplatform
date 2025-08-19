import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { getImageUrl } from '../utils/imageUtils';
import { useBattles } from '../hooks/useBattles';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaFilter, FaUsers, FaCrosshairs, FaUserTimes, FaCrown, FaStar, FaClock, FaTimes, FaVideo } from 'react-icons/fa';
import '../styles/pages/breakers.css';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

export default function Breakers() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState('level');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [callOuts, setCallOuts] = useState(new Set());
  const [loadingStates, setLoadingStates] = useState({});
  const [hoveredBreaker, setHoveredBreaker] = useState(null);

  // Fetch real data from database
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const { createBattle, battles, fetchBattlesByUser, updateBattle } = useBattles();

  // Get all breakers from database - show each user individually
  const allBreakers = useMemo(() => {
    if (usersLoading) return [];
    
    return users
      .filter(user => user && user._id && (!currentUser || user._id !== currentUser._id))
      .map(user => {
      return {
        id: user._id,
        name: user.name,
        username: user.username,
        profileImage: getImageUrl(user.profileImage) || '/assets/User.jpg',
        level: user.level,
        xp: user.xp,
        status: user.status
      };
      });
  }, [users, usersLoading, currentUser]);

  // Get pending battles for current user
  const pendingBattles = useMemo(() => {
    if (!currentUser || !battles) return [];
    
    const pending = battles.filter(battle => {
      const isChallenger = battle.challenger === currentUser._id || (battle.challenger && battle.challenger._id === currentUser._id);
      const isPending = battle.status === 'pending';
      const isNotCancelled = battle.status !== 'cancelled';
      return isChallenger && isPending && isNotCancelled;
    });
    
    return pending;
  }, [battles, currentUser]);

  // Get active battles for current user
  const activeBattles = useMemo(() => {
    if (!currentUser || !battles) return [];
    
    const active = battles.filter(battle => {
      const isParticipant = (battle.challenger === currentUser._id || (battle.challenger && battle.challenger._id === currentUser._id)) ||
                           (battle.opponent === currentUser._id || (battle.opponent && battle.opponent._id === currentUser._id));
      const isActive = battle.status === 'in progress';
      return isParticipant && isActive;
    });
    
    return active;
  }, [battles, currentUser]);

  // Check if a breaker has a pending call-out from current user
  const hasPendingCallOut = (breakerId) => {
    const hasPending = pendingBattles.some(battle => {
      const isOpponent = battle.opponent === breakerId || (battle.opponent && battle.opponent._id === breakerId);
      const isNotCancelled = battle.status !== 'cancelled';
      return isOpponent && isNotCancelled;
    });
    return hasPending;
  };

  // Check if a breaker has an active battle with current user
  const hasActiveBattle = (breakerId) => {
    const hasActive = activeBattles.some(battle => {
      const isOpponent = battle.opponent === breakerId || (battle.opponent && battle.opponent._id === breakerId);
      const isChallenger = battle.challenger === breakerId || (battle.challenger && battle.challenger._id === breakerId);
      return isOpponent || isChallenger;
    });
    return hasActive;
  };

  // Check if current user has been challenged by this breaker
  const hasBeenChallenged = (breakerId) => {
    const hasChallenged = battles.some(battle => {
      const isChallenger = battle.challenger === breakerId || (battle.challenger && battle.challenger._id === breakerId);
      const isOpponent = battle.opponent === currentUser._id || (battle.opponent && battle.opponent._id === currentUser._id);
      const isPending = battle.status === 'pending';
      return isChallenger && isOpponent && isPending;
    });
    return hasChallenged;
  };

  // Get battle ID for a specific opponent
  const getBattleId = (opponentId) => {
    const battle = pendingBattles.find(battle => 
      battle.opponent === opponentId || (battle.opponent && battle.opponent._id === opponentId)
    );
    return battle?._id;
  };

  // Get active battle ID for a specific opponent
  const getActiveBattleId = (opponentId) => {
    const battle = activeBattles.find(battle => {
      const isOpponent = battle.opponent === opponentId || (battle.opponent && battle.opponent._id === opponentId);
      const isChallenger = battle.challenger === opponentId || (battle.challenger && battle.challenger._id === opponentId);
      return isOpponent || isChallenger;
    });
    return battle?._id;
  };

  // Filter and sort breakers
  const filteredBreakers = useMemo(() => {
    let filtered = allBreakers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(breaker => 
        breaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breaker.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort breakers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.level - a.level;
      }
    });

    return filtered;
  }, [allBreakers, searchTerm, sortBy]);

  const handleCallOut = async (breakerId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking call out button
    
    if (!currentUser) {
      alert('Please log in to send a call out');
      return;
    }

    if (currentUser._id === breakerId) {
      alert('You cannot call out yourself');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [breakerId]: true }));
      
      // Create a new battle
      const battleData = {
        challenger: currentUser._id,
        opponent: breakerId,
        status: 'pending',
        title: `${currentUser.name} vs ${allBreakers.find(b => b.id === breakerId)?.name}`,
        description: `${currentUser.name} has challenged you to a battle!`,
        category: '1v1'
      };

      await createBattle(battleData);
      
      // Refresh battles to get the new pending battle
      await fetchBattlesByUser(currentUser._id);
      
      console.log(`Call out sent to breaker: ${breakerId}`);
    } catch (error) {
      console.error('Error sending call out:', error);
      alert('Failed to send call out. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [breakerId]: false }));
    }
  };

  const handleCancelCallOut = async (breakerId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking cancel button
    
    const battleId = getBattleId(breakerId);
    if (!battleId) {
      console.error('No pending battle found for this breaker');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, [breakerId]: true }));
      
      // Update battle status to 'cancelled' (which properly cancels it)
      await updateBattle(battleId, { status: 'cancelled' });
      
      // Refresh battles
      await fetchBattlesByUser(currentUser._id);
      
      console.log(`Call out cancelled for breaker: ${breakerId}`);
    } catch (error) {
      console.error('Error cancelling call out:', error);
      alert('Failed to cancel call out. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [breakerId]: false }));
    }
  };

  const handleCardClick = (breakerId) => {
    navigate(`/breakers/${breakerId}`);
  };

  const getLevelIcon = (level) => {
    if (level >= 8) return <FaCrown className="level-icon crown" />;
    if (level >= 6) return <FaStar className="level-icon star" />;
    return <FaStar className="level-icon" />;
  };



  const sortOptions = [
    { value: 'level', label: 'Level' },
    { value: 'name', label: 'Name' },

  ];

  // Fetch battles for current user when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchBattlesByUser(currentUser._id);
    }
  }, [currentUser, fetchBattlesByUser]);

  // Observe cards for scroll-based reveal (must be before any early returns)
  const observe = useIntersectionReveal({ threshold: 0.15 });

  // Show loading state
  if (usersLoading) {
    return (
      <div className="main-content fullpage-loading">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading breakers...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (usersError) {
    return (
      <div className="main-content fullpage-loading">
        <div className="error-state">
          <p>Error loading breakers: {usersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="breakers-page">

      {/* Controls Section */}
      <div className="controls-section">
        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search breakers by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="breakers-search-input"
          />
        </div>

        <div className="filter-item">
          <label>Sort by</label>
          {/* Custom select to allow full styling of options across browsers */}
          <div
            className={`custom-select ${isSortMenuOpen ? 'open' : ''}`}
            tabIndex={0}
            onClick={() => setIsSortMenuOpen((prev) => !prev)}
            onBlur={() => setIsSortMenuOpen(false)}
            aria-haspopup="listbox"
            aria-expanded={isSortMenuOpen}
            role="combobox"
          >
            <div className="custom-select__trigger">
              <span className="custom-select__label">
                {sortOptions.find((o) => o.value === sortBy)?.label || 'Level'}
              </span>
              <span className="custom-select__chevron" aria-hidden="true" />
            </div>
            <ul className="custom-select__menu" role="listbox">
              {sortOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={sortBy === option.value}
                  className={`custom-select__option ${sortBy === option.value ? 'active' : ''}`}
                  onMouseDown={(e) => {
                    // prevent blur before click handler
                    e.preventDefault();
                    setSortBy(option.value);
                    setIsSortMenuOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="results-count">
          <FaUsers />
          <span>{filteredBreakers.length} breakers found</span>
        </div>
      </div>

      {/* Breakers Grid */}
      <div className="breakers-container">
        <div className="breakers-grid">
          {filteredBreakers.map((breaker) => {
            const hasPending = hasPendingCallOut(breaker.id);
            const hasActive = hasActiveBattle(breaker.id);
            const isChallenged = hasBeenChallenged(breaker.id);
            const isHovered = hoveredBreaker === breaker.id;
            
            return (
              <div 
                key={breaker.id} 
                className="breaker-card reveal-on-scroll"
                ref={observe}
                onClick={() => handleCardClick(breaker.id)}
                onMouseEnter={() => setHoveredBreaker(breaker.id)}
                onMouseLeave={() => setHoveredBreaker(null)}
              >
                <div className="card-header">
                  <div className="breaker-info">
                    <div className="avatar-container">
                      <img
                        src={breaker.profileImage}
                        alt={breaker.name}
                        className="breaker-avatar"
                                                 onError={(e) => {
                           e.target.src = '/assets/User.jpg';
                         }}
                      />
                    </div>
                    
                    <div className="breaker-details">
                      {getLevelIcon(breaker.level)}
                      <h3 className="breaker-name">{breaker.name}</h3>
                      <div className="breaker-level">
                        <span className="level-text">Level {breaker.level}</span>
                      </div>

                    </div>
                  </div>

                  {/* Only show call out button if not the current user */}
                  {currentUser && currentUser._id !== breaker.id && (
                    <div className="action-button">
                      {isChallenged ? (
                        <div className="challenged-container">
                          <button
                            className="btn-challenged"
                            disabled={loadingStates[breaker.id]}
                            title="You have been challenged"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from triggering
                              navigate('/battles?tab=pending');
                            }}
                          >
                            <FaCrosshairs />
                            <span>Challenged You</span>
                          </button>
                        </div>
                      ) : hasActive ? (
                        <div className="active-battle-container">
                          <button
                            className="btn-active-battle"
                            disabled={loadingStates[breaker.id]}
                            title="Ongoing battle"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from triggering
                              const battleId = getActiveBattleId(breaker.id);
                              if (battleId) {
                                navigate(`/battles/${battleId}`);
                              } else {
                                navigate('/battles?tab=active');
                              }
                            }}
                          >
                            <FaVideo />
                            <span>Ongoing Battle</span>
                          </button>
                        </div>
                      ) : hasPending ? (
                        <div className="pending-callout-container">
                          <button
                            className="btn-pending"
                            disabled={loadingStates[breaker.id]}
                            title="Awaiting approval"
                          >
                            <FaClock />
                            <span>Awaiting Approval</span>
                          </button>
                          {isHovered && (
                            <button
                              className="btn-cancel"
                              onClick={(e) => handleCancelCallOut(breaker.id, e)}
                              title="Cancel call out"
                              disabled={loadingStates[breaker.id]}
                            >
                              <FaTimes />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          className="btn-callout"
                          onClick={(e) => handleCallOut(breaker.id, e)}
                          title="Send call out"
                          disabled={loadingStates[breaker.id]}
                        >
                          <FaCrosshairs />
                          <span>{loadingStates[breaker.id] ? 'Sending...' : 'Call out'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredBreakers.length === 0 && (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No breakers found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 