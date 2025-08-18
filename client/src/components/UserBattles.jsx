import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBattles } from '../hooks/useBattles';
import { useAuth } from '../context/AuthContext';
import { FaCrosshairs, FaClock, FaCheck, FaTimes, FaVideo, FaTrophy, FaEye, FaUsers, FaCrown } from 'react-icons/fa';

export function UserBattles() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { battles, loading, fetchBattlesByUser, updateBattle } = useBattles();
  const [userBattles, setUserBattles] = useState([]);
  const [selectedBattleId, setSelectedBattleId] = useState(null);
  const lastFetchedUser = useRef(null);

  useEffect(() => {
    if (currentUser?._id && !loading && lastFetchedUser.current !== currentUser._id) {
      lastFetchedUser.current = currentUser._id;
      fetchBattlesByUser(currentUser._id);
    }
  }, [currentUser?._id, fetchBattlesByUser, loading]);

  useEffect(() => {
    if (battles.length > 0 && currentUser?._id) {
      // Filter battles where current user is participant and sort by most recent
      const filteredBattles = battles
        .filter(battle => 
          battle.challenger?._id === currentUser._id || 
          battle.opponent?._id === currentUser._id
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setUserBattles(filteredBattles);
    } else if (battles.length === 0) {
      setUserBattles([]);
    }
  }, [battles, currentUser?._id]);

  const handleRespondToCallOut = async (battleId, response) => {
    try {
      const newStatus = response === 'accept' ? 'accepted' : 'declined';
      await updateBattle(battleId, { status: newStatus });
      if (currentUser?._id) {
        await fetchBattlesByUser(currentUser._id);
      }
      // If accepted, navigate to battle room
      if (response === 'accept') {
        navigate(`/battles/${battleId}`);
      }
    } catch (error) {
      console.error('Error responding to call out:', error);
      alert('Failed to respond to call out. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="ub-status__icon" />;
      case 'accepted':
        return <FaCheck className="ub-status__icon" />;
      case 'in progress':
        return <FaCrosshairs className="ub-status__icon" />;
      case 'judged':
        return <FaTrophy className="ub-status__icon" />;
      case 'completed':
        return <FaCrown className="ub-status__icon" />;
      case 'declined':
      case 'cancelled':
        return <FaTimes className="ub-status__icon" />;
      default:
        return <FaClock className="ub-status__icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending response';
      case 'accepted':
        return 'Accepted';
      case 'in progress':
        return 'In progress';
      case 'judged':
        return 'Judged';
      case 'completed':
        return 'Completed';
      case 'declined':
        return 'Declined';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusKey = (status) => {
    if (!status) return 'unknown';
    return String(status).toLowerCase().replace(/\s+/g, '-');
  };

  const getBattleResult = (battle) => {
    if (!battle.winner) return null;
    
    if (battle.winner._id === currentUser?._id) {
      return { text: 'Vundet', className: 'result-won' };
    } else {
      return { text: 'Tabt', className: 'result-lost' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US');
    }
  };

  if (loading) {
    return (
      <div className="section-card section-card--with-link">
        <div className="section-header">
          <h2 className="section-heading">My Battles</h2>
        </div>
        <div className="ub-loading">
          <div className="ub-spinner"></div>
          <p className="ub-loading-text">Loading battles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card section-card--with-link">
      <div className="section-header">
        <h2 className="section-heading">My Battles</h2>
        <button className="ub-btn ub-btn--link" onClick={() => navigate('/battles')}>View all</button>
      </div>

      {userBattles.length === 0 ? (
        <div className="no-battles-cta">
          <div className="cta-icon">🥊</div>
          <h3>No battles yet</h3>
          <p>Start your first battle and show your skills</p>
          <button className="cta-button" onClick={() => navigate('/battles')}>Find a battle</button>
        </div>
      ) : (
        <>
          {!selectedBattleId ? (
            <div className="ub-archive">
              {userBattles.map((battle) => (
                <button
                  key={battle._id}
                  className={`ub-tile status-${getStatusKey(battle.status)}`}
                  title={getStatusText(battle.status)}
                  onClick={() => setSelectedBattleId(battle._id)}
                >
                  {getStatusIcon(battle.status)}
                  <span className="ub-tile__status">{getStatusText(battle.status)}</span>
                  <span className="ub-tile__date">{formatDate(battle.createdAt)}</span>
                </button>
              ))}
            </div>
          ) : (
            (() => {
              const battle = userBattles.find(b => b._id === selectedBattleId);
              if (!battle) return null;
              const result = getBattleResult(battle);
              return (
                <div className="ub-detail">
                  <div className="ub-detail-header">
                    <div className="ub-detail-status">
                      {getStatusIcon(battle.status)}
                      <span>{getStatusText(battle.status)}</span>
                      <span className="ub-detail-date">{formatDate(battle.createdAt)}</span>
                    </div>
                  </div>
                  {(() => {
                    const isCallee = battle.status === 'pending' && (battle.opponent?._id === currentUser?._id);
                    return (
                      <div
                        className="ub-detail-body"
                        onClick={() => {
                          if (!isCallee) {
                            navigate(`/battles/${battle._id}`);
                          }
                        }}
                        role={!isCallee ? 'button' : undefined}
                        tabIndex={!isCallee ? 0 : undefined}
                        onKeyDown={(e) => {
                          if (!isCallee && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            navigate(`/battles/${battle._id}`);
                          }
                        }}
                        title={!isCallee ? 'Go to battle room' : undefined}
                      >
                    <div className="ub-detail-participants">
                      <span>{battle.challenger?.name}</span>
                      <span className="ub-detail-vs">vs</span>
                      <span>{battle.opponent?.name}</span>
                    </div>
                    {result && <div className={`ub-detail-result ${result.className}`}>{result.text}</div>}
                    <div className="ub-detail-actions">
                      {isCallee ? (
                        <>
                          <button
                            className="ub-btn ub-btn--primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRespondToCallOut(battle._id, 'accept');
                            }}
                            aria-label="Accept battle"
                            title="Accept battle"
                          >
                            <FaCheck /> Accept
                          </button>
                          <button
                            className="ub-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRespondToCallOut(battle._id, 'decline');
                            }}
                            aria-label="Decline battle"
                            title="Decline battle"
                          >
                            <FaTimes /> Decline
                          </button>
                        </>
                      ) : (
                        <button
                          className="ub-btn ub-btn--primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/battles/${battle._id}`);
                          }}
                          aria-label="Enter battle room"
                          title="Enter battle room"
                        >
                          <FaVideo /> Enter Room
                        </button>
                      )}
                      <button className="ub-btn" onClick={(e) => { e.stopPropagation(); setSelectedBattleId(null); }}>
                        Back to archive
                      </button>
                    </div>
                  </div>
                    );
                  })()}
                </div>
              );
            })()
          )}
        </>
      )}
    </div>
  );
} 