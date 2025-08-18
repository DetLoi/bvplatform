import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaVideo, FaUpload, FaFire, FaUsers, FaClock, FaCrown, FaStar, FaCheckCircle, FaExclamationTriangle, FaTrophy, FaLock, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { battlesAPI } from '../services/api';
import '../styles/pages/battle-room.css';

export default function BattleRoom() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [battle, setBattle] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [takenSeats, setTakenSeats] = useState({});
  const [judgeVotes, setJudgeVotes] = useState([]);

  // Determine user role and upload status
  const isChallenger = battle && currentUser && battle.challenger._id === currentUser._id;
  const isOpponent = battle && currentUser && battle.opponent._id === currentUser._id;
  const isParticipant = isChallenger || isOpponent;
  const isJudge = currentUser?.roles?.includes('judge');
  const canSeePrivacy = isParticipant || isAdmin?.();
  
  const hasUploaded = isChallenger ? battle?.videos?.challenger : battle?.videos?.opponent;
  const opponentUploaded = isChallenger ? battle?.videos?.opponent : battle?.videos?.challenger;
  const bothUploaded = hasUploaded && opponentUploaded;
  
  // Helper functions for battle state
  const isBattleCompleted = (battle) => {
    return battle?.videos?.challenger && battle?.videos?.opponent;
  };

  const isBattleJudged = (battle) => {
    return battle?.status === 'judged';
  };

  const isBattleInProgress = (battle) => {
    return battle?.videos?.challenger || battle?.videos?.opponent;
  };

  // Judge room logic
  const showJudgeRoom = isBattleCompleted(battle) && !isBattleJudged(battle) && isJudge;
  
  // Check if all categories have been voted on
  const allCategoriesVoted = judgeVotes.length === 5;
  const showResults = isBattleJudged(battle) || allCategoriesVoted;

  // Fetch battle data and judge votes
  useEffect(() => {
    async function fetchBattle() {
      try {
        setLoading(true);
        const data = await battlesAPI.getById(battleId);
        setBattle(data);
        
        // If battle is completed and user is a judge, fetch judge votes
        if (isBattleCompleted(data) && isJudge) {
          await fetchJudgeVotes(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (battleId) {
      fetchBattle();
    }
  }, [battleId, isJudge]);

  // Fetch judge votes to determine taken seats
  const fetchJudgeVotes = async (battleData) => {
    try {
      const categories = ['Foundation', 'Originality', 'Execution', 'Dynamics', 'Battle'];
      const votes = [];
      
      // Check each category for existing votes
      for (const category of categories) {
        try {
          const voteData = await battlesAPI.getJudgeVote(battleId, currentUser._id, category);
          if (voteData) {
            votes.push(voteData);
          }
        } catch (error) {
          // Vote doesn't exist for this category
        }
      }
      
      setJudgeVotes(votes);
      
      // Update taken seats based on votes
      const taken = {};
      votes.forEach(vote => {
        taken[vote.category] = currentUser._id;
      });
      setTakenSeats(taken);
    } catch (error) {
      console.error('Error fetching judge votes:', error);
    }
  };

  // Handle video upload to Cloudinary
  async function handleVideoUpload(file) {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'battle_upload');
      formData.append('folder', 'breakverse/battles');
      formData.append('resource_type', 'video');

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dpwzysxp7/video/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload video to Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const videoUrl = cloudinaryData.secure_url;

      // Save video URL to backend using API service
      const updatedBattle = await battlesAPI.uploadVideo(battleId, currentUser._id, videoUrl);
      setBattle(updatedBattle);

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const getLevelIcon = (level) => {
    if (level >= 8) return <FaCrown className="battle-arena-level-icon battle-arena-crown" />;
    if (level >= 6) return <FaStar className="battle-arena-level-icon battle-arena-star" />;
    return <FaStar className="battle-arena-level-icon" />;
  };

  const handleTakeSeat = (category) => {
    // Navigate to judge voting page with the category
    // Convert category to lowercase for URL
    const categorySlug = category.toLowerCase();
    navigate(`/battles/${battleId}/judge/${categorySlug}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="battle-arena-container">
        <div className="battle-arena-loading">
          <div className="battle-arena-loading-spinner"></div>
          <p>Loading battle room...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="battle-arena-container">
        <div className="battle-arena-error">
          <FaExclamationTriangle />
          <p>Error: {error}</p>
          <button onClick={() => navigate('/battles')}>Back to Battles</button>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="battle-arena-container">
        <div className="battle-arena-error">
          <p>Battle not found</p>
          <button onClick={() => navigate('/battles')}>Back to Battles</button>
        </div>
      </div>
    );
  }

  return (
    <div className="battle-arena-container">
      <div className="battle-arena-main">
        {/* Header */}
        <button 
          className="battle-arena-back-btn"
          onClick={() => navigate('/battles')}
        >
          <FaArrowLeft /> Back to Battles
        </button>

        <div className="battle-arena-header">
          <div className="battle-arena-header-content">
            <h1 className="battle-arena-title">
              Battle Room
            </h1>
            <div className="battle-arena-info">
              <span className="battle-arena-category">{battle.category || 'Breaking Battle'}</span>
              <span className={`battle-arena-status ${battle.status}`}>{battle.status}</span>
              {canSeePrivacy && (
                (() => {
                  const isPrivate = battle?.visibility === 'private' || battle?.isPrivate === true;
                  const toggleVisibility = async () => {
                    try {
                      const updated = await battlesAPI.update(battle._id, {
                        visibility: isPrivate ? 'public' : 'private'
                      });
                      setBattle(updated);
                    } catch (e) {
                      console.error('Failed to toggle visibility', e);
                    }
                  };
                  return (
                    <div className="battle-visibility-container">
                      <div className={`battle-visibility-indicator ${isPrivate ? 'private' : 'public'}`}>
                        {isPrivate ? <FaLock /> : <FaGlobe />}
                        <span className="battle-visibility-text">{isPrivate ? 'Private' : 'Public'}</span>
                      </div>
                      <div className="battle-visibility-toggle">
                        <input
                          type="checkbox"
                          id="battle-visibility-toggle"
                          checked={!isPrivate}
                          onChange={toggleVisibility}
                          className="battle-visibility-toggle-input"
                        />
                        <label htmlFor="battle-visibility-toggle" className="battle-visibility-toggle-label">
                          <span className="battle-visibility-toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* Upload Status removed per request */}

        {/* Videos Section */}
        <div className="battle-arena-videos-container">
          {/* Challenger Video */}
          <div className="battle-arena-video-section battle-arena-left-video">
            <div className="battle-arena-video-container">
              {battle.videos?.challenger ? (
                <video 
                  controls 
                  className="battle-arena-video"
                  src={battle.videos.challenger}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="battle-arena-video-placeholder">
                  <div className="battle-arena-placeholder-content">
                    <FaVideo />
                    <p>No video uploaded</p>
                  </div>
                </div>
              )}
            </div>
            <div className="battle-arena-breaker-info">
              <div className="battle-arena-breaker-details">
                <h3 className="battle-arena-breaker-name">{battle.challenger.name}</h3>
                <div className="battle-arena-breaker-stats">
                  {getLevelIcon(battle.challenger.level)}
                  <span className="battle-arena-breaker-level">Level {battle.challenger.level}</span>
                </div>
              </div>
              {isChallenger && !battle.videos?.challenger && !uploading && (
                <div className="battle-arena-upload-section">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e.target.files[0])}
                    className="battle-arena-file-input"
                    id="challenger-video-upload"
                  />
                  <label htmlFor="challenger-video-upload" className="battle-arena-upload-btn">
                    <FaUpload /> Upload Video
                  </label>
                </div>
              )}
              {isChallenger && uploading && (
                <div className="battle-arena-uploading">
                  <div className="battle-arena-loading-spinner"></div>
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </div>

          {/* VS Divider */}
          <div className="battle-arena-vs-divider">
            <div className="battle-arena-vs-content">
              <span className="battle-arena-vs-text">VS</span>
              <div className="battle-arena-vs-line"></div>
            </div>
          </div>

          {/* Opponent Video */}
          <div className="battle-arena-video-section battle-arena-right-video">
            <div className="battle-arena-video-container">
              {battle.videos?.opponent ? (
                <video 
                  controls 
                  className="battle-arena-video"
                  src={battle.videos.opponent}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="battle-arena-video-placeholder">
                  <div className="battle-arena-placeholder-content">
                    <FaVideo />
                    <p>No video uploaded</p>
                  </div>
                </div>
              )}
            </div>
            <div className="battle-arena-breaker-info">
              <div className="battle-arena-breaker-details">
                <h3 className="battle-arena-breaker-name">{battle.opponent.name}</h3>
                <div className="battle-arena-breaker-stats">
                  {getLevelIcon(battle.opponent.level)}
                  <span className="battle-arena-breaker-level">Level {battle.opponent.level}</span>
                </div>
              </div>
              {isOpponent && !battle.videos?.opponent && !uploading && (
                <div className="battle-arena-upload-section">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e.target.files[0])}
                    className="battle-arena-file-input"
                    id="opponent-video-upload"
                  />
                  <label htmlFor="opponent-video-upload" className="battle-arena-upload-btn">
                    <FaUpload /> Upload Video
                  </label>
                </div>
              )}
              {isOpponent && uploading && (
                <div className="battle-arena-uploading">
                  <div className="battle-arena-loading-spinner"></div>
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completion Status */}
        {bothUploaded && (
          <div className="battle-arena-completion">
            <FaCheckCircle />
            <span>Both videos uploaded! Battle is ready for judging.</span>
          </div>
        )}

        {/* Judge Room */}
        {showJudgeRoom && (
          <div className="battle-arena-judge-room">
            <div className="battle-arena-judge-header">
              <FaTrophy />
              <h3>Judge Room</h3>
              <p>Rate this battle using the OUR-FIED criteria</p>
            </div>
            <div className="battle-arena-judge-seats">
              <div className="battle-arena-judge-seat">
                <h4>Foundation</h4>
                <p>Basic breaking skills and technique</p>
                <button 
                  className={`battle-arena-judge-seat-btn ${takenSeats['Foundation'] ? 'taken' : ''}`}
                  onClick={() => handleTakeSeat('Foundation')}
                  disabled={takenSeats['Foundation']}
                >
                  {takenSeats['Foundation'] ? 'Seat Taken' : 'Take Seat'}
                </button>
              </div>
              <div className="battle-arena-judge-seat">
                <h4>Originality</h4>
                <p>Creative and unique moves</p>
                <button 
                  className={`battle-arena-judge-seat-btn ${takenSeats['Originality'] ? 'taken' : ''}`}
                  onClick={() => handleTakeSeat('Originality')}
                  disabled={takenSeats['Originality']}
                >
                  {takenSeats['Originality'] ? 'Seat Taken' : 'Take Seat'}
                </button>
              </div>
              <div className="battle-arena-judge-seat">
                <h4>Execution</h4>
                <p>Clean performance and control</p>
                <button 
                  className={`battle-arena-judge-seat-btn ${takenSeats['Execution'] ? 'taken' : ''}`}
                  onClick={() => handleTakeSeat('Execution')}
                  disabled={takenSeats['Execution']}
                >
                  {takenSeats['Execution'] ? 'Seat Taken' : 'Take Seat'}
                </button>
              </div>
              <div className="battle-arena-judge-seat">
                <h4>Dynamics</h4>
                <p>Energy and stage presence</p>
                <button 
                  className={`battle-arena-judge-seat-btn ${takenSeats['Dynamics'] ? 'taken' : ''}`}
                  onClick={() => handleTakeSeat('Dynamics')}
                  disabled={takenSeats['Dynamics']}
                >
                  {takenSeats['Dynamics'] ? 'Seat Taken' : 'Take Seat'}
                </button>
              </div>
              <div className="battle-arena-judge-seat">
                <h4>Battle</h4>
                <p>Competitive spirit and strategy</p>
                <button 
                  className={`battle-arena-judge-seat-btn ${takenSeats['Battle'] ? 'taken' : ''}`}
                  onClick={() => handleTakeSeat('Battle')}
                  disabled={takenSeats['Battle']}
                >
                  {takenSeats['Battle'] ? 'Seat Taken' : 'Take Seat'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section - Show when all categories voted or battle is judged */}
        {showResults && (
          <div className="battle-arena-results">
            <div className="battle-arena-results-header">
              <FaTrophy />
              <h3>Judging Results</h3>
              <p>All categories have been judged</p>
            </div>
            <div className="battle-arena-results-content">
              <div className="battle-arena-results-summary">
                <h4>Voting Summary</h4>
                <div className="battle-arena-vote-categories">
                  {battle.votes && battle.votes.map((vote, index) => (
                    <div key={index} className="battle-arena-vote-category">
                      <span className="battle-arena-category-name">{vote.category}</span>
                      <div className="battle-arena-vote-scores">
                        <span className="battle-arena-vote-score">
                          {battle.challenger.name}: {vote.scoreA}
                        </span>
                        <span className="battle-arena-vote-score">
                          {battle.opponent.name}: {vote.scoreB}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {battle.winner && (
                  <div className="battle-arena-winner">
                    <h4>Winner</h4>
                    <p>{battle.winner.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Battle Details */}
        <div className="battle-arena-details">
          <div className="battle-arena-detail-item">
            <FaClock />
            <span>Created: {new Date(battle.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          {/* Show appropriate message based on user role */}
          {isChallenger && (
            <div className="battle-arena-detail-item">
              <FaUsers />
              <span>You challenged {battle.opponent.name} to this battle!</span>
            </div>
          )}
          {isOpponent && battle.description && (
            <div className="battle-arena-detail-item">
              <FaUsers />
              <span>{battle.description}</span>
            </div>
          )}
          {/* Show audience-specific information for non-participants */}
          {!isParticipant && (
            <div className="battle-arena-detail-item">
              <FaUsers />
              <span>Watch this epic breaking battle between {battle.challenger.name} and {battle.opponent.name}!</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="battle-arena-error-message">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 