// Home.jsx – dashboard with StyleRadar & LevelSummary + Cover and Profile Upload
import { useProfile } from '../context/ProfileContext';
import ProgressBar from '../components/ProgressBar';
import BadgeCard from '../components/BadgeCard';
import placeholder from '../assets/placeholder.jpg';
import { StyleRadar } from '../components/StyleRadar';
import { LevelSummary } from '../components/LevelSummary';
import { moves as allMoves } from '../data/moves';
import { badges } from '../data/badges';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaVideo } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Home({ coverPhoto, setCoverPhoto, isEditing, setIsEditing }) {
  const navigate = useNavigate();
  const {
    masteredMoves,
    profileImage,
    setProfileImage,
    xp,
    level,
    progress,
    battleVideo,
  } = useProfile();

  const [selectedImage, setSelectedImage] = useState(null);
  
  // Add some test moves for badge testing (remove this later)
  const testMoves = [
    { name: 'Two step', category: 'Toprock', level: 'Beginner', xp: 25 },
    { name: 'Salsa step', category: 'Toprock', level: 'Beginner', xp: 25 },
    { name: 'CC', category: 'Footwork', level: 'Beginner', xp: 25 },
    { name: 'Kick outs', category: 'Footwork', level: 'Beginner', xp: 25 },
  ];
  
  // Uncomment this line to test badges with some moves
  // React.useEffect(() => { testMoves.forEach(move => addMasteredMove(move)); }, []);
  // const [coverPhoto, setCoverPhoto] = useState(null); // removed
  // const [isEditing, setIsEditing] = useState(false); // removed

  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  const styleData = categories.map((cat) => {
    const totalCat = allMoves.filter((m) => m.category === cat).length;
    const masteredCat = masteredMoves.filter((m) => m.category === cat).length;
    const pct = totalCat ? Math.round((masteredCat / totalCat) * 100) : 0;
    return { category: cat, score: pct };
  });

  const totalByLevel = allMoves.reduce((acc, m) => {
    acc[m.level] = (acc[m.level] || 0) + 1;
    return acc;
  }, {});
  const masteredByLevel = masteredMoves.reduce((acc, m) => {
    acc[m.level] = (acc[m.level] || 0) + 1;
    return acc;
  }, {});

  const topCategory = styleData.reduce((max, cur) => (cur.score > max.score ? cur : max), styleData[0]);

  const styleProfiles = {
    Toprock: {
      title: 'Rhythm Ruler',
      desc: 'The beat guides your body. You ride the music like it\'s part of you.'
    },
    Footwork: {
      title: 'Foundation Master',
      desc: 'Your roots are deep. Your style is built on strong Footwork and solid flow.'
    },
    Freezes: {
      title: 'Freeze Frame',
      desc: 'You\'re a statue in motion. Freezes are your signature.'
    },
    Power: {
      title: 'Powerhead',
      desc: 'Explosive and high-risk, your power defines your presence.'
    },
    Tricks: {
      title: 'Style Trickster',
      desc: 'Your creativity surprises the floor with unexpected twists.'
    },
    GoDowns: {
      title: 'Flow Hacker',
      desc: 'You stitch moves together with slick transitions and control.'
    },
  };

  const userStyle = styleProfiles[topCategory.category];

  return (
    <div className="main-content">
      <section className="moves-page">

        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-pic-wrapper">
              <img
                src={selectedImage || profileImage || placeholder}
                alt="Profile"
                className="profile-pic"
              />
              {isEditing && (
                <label className="edit-icon-periphery" tabIndex={0} aria-label="Edit profile picture">
                  <FaEdit />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const imageUrl = URL.createObjectURL(e.target.files[0]);
                      setSelectedImage(imageUrl);
                      setProfileImage(imageUrl);
                    }}
                    hidden
                  />
                </label>
              )}
            </div>
            <div>
                <h1 className="dashboard-title">DLoi</h1>
                <div className="header-progress-container">
                    <p className="xp-text">{xp} XP – Level {level}</p>
                    <ProgressBar progress={progress} />
                </div>
            </div>
          </div>
          <div className="profile-buttons">
            <button
              className="edit-profile-btn"
              onClick={() => {
                if (isEditing) {
                  toast.success('Profil gemt!');
                }
                setIsEditing((edit) => !edit);
              }}
            >
              {isEditing ? 'Gem' : 'Rediger profil'}
            </button>
            <button
              className="admin-btn"
              onClick={() => navigate('/admin')}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="dashboard-grid mt-6">
          <div className="section-card">
            <h2 className="section-heading">Badges</h2>
            <div className="badges-wrapper">
              {badges.filter(badge => badge.unlock(masteredMoves)).length > 0 ? (
                <div className="badges-row">
                  {badges
                    .filter(badge => badge.unlock(masteredMoves))
                    .map((badge) => (
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
                  <h3>Clear a mission to earn a badge</h3>
                  <p>Master moves in each category to unlock prestigious badges</p>
                  <button 
                    className="cta-button"
                    onClick={() => window.location.href = '/badges'}
                  >
                    View All Badges
                  </button>
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
          {/* Battle Video Display */}
          <div className="video-container mt-6">
            {battleVideo ? (
              <video
                src={battleVideo}
                controls
                className="style-video"
                aria-label="Latest battle video"
              />
            ) : (
              <div className="no-video-placeholder">
                <div className="placeholder-content">
                  <FaVideo className="placeholder-icon" />
                  <h3>No Battle Video Yet</h3>
                  <p>Your first battle video will appear here once you participate in a battle.</p>
                  <button 
                    onClick={() => navigate('/battles')}
                    className="battle-button"
                  >
                    Join a Battle
                  </button>
                </div>
              </div>
            )}
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
            <p className="text-muted">No moves mastered yet. Head to the Moves page!</p>
          )}
        </div>
  

       
      </section>
    </div>
  );
}
