import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crews } from '../data/crews';
import { moves as allMoves } from '../data/moves';
import { badges } from '../data/badges';
import { FaArrowLeft, FaUsers, FaTrophy, FaStar, FaCrown } from 'react-icons/fa';
import ProgressBar from '../components/ProgressBar';
import { StyleRadar } from '../components/StyleRadar';
import { LevelSummary } from '../components/LevelSummary';
import '../styles/pages/breaker-profile.css';

export default function BreakerProfile() {
  const { breakerId } = useParams();
  const navigate = useNavigate();
  const [breaker, setBreaker] = useState(null);
  const [masteredMoves, setMasteredMoves] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [coverPhoto] = useState('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop');

  useEffect(() => {
    // Find the breaker from all crews
    let foundBreaker = null;
    crews.forEach(crew => {
      const member = crew.members.find(m => m.id.toString() === breakerId);
      if (member) {
        foundBreaker = {
          ...member,
          crew: crew.name,
          crewColor: crew.color
        };
      }
    });

    if (foundBreaker) {
      setBreaker(foundBreaker);
      
      // Simulate mastered moves (in real app, this would come from API)
      const simulatedMasteredMoves = allMoves
        .filter(move => Math.random() > 0.6) // Randomly master some moves
        .slice(0, Math.floor(Math.random() * 20) + 5); // 5-25 moves
      
      setMasteredMoves(simulatedMasteredMoves);
      
      // Calculate earned badges
      const earned = badges.filter(badge => badge.unlock(simulatedMasteredMoves));
      setEarnedBadges(earned);
    }
  }, [breakerId]);

  if (!breaker) {
    return (
      <div className="breaker-profile-page">
        <div className="loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Calculate XP and level (similar to Home page logic)
  const totalXP = masteredMoves.reduce((sum, move) => sum + move.xp, 0);
  const level = Math.floor(totalXP / 1000) + 1;
  const progress = (totalXP % 1000) / 1000;

  // Calculate style data for radar
  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  const styleData = categories.map((cat) => {
    const totalCat = allMoves.filter((m) => m.category === cat).length;
    const masteredCat = masteredMoves.filter((m) => m.category === cat).length;
    const pct = totalCat ? Math.round((masteredCat / totalCat) * 100) : 0;
    return { category: cat, score: pct };
  });

  // Calculate level summary data
  const totalByLevel = allMoves.reduce((acc, m) => {
    acc[m.level] = (acc[m.level] || 0) + 1;
    return acc;
  }, {});
  const masteredByLevel = masteredMoves.reduce((acc, m) => {
    acc[m.level] = (acc[m.level] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* Cover Photo - Outside main container */}
      <div className="cover-photo-wrapper">
        <img src={coverPhoto} alt="Cover" className="cover-photo" />
      </div>

      <div className="main-content">
        <section className="moves-page">
          {/* Profile header */}
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-pic-wrapper">
                <img
                  src={breaker.profileImage}
                  alt={breaker.name}
                  className="profile-pic"
                />
              </div>
              <div>
                <h1 className="dashboard-title">{breaker.name}</h1>
                <div className="header-progress-container">
                  <p className="xp-text">{totalXP} XP – Level {level}</p>
                  <ProgressBar progress={progress} />
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
                {earnedBadges.length > 0 ? (
                  <div className="badges-row">
                    {earnedBadges.map((badge) => (
                      <div key={badge.id} className="game-badge-minimal">
                        <div className="badge-icon">
                          {badge.image.startsWith('/src/assets/badges/') ? (
                            <img src={badge.image} alt={badge.name} className="badge-image" />
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

          {/* Style Analysis Section */}
          <div className="flex">
            {/* Style radar */}
            <div className="section-card mt-6 widthfc">
              <StyleRadar data={styleData} />
            </div>
            {/* Style identity video */}
            <div className="video-container mt-6">
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                controls
                className="style-video"
                aria-label="Style identity video"
              />
            </div>
          </div>

          {/* Level summary */}
          <div className="section-card mt-6 width100">
            <LevelSummary masteredByLevel={masteredByLevel} totalByLevel={totalByLevel} />
          </div>

          {/* Mastered Moves */}
          <div className="section-card mt-8">
            <h2 className="section-heading">Mastered Moves</h2>
            {masteredMoves.length ? (
              <div className="mastered-grid">
                {masteredMoves.map((move) => (
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