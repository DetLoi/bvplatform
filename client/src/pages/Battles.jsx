import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrosshairs, FaClock, FaCheck, FaTimes, FaVideo, FaUpload, FaTrophy, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useBattles } from '../hooks/useBattles';

export default function Battles() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [currentUserId] = useState("user1"); // In real app, get from auth context

  // Use the API hook
  const { battles, loading, error, fetchBattlesByStatus } = useBattles();

  // Filter battles by status for different tabs
  const pendingCallOuts = battles.filter(battle => battle.status === 'pending');
  const myCallOuts = battles.filter(battle => battle.status === 'accepted');
  const activeBattles = battles.filter(battle => battle.status === 'in_progress');
  const completedBattles = battles.filter(battle => battle.status === 'completed');
  const judgedBattles = battles.filter(battle => battle.status === 'judged');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffd54f';
      case 'accepted': return '#4caf50';
      case 'declined': return '#ff6b6b';
      case 'in_progress': return '#2196f3';
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
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Videos Uploaded';
      case 'judged': return 'Judged';
      default: return status;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="main-content">
        <section className="battles-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading battles...</p>
          </div>
        </section>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="main-content">
        <section className="battles-page">
          <div className="error-container">
            <p>Error loading battles: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </section>
      </div>
    );
  }

  const handleRespondToCallOut = (battleId, response) => {
    // TODO: Implement API call to respond to call out
    console.log('Respond to call out:', battleId, response);
    setSelectedBattle(null);
  };

  const handleUploadVideo = (battleId) => {
    // TODO: Implement API call to upload video
    const videoUrl = prompt("Enter video URL:");
    if (videoUrl) {
      console.log('Upload video:', battleId, videoUrl);
      setSelectedBattle(null);
    }
  };

  const renderBattleCard = (battle) => {
    const isChallenger = battle.challenger.id === currentUserId;
    const isOpponent = battle.opponent.id === currentUserId;
    const otherUser = isChallenger ? battle.opponent : battle.challenger;

    return (
      <div 
        key={battle.id} 
        className="battle-card"
        onClick={() => setSelectedBattle(battle)}
      >
        <div className="battle-header">
          <div className="battle-users">
            <div className="user-info">
              <span className="user-name">{battle.challenger.name}</span>
              <span className="user-level">{battle.challenger.level}</span>
            </div>
            <div className="vs-divider">VS</div>
            <div className="user-info">
              <span className="user-name">{battle.opponent.name}</span>
              <span className="user-level">{battle.opponent.level}</span>
            </div>
          </div>
          <div className="battle-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(battle.status) }}
            >
              {getStatusText(battle.status)}
            </span>
          </div>
        </div>
        
        <div className="battle-details">
        </div>

        {battle.status === 'accepted' && (
          <div className="battle-actions">
            <button 
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to battle room
                console.log('Navigating to battle room:', battle.id);
                navigate(`/battles/${battle.id}`);
              }}
            >
              <FaVideo /> Enter Room
            </button>
          </div>
        )}

        {battle.status === 'in_progress' && (
          <div className="battle-actions">
            {!battle.videos[isChallenger ? 'challenger' : 'opponent'] ? (
              <button 
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadVideo(battle.id);
                }}
              >
                <FaUpload /> Upload Video
              </button>
            ) : (
              <span className="video-uploaded">
                <FaCheck /> Video Uploaded
              </span>
            )}
          </div>
        )}

        {battle.status === 'judged' && (
          <div className="battle-result">
            <div className="winner-info">
              <FaTrophy />
              <span>Winner: {battle.adminReview.winner}</span>
            </div>
            {battle.adminReview.score && (
              <div className="battle-score">Score: {battle.adminReview.score}</div>
            )}
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="main-content">
      <section className="battles-page">
        <div className="battles-header">
          <h1 className="page-title">Battle Zone</h1>
          <p className="page-subtitle">Challenge other breakers and prove your skills</p>
          <button 
            className="btn-primary callout-btn"
            onClick={() => navigate('/breakers')}
          >
            <FaCrosshairs /> New Call Out
          </button>
        </div>

        <div className="battles-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaClock /> Pending ({pendingCallOuts.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my-callouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-callouts')}
          >
            <FaEye /> My Call Outs ({myCallOuts.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <FaVideo /> Active ({activeBattles.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <FaUpload /> Completed ({completedBattles.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'judged' ? 'active' : ''}`}
            onClick={() => setActiveTab('judged')}
          >
            <FaTrophy /> Judged ({judgedBattles.length})
          </button>
        </div>

        <div className="battles-grid">
          {activeTab === 'pending' && pendingCallOuts.map(renderBattleCard)}
          {activeTab === 'my-callouts' && myCallOuts.map(renderBattleCard)}
          {activeTab === 'active' && activeBattles.map(renderBattleCard)}
          {activeTab === 'completed' && completedBattles.map(renderBattleCard)}
          {activeTab === 'judged' && judgedBattles.map(renderBattleCard)}
        </div>

        {selectedBattle && (
          <div className="modal-overlay">
            <div className="modal-content battle-detail">
              <div className="modal-header">
                <h3>Battle Details</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedBattle(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="battle-detail-content">
                <div className="battle-participants">
                  <div className="participant challenger">
                    <h4>{selectedBattle.challenger.name}</h4>
                    <p>{selectedBattle.challenger.level} • {selectedBattle.challenger.crew}</p>
                  </div>
                  <div className="vs">VS</div>
                  <div className="participant opponent">
                    <h4>{selectedBattle.opponent.name}</h4>
                    <p>{selectedBattle.opponent.level} • {selectedBattle.opponent.crew}</p>
                  </div>
                </div>

                <div className="battle-info">
                  <p><strong>Category:</strong> {selectedBattle.category}</p>
                  <p><strong>Description:</strong> {selectedBattle.description}</p>
                  <p><strong>Stakes:</strong> {selectedBattle.stakes}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedBattle.status)}</p>
                </div>

                {selectedBattle.status === 'pending' && selectedBattle.opponent.id === currentUserId && (
                  <div className="battle-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleRespondToCallOut(selectedBattle.id, 'accept')}
                    >
                      <FaCheck /> Accept Challenge
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleRespondToCallOut(selectedBattle.id, 'decline')}
                    >
                      <FaTimes /> Decline
                    </button>
                  </div>
                )}

                {selectedBattle.status === 'in_progress' && (
                  <div className="video-upload-section">
                    <h4>Video Upload</h4>
                    {!selectedBattle.videos.challenger && selectedBattle.challenger.id === currentUserId && (
                      <button 
                        className="btn-primary"
                        onClick={() => handleUploadVideo(selectedBattle.id)}
                      >
                        <FaUpload /> Upload My Video
                      </button>
                    )}
                    {!selectedBattle.videos.opponent && selectedBattle.opponent.id === currentUserId && (
                      <button 
                        className="btn-primary"
                        onClick={() => handleUploadVideo(selectedBattle.id)}
                      >
                        <FaUpload /> Upload My Video
                      </button>
                    )}
                    {selectedBattle.videos.challenger && (
                      <p>Challenger video uploaded ✓</p>
                    )}
                    {selectedBattle.videos.opponent && (
                      <p>Opponent video uploaded ✓</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
} 