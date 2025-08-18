import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaCheckCircle, FaExclamationTriangle, FaVideo, FaUsers, FaTrophy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { battlesAPI } from '../services/api';
import '../styles/pages/judge-voting.css';

export default function JudgeVoting() {
  const { battleId, category: urlCategory } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [battle, setBattle] = useState(null);
  const [existingVote, setExistingVote] = useState(null);
  const [scoreA, setScoreA] = useState(3);
  const [scoreB, setScoreB] = useState(3);
  const [category, setCategory] = useState(urlCategory || 'Foundation');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['Foundation', 'Originality', 'Execution', 'Dynamics', 'Battle'];

  // Check if user is a judge
  const isJudge = currentUser?.roles?.includes('judge');

  // Update category when URL parameter changes
  useEffect(() => {
    if (urlCategory) {
      // Convert URL parameter to proper case (first letter uppercase)
      const properCategory = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1).toLowerCase();
      setCategory(properCategory);
    }
  }, [urlCategory]);

  // Fetch battle data and existing vote
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch battle data
        const battleData = await battlesAPI.getById(battleId);
        setBattle(battleData);

        // Fetch existing vote for this judge and category
        if (isJudge) {
          try {
            const voteData = await battlesAPI.getJudgeVote(battleId, currentUser._id, category);
            if (voteData) {
              setExistingVote(voteData);
              setScoreA(voteData.scoreA);
              setScoreB(voteData.scoreB);
            }
          } catch (voteError) {
            console.error('Error fetching existing vote:', voteError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (battleId) {
      fetchData();
    }
  }, [battleId, currentUser, isJudge, category]);

  const handleSubmitVote = async () => {
    if (!isJudge) return;

    try {
      setSubmitting(true);
      setError(null);

      const voteData = {
        judgeId: currentUser._id,
        category,
        scoreA,
        scoreB
      };

      const result = await battlesAPI.submitJudgeVote(battleId, voteData);
      setExistingVote({ judgeId: currentUser._id, category, scoreA, scoreB, timestamp: new Date() });
      
      // Show success message briefly
      setTimeout(() => {
        navigate(`/battles/${battleId}`);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (score, setScore, disabled = false) => {
    return (
      <div className="judge-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`judge-star ${star <= score ? 'filled' : ''}`}
            onClick={() => !disabled && setScore(star)}
            disabled={disabled}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="judge-voting-container">
        <div className="judge-voting-loading">
          <div className="judge-voting-loading-spinner"></div>
          <p>Loading battle for judging...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="judge-voting-container">
        <div className="judge-voting-error">
          <FaExclamationTriangle />
          <p>Error: {error}</p>
          <button onClick={() => navigate('/battles')}>Back to Battles</button>
        </div>
      </div>
    );
  }

  // Check if user is judge
  if (!isJudge) {
    return (
      <div className="judge-voting-container">
        <div className="judge-voting-error">
          <FaExclamationTriangle />
          <p>Access denied. Only judges can vote on battles.</p>
          <button onClick={() => navigate('/battles')}>Back to Battles</button>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="judge-voting-container">
        <div className="judge-voting-error">
          <p>Battle not found</p>
          <button onClick={() => navigate('/battles')}>Back to Battles</button>
        </div>
      </div>
    );
  }

  return (
    <div className="judge-voting-container">
      <div className="judge-voting-main">
        {/* Header */}
        <button 
          className="judge-voting-back-btn"
          onClick={() => navigate('/battles')}
        >
          <FaArrowLeft /> Back to Battles
        </button>

        <div className="judge-voting-header">
          <div className="judge-voting-header-content">
            <h1 className="judge-voting-title">
              <FaTrophy className="judge-voting-title-icon" />
              Judge Voting
            </h1>
            <div className="judge-voting-info">
              <span className="judge-voting-category">Category: {category}</span>
              <span className="judge-voting-status">{battle.status}</span>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="judge-voting-category-selector">
          <label htmlFor="category-select">Select Category:</label>
          <select 
            id="category-select"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            disabled={existingVote}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Videos Section */}
        <div className="judge-voting-videos-container">
          {/* Challenger Video */}
          <div className="judge-voting-video-section">
            <div className="judge-voting-video-container">
              {battle.videos?.challenger ? (
                <video 
                  controls 
                  className="judge-voting-video"
                  src={battle.videos.challenger}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="judge-voting-video-placeholder">
                  <div className="judge-voting-placeholder-content">
                    <FaVideo />
                    <p>No video uploaded</p>
                  </div>
                </div>
              )}
            </div>
            <div className="judge-voting-breaker-info">
              <h3 className="judge-voting-breaker-name">{battle.challenger.name}</h3>
              <div className="judge-voting-breaker-stats">
                <span className="judge-voting-breaker-level">Level {battle.challenger.level}</span>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="judge-voting-vs-divider">
            <div className="judge-voting-vs-content">
              <span className="judge-voting-vs-text">VS</span>
              <div className="judge-voting-vs-line"></div>
            </div>
          </div>

          {/* Opponent Video */}
          <div className="judge-voting-video-section">
            <div className="judge-voting-video-container">
              {battle.videos?.opponent ? (
                <video 
                  controls 
                  className="judge-voting-video"
                  src={battle.videos.opponent}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="judge-voting-video-placeholder">
                  <div className="judge-voting-placeholder-content">
                    <FaVideo />
                    <p>No video uploaded</p>
                  </div>
                </div>
              )}
            </div>
            <div className="judge-voting-breaker-info">
              <h3 className="judge-voting-breaker-name">{battle.opponent.name}</h3>
              <div className="judge-voting-breaker-stats">
                <span className="judge-voting-breaker-level">Level {battle.opponent.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        <div className="judge-voting-section">
          <h2 className="judge-voting-section-title">Score the Battle</h2>
          
          <div className="judge-voting-scores">
            {/* Challenger Score */}
            <div className="judge-voting-score-card">
              <h3>{battle.challenger.name}</h3>
              <div className="judge-voting-score-display">
                <span className="judge-voting-score-number">{scoreA}</span>
                <span className="judge-voting-score-label">/ 5</span>
              </div>
              {renderStars(scoreA, setScoreA, existingVote)}
            </div>

            {/* Opponent Score */}
            <div className="judge-voting-score-card">
              <h3>{battle.opponent.name}</h3>
              <div className="judge-voting-score-display">
                <span className="judge-voting-score-number">{scoreB}</span>
                <span className="judge-voting-score-label">/ 5</span>
              </div>
              {renderStars(scoreB, setScoreB, existingVote)}
            </div>
          </div>

          {/* Submit Button */}
          {!existingVote ? (
            <button 
              className="judge-voting-submit-btn"
              onClick={handleSubmitVote}
              disabled={submitting || !battle.videos?.challenger || !battle.videos?.opponent}
            >
              {submitting ? 'Submitting...' : 'Submit Vote'}
            </button>
          ) : (
            <div className="judge-voting-submitted">
              <FaCheckCircle />
              <span>Vote submitted for {category}</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="judge-voting-error-message">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 