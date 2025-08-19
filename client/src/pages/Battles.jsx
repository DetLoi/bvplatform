import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCrosshairs, FaClock, FaCheck, FaTimes, FaVideo, FaTrophy, FaEye, FaCheckCircle, FaTimesCircle, FaGamepad, FaUsers, FaCrown, FaFire, FaGlobe, FaStar, FaUpload } from 'react-icons/fa';
import { useBattles } from '../hooks/useBattles';
import { useAuth } from '../context/AuthContext';
import introVideo from '../assets/blackstingerbg.mp4';

export default function Battles() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Video intro state
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  
  // Get initial tab from URL parameters
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    const validTabs = ['overview', 'in-progress', 'judged'];
    return validTabs.includes(tabParam) ? tabParam : 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [respondingBattle, setRespondingBattle] = useState(null);

  // Use the API hook
  const { battles, loading, error, fetchBattlesByUser, updateBattle, refreshBattles } = useBattles();

  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Reveal background immediately and then slide in UI after fade completes
    setBgVisible(true);
    setShowVideoIntro(false);
    setTimeout(() => setUiVisible(true), 700);
  };

  // Skip video intro (disabled - no skip button)

  // Fetch battles for current user when component mounts or user changes
  useEffect(() => {
    if (currentUser?._id) {
      fetchBattlesByUser(currentUser._id);
    }
  }, [currentUser, fetchBattlesByUser]);

  // Update URL when tab changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (activeTab === 'overview') {
      urlParams.delete('tab');
    } else {
      urlParams.set('tab', activeTab);
    }
    const newUrl = `${location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    navigate(newUrl, { replace: true });
  }, [activeTab, location.pathname, navigate]);

  // Filter battles by status for different tabs - show all battles
  const pendingCallOuts = battles.filter(battle => 
    battle.status === 'pending' && 
    battle.status !== 'cancelled' &&
    (battle.opponent && battle.opponent._id === currentUser?._id || battle.opponent === currentUser?._id)
  );
  const myCallOuts = battles.filter(battle => 
    battle.status === 'pending' && 
    battle.status !== 'cancelled' &&
    (battle.challenger && battle.challenger._id === currentUser?._id || battle.challenger === currentUser?._id)
  );
  const activeBattles = battles.filter(battle => battle.status === 'in progress');
  const completedBattles = battles.filter(battle => battle.status === 'completed');
  const judgedBattles = battles.filter(battle => battle.status === 'judged');

  // Combined set for the single "In Progress" tab (includes pending, my call outs, in progress and completed)
  const inProgressCombined = [
    ...pendingCallOuts,
    ...myCallOuts,
    ...activeBattles,
    ...completedBattles,
  ];

  // All battles for overview - show all battles
  const allBattles = battles.filter(battle => 
    battle.status !== 'cancelled' && 
    battle.status !== 'declined'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffd54f';
      case 'accepted': return '#4caf50';
      case 'declined': return '#ff6b6b';
      case 'cancelled': return '#ff6b6b';
             case 'in progress': return '#2196f3';
      case 'completed': return '#9c27b0';
      case 'judged': return '#ff9800';
      default: return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Awaiting Response';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'cancelled': return 'Cancelled';
      case 'in progress': return 'In Progress';
      case 'completed': return 'Ready for Judging';
      case 'judged': return 'Judged';
      default: return status;
    }
  };

  const handleRespondToCallOut = async (battleId, response) => {
    try {
      setRespondingBattle(battleId);
      const newStatus = response === 'accept' ? 'accepted' : 'declined';
      await updateBattle(battleId, { status: newStatus });
      
      // Refresh battles data to ensure populated user information is displayed
      if (currentUser?._id) {
        await fetchBattlesByUser(currentUser._id);
      }
      
      setSelectedBattle(null);
      
      // If accepted, navigate directly to battle room
      if (response === 'accept') {
        navigate(`/battles/${battleId}`);
      }
    } catch (error) {
      console.error('Error responding to call out:', error);
      alert('Failed to respond to call out. Please try again.');
    } finally {
      setRespondingBattle(null);
    }
  };



  const renderBattleCard = (battle) => {
    const isChallenger = (battle.challenger && battle.challenger._id === currentUser?._id) || battle.challenger === currentUser?._id;
    const isOpponent = (battle.opponent && battle.opponent._id === currentUser?._id) || battle.opponent === currentUser?._id;
    const isParticipant = isChallenger || isOpponent;
    const isJudge = currentUser?.roles?.includes('judge');
    const isCallee = isOpponent && battle.status === 'pending';
    const otherUser = isChallenger ? battle.opponent : battle.challenger;

    return (
      <div 
        key={battle._id} 
        className="battles-game-card"
        onClick={() => {
          // Only open modal if no action buttons are present
          if (!isCallee && battle.status !== 'in progress' && battle.status !== 'completed' && battle.status !== 'judged') {
            setSelectedBattle(battle);
          }
        }}
      >
        <div className="battles-card-header">
          <div className="battles-users">
            <div className="battles-user-info">
              <span className="battles-user-name">{battle.challenger.name}</span>
              <span className="battles-user-level">{battle.challenger.level}</span>
            </div>
            <div className="battles-vs-divider">VS</div>
            <div className="battles-user-info">
              <span className="battles-user-name">{battle.opponent.name}</span>
              <span className="battles-user-level">{battle.opponent.level}</span>
            </div>
          </div>
          <div className="battles-status">
            <span 
              className="battles-status-badge"
              style={{ 
                backgroundColor: getStatusColor(battle.status),
                color: battle.status === 'completed' ? '#ffffff' : '#000'
              }}
            >
              {getStatusText(battle.status)}
            </span>
          </div>
        </div>
        
        <div className="battles-card-details">
          {isCallee && (
            <div className="battles-callout-message">
              <p className="battles-callout-text">
                <strong>{battle.challenger.name}</strong> has challenged you to a battle!
              </p>
              <span className="battles-callout-time">
                {new Date(battle.createdAt).toLocaleDateString()} at {new Date(battle.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )}
          {isChallenger && battle.status === 'pending' && (
            <div className="battles-callout-message">
              <p className="battles-callout-text">
                You have challenged <strong>{battle.opponent.name}</strong> to a battle!
              </p>
              <span className="battles-callout-time">
                {new Date(battle.createdAt).toLocaleDateString()} at {new Date(battle.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )}
          {!isCallee && !isChallenger && !isParticipant && !isJudge && (
            <div className="battles-spectator-message">
              <p className="battles-spectator-text">
                <strong>Spectating:</strong> Watch this battle between {battle.challenger.name} and {battle.opponent.name}
              </p>
              <span className="battles-spectator-time">
                {new Date(battle.createdAt).toLocaleDateString()} at {new Date(battle.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )}

          {!isCallee && !isChallenger && isParticipant && battle.description && (
            <p className="battles-description">{battle.description}</p>
          )}
        </div>

        {/* Show Accept/Decline buttons directly on card for callee */}
        {isCallee && (
          <div className="battles-card-actions">
            <button 
              className="battles-btn-accept"
              disabled={respondingBattle === battle._id}
              onClick={(e) => {
                e.stopPropagation();
                handleRespondToCallOut(battle._id, 'accept');
              }}
            >
              <FaCheck /> {respondingBattle === battle._id ? 'Accepting...' : 'Accept'}
            </button>
            <button 
              className="battles-btn-decline"
              disabled={respondingBattle === battle._id}
              onClick={(e) => {
                e.stopPropagation();
                handleRespondToCallOut(battle._id, 'decline');
              }}
            >
              <FaTimes /> {respondingBattle === battle._id ? 'Declining...' : 'Decline'}
            </button>
          </div>
        )}

        {battle.status === 'in progress' && (
          <div className="battles-card-actions">
            {isParticipant ? (
              <button 
                className="battles-btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to battle room
                  console.log('Navigating to battle room:', battle._id);
                  navigate(`/battles/${battle._id}`);
                }}
              >
                <FaVideo /> Enter Room
              </button>
            ) : (
              <div className="battles-card-message">
                <span>Battle in progress - You can watch battle when it's ready</span>
              </div>
            )}
          </div>
        )}

                 {/* Room Access for Completed Battles */}
         {battle.status === 'completed' && !battle.judgingDone && (
           <div className="battles-card-actions">
             {isJudge ? (
                               <button 
                  className="battles-btn-judge"
                  style={{ color: '#ffffff' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to judge room
                    console.log('Navigating to judge room:', battle._id);
                    navigate(`/battles/${battle._id}`);
                  }}
                >
                  <FaTrophy /> Enter Judge Room
                </button>
             ) : (
               <button 
                 className="battles-btn-secondary"
                 onClick={(e) => {
                   e.stopPropagation();
                   // Navigate to battle room to watch videos
                   console.log('Navigating to watch completed battle:', battle._id);
                   navigate(`/battles/${battle._id}`);
                 }}
               >
                 <FaEye /> Watch Battle
               </button>
             )}
           </div>
         )}

        {/* View Details for battles without action buttons */}
        {!isCallee && battle.status !== 'in progress' && battle.status !== 'completed' && battle.status !== 'judged' && (
          <div className="battles-card-actions">
            <button 
              className="battles-btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBattle(battle);
              }}
            >
              <FaEye /> View Details
            </button>
          </div>
        )}

                 {/* Judged Battle Results */}
         {battle.status === 'judged' && (
           <div className="battles-card-results">
             {battle.winner ? (
               <div className="battles-winner-info">
                                   <div className="battles-winner-badge">
                    <FaCrown />
                    <span>Winner: {battle.winner ? battle.winner.name : 'Draw'}</span>
                  </div>
                 {battle.votes && battle.votes.length > 0 && (
                   <div className="battles-vote-summary">
                     <span>Votes: {battle.votes.length}/5 categories judged</span>
                   </div>
                 )}
               </div>
             ) : (
               <div className="battles-draw-info">
                 <div className="battles-draw-badge">
                   <FaStar />
                   <span>Result: Draw</span>
                 </div>
                 {battle.votes && battle.votes.length > 0 && (
                   <div className="battles-vote-summary">
                     <span>Votes: {battle.votes.length}/5 categories judged</span>
                   </div>
                 )}
               </div>
             )}
             
             {/* Always show voting summary for judged battles */}
             {battle.votes && battle.votes.length > 0 && (
               <div className="battles-vote-summary">
                 <span>Total Votes: {battle.votes.length}/5 categories judged</span>
               </div>
             )}
            <div className="battles-card-actions">
              <button 
                className="battles-btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/battles/${battle._id}`);
                }}
              >
                <FaEye /> Watch Battle
              </button>
              <button 
                className="battles-btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBattle(battle);
                }}
              >
                <FaEye /> View Details
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const shouldShowPageLoader = loading && !showVideoIntro;
  const shouldShowError = !!error && !showVideoIntro;

  return (
    <>
      {/* Video Intro Overlay */}
      {showVideoIntro && (
        <div className="battles-video-intro-overlay">
          <video
            className="battles-video-intro"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            onError={() => setShowVideoIntro(false)}
          >
            <source src={introVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className={`battles-main-wrapper ${bgVisible ? 'battles-bg-visible' : ''} ${uiVisible ? 'battles-ui-visible' : ''}`}>
        <div className="battles-game-room">
        {/* Left Sidebar Panel */}
        <div className="battles-sidebar">
          <div className="battles-sidebar-tabs">
            <button 
              className={`battles-sidebar-tab ${activeTab === 'overview' ? 'battles-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaGlobe />
              <div className="battles-tab-content">
                <span className="battles-tab-title">Overview</span>
              </div>
              <span className="battles-tab-count">{allBattles.length}</span>
            </button>

            <button 
              className={`battles-sidebar-tab ${activeTab === 'in-progress' ? 'battles-active' : ''}`}
              onClick={() => setActiveTab('in-progress')}
            >
              <FaVideo />
              <div className="battles-tab-content">
                <span className="battles-tab-title">In Progress</span>
              </div>
              <span className="battles-tab-count">{inProgressCombined.length}</span>
            </button>
            
            <button 
              className={`battles-sidebar-tab ${activeTab === 'judged' ? 'battles-active' : ''}`}
              onClick={() => setActiveTab('judged')}
            >
              <FaTrophy />
              <div className="battles-tab-content">
                <span className="battles-tab-title">Judged</span>
              </div>
              <span className="battles-tab-count">{judgedBattles.length}</span>
            </button>
          </div>

          <div className="battles-sidebar-footer">
            <button 
              className="battles-new-battle-btn"
              onClick={() => navigate('/breakers')}
            >
              <FaCrosshairs /> New Call Out
            </button>
          </div>
        </div>

        {/* Mobile Call Out Button */}
        <button 
          className="battles-mobile-callout-btn"
          onClick={() => navigate('/breakers')}
        >
          <FaCrosshairs />
          <span className="battles-mobile-callout-text">New Call Out</span>
        </button>

        {/* Main Content Area */}
        <div className="battles-main-content">
          <div className="battles-content">
            {shouldShowError && (
              <div className="battles-error-container">
                <p>Error loading battles: {error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
            )}

            {shouldShowPageLoader && (
              <div className="battles-loading-container">
                <div className="battles-loading-spinner"></div>
                <p>Loading battles...</p>
              </div>
            )}

            {!shouldShowPageLoader && !shouldShowError && (
              <div className="battles-grid">
              {activeTab === 'overview' && allBattles.map(renderBattleCard)}
              {activeTab === 'in-progress' && inProgressCombined.map(renderBattleCard)}
              {activeTab === 'judged' && judgedBattles.map(renderBattleCard)}
              </div>
            )}

            {/* Empty state */}
            {!shouldShowPageLoader && !shouldShowError && ((activeTab === 'overview' && allBattles.length === 0) ||
              (activeTab === 'pending' && pendingCallOuts.length === 0) ||
              (activeTab === 'my-callouts' && myCallOuts.length === 0) ||
              (activeTab === 'active' && activeBattles.length === 0) ||
              (activeTab === 'completed' && completedBattles.length === 0) ||
              (activeTab === 'judged' && judgedBattles.length === 0)) && (
              <div className="battles-empty-state">
                <img 
                  src="/assets/breakKidCropped.png" 
                  alt="Empty State Icon" 
                  className="battles-empty-icon" 
                />
                <h3>No battles found</h3>
                <p>Start a new battle to see it here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Battle Detail Modal */}
      {selectedBattle && (
        <div className="battles-modal-overlay" onClick={() => setSelectedBattle(null)}>
          <div className="battles-modal" onClick={(e) => e.stopPropagation()}>
            <div className="battles-modal-header">
              <h2 className="battles-modal-title">Battle Details</h2>
              <button 
                className="battles-modal-close"
                onClick={() => setSelectedBattle(null)}
              >
                ×
              </button>
            </div>

            <div className="battles-modal-content">
              <div className="battles-modal-battle-info">
                {selectedBattle.status === 'judged' ? (
                  // Show winner and voting summary for judged battles
                  <div className="battles-modal-judged-results">
                    {selectedBattle.winner ? (
                      <div className="battles-modal-winner-section">
                        <div className="battles-modal-winner-badge">
                          <FaCrown />
                          <h3>Winner: {selectedBattle.winner.name}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="battles-modal-draw-section">
                        <div className="battles-modal-draw-badge">
                          <FaStar />
                          <h3>Result: Draw</h3>
                        </div>
                      </div>
                    )}
                    
                    {/* Voting Summary */}
                    {selectedBattle.votes && selectedBattle.votes.length > 0 && (
                      <div className="battles-modal-voting-summary">
                        <h4>Voting Summary</h4>
                        <div className="battles-modal-vote-categories">
                          {selectedBattle.votes.map((vote, index) => (
                            <div key={index} className="battles-modal-vote-category">
                              <span className="battles-modal-category-name">{vote.category}</span>
                              <div className="battles-modal-vote-scores">
                                <span className="battles-modal-vote-score">
                                  {selectedBattle.challenger.name}: {vote.scoreA}
                                </span>
                                <span className="battles-modal-vote-score">
                                  {selectedBattle.opponent.name}: {vote.scoreB}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="battles-modal-total-votes">
                          <span>Total Votes: {selectedBattle.votes.length}/5 categories judged</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Show regular battle details for non-judged battles
                  <>
                    <div className="battles-modal-participants">
                      <div className="battles-modal-participant">
                        <h3>{selectedBattle.challenger.name}</h3>
                        <p>Level {selectedBattle.challenger.level}</p>
                      </div>
                      <div className="battles-modal-vs">VS</div>
                      <div className="battles-modal-participant">
                        <h3>{selectedBattle.opponent.name}</h3>
                        <p>Level {selectedBattle.opponent.level}</p>
                      </div>
                    </div>

                    <div className="battles-modal-status">
                      <span 
                        className="battles-modal-status-badge"
                        style={{ backgroundColor: getStatusColor(selectedBattle.status) }}
                      >
                        {getStatusText(selectedBattle.status)}
                      </span>
                    </div>

                                         {(selectedBattle.status === 'pending' || selectedBattle.status === 'accepted') ? (
                       <p className="battles-modal-description">
                         {(
                           (selectedBattle.opponent && selectedBattle.opponent._id === currentUser?._id) ||
                           selectedBattle.opponent === currentUser?._id
                         ) ? (
                           <>
                             <strong>{selectedBattle.challenger.name}</strong> has challenged you to a battle!
                           </>
                         ) : (
                           (
                             (selectedBattle.challenger && selectedBattle.challenger._id === currentUser?._id) ||
                             selectedBattle.challenger === currentUser?._id
                           ) ? (
                            <>
                              You have challenged <strong>{selectedBattle.opponent.name}</strong> to a battle!
                            </>
                          ) : (
                            <>
                              <strong>{selectedBattle.challenger.name}</strong> has challenged <strong>{selectedBattle.opponent.name}</strong> to a battle!
                            </>
                          )
                        )}
                      </p>
                    ) : (
                      selectedBattle.description && (
                        <p className="battles-modal-description">{selectedBattle.description}</p>
                      )
                    )}
                  </>
                )}

                                 {selectedBattle.status === 'pending' && ((selectedBattle.opponent && selectedBattle.opponent._id === currentUser?._id) || selectedBattle.opponent === currentUser?._id) && (
                  <div className="battles-actions">
                    <button 
                      className="battles-btn-primary"
                      onClick={() => handleRespondToCallOut(selectedBattle._id, 'accept')}
                    >
                      <FaCheck /> Accept Challenge
                    </button>
                    <button 
                      className="battles-btn-secondary"
                      onClick={() => handleRespondToCallOut(selectedBattle._id, 'decline')}
                    >
                      <FaTimes /> Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 