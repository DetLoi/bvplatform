import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaThumbsUp, FaHandshake, FaTrophy, FaVideo, FaUpload } from 'react-icons/fa';
import { battles } from '../data/battles';
import '../styles/pages/battle-room.css';

export default function BattleRoom() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [battle, setBattle] = useState(null);
  const [vote, setVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentUserId] = useState("user1"); // In real app, get from auth context

  useEffect(() => {
    // Find the battle by ID
    console.log('BattleRoom: Looking for battle with ID:', battleId);
    const foundBattle = battles.find(b => b.id === parseInt(battleId));
    console.log('BattleRoom: Found battle:', foundBattle);
    if (foundBattle) {
      setBattle(foundBattle);
    } else {
      // If battle not found, redirect back to battles
      console.log('BattleRoom: Battle not found, redirecting');
      navigate('/battles');
    }
  }, [battleId, navigate]);

  const handleVote = (voteType) => {
    if (!hasVoted) {
      setVote(voteType);
      setHasVoted(true);
      // In a real app, this would send the vote to the server
      console.log(`Voted for: ${voteType}`);
    }
  };

  const getVoteButtonClass = (voteType) => {
    if (!hasVoted) return 'vote-btn';
    if (vote === voteType) return 'vote-btn voted';
    return 'vote-btn disabled';
  };

  const handleUploadVideo = (videoType) => {
    // In real app, this would handle file upload
    const videoUrl = prompt(`Enter ${videoType} video URL:`);
    if (videoUrl) {
      console.log(`Uploading ${videoType} video:`, videoUrl);
      // Update battle with new video
      setBattle(prev => ({
        ...prev,
        videos: {
          ...prev.videos,
          [videoType]: videoUrl
        }
      }));
    }
  };

  const isChallenger = battle?.challenger.id === currentUserId;
  const isOpponent = battle?.opponent.id === currentUserId;

  if (!battle) {
    return (
      <div className="main-content">
        <div className="loading">Loading battle...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="battle-room">
        {/* Header */}
        <div className="battle-room-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/battles')}
          >
            <FaArrowLeft /> Back to Battles
          </button>
          <h1 className="battle-room-title">Battle Room</h1>
        </div>

        {/* Battle Videos */}
        <div className="battle-videos-container">
          {/* Left Video */}
          <div className="video-section left-video">
            <div className="video-container">
              {battle.videos?.challenger ? (
                <video 
                  controls 
                  className="battle-video"
                  src={battle.videos.challenger}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <div className="placeholder-content">
                    <FaVideo />
                    <p>Video not uploaded</p>
                  </div>
                </div>
              )}
            </div>
            <div className="breaker-info">
              <h3 className="breaker-name">{battle.challenger.name}</h3>
              {isChallenger && !battle.videos?.challenger && (
                <button 
                  className="upload-btn"
                  onClick={() => handleUploadVideo('challenger')}
                >
                  <FaUpload /> Upload Video
                </button>
              )}
            </div>
          </div>

          {/* VS Divider */}
          <div className="vs-divider">VS</div>

          {/* Right Video */}
          <div className="video-section right-video">
            <div className="video-container">
              {battle.videos?.opponent ? (
                <video 
                  controls 
                  className="battle-video"
                  src={battle.videos.opponent}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <div className="placeholder-content">
                    <FaVideo />
                    <p>Video not uploaded</p>
                  </div>
                </div>
              )}
            </div>
            <div className="breaker-info">
              <h3 className="breaker-name">{battle.opponent.name}</h3>
              {isOpponent && !battle.videos?.opponent && (
                <button 
                  className="upload-btn"
                  onClick={() => handleUploadVideo('opponent')}
                >
                  <FaUpload /> Upload Video
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Voting Section */}
        <div className="battle-details-section">
          <h3 className="voting-title">Cast Your Vote</h3>
          
          <div className="vote-buttons">
            <button 
              className={getVoteButtonClass('left')}
              onClick={() => handleVote('left')}
              disabled={hasVoted}
            >
              <FaThumbsUp />
              <span>{battle.challenger.name}</span>
            </button>

            <button 
              className={getVoteButtonClass('tie')}
              onClick={() => handleVote('tie')}
              disabled={hasVoted}
            >
              <FaHandshake />
              <span>Tie</span>
            </button>

            <button 
              className={getVoteButtonClass('right')}
              onClick={() => handleVote('right')}
              disabled={hasVoted}
            >
              <FaThumbsUp />
              <span>{battle.opponent.name}</span>
            </button>
          </div>

          {hasVoted && (
            <div className="vote-confirmation">
              <FaTrophy />
              <span>Vote submitted!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 