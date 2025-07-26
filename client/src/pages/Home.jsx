// Home.jsx – dashboard with StyleRadar & LevelSummary + Cover and Profile Upload
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import { BattleStatistics } from '../components/BattleStatistics';
import { LevelSummary } from '../components/LevelSummary';
import CoverPhotoSection from '../components/CoverPhotoSection';
import { useMoves } from '../hooks/useMoves';
import { useBadges } from '../hooks/useBadges';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrophy, FaDumbbell, FaCalendar, FaUsers, FaPlay } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { isBadgeUnlocked } from '../utils/badgeUtils';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    masteredMoves,
    profileImage,
    setProfileImage,
    setCoverPhoto,
    xp,
    level,
    progress,
    nextXP,
    uploadProfileImage,
  } = useProfile();
  
  // Use API hooks - fetch all moves with high limit to get complete data
  const { moves: allMoves, loading: movesLoading } = useMoves({ limit: 1000 });
  const { badges, loading: badgesLoading } = useBadges();

  // Auto-refresh data when user profile changes
  useAutoRefresh(() => {
    // The ProfileContext will automatically update the masteredMoves, xp, level, etc.
    // This hook ensures the component re-renders when data changes
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempCoverPhoto, setTempCoverPhoto] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Show loading state while data is being fetched
  if (movesLoading || badgesLoading) {
    return (
      <div className="main-content">
        <section className="moves-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }



  const handleNavigate = (path) => {
    navigate(path);
  };
  
  // Add some test moves for badge testing (remove this later)
  // const testMoves = [
  //   { name: 'Two step', category: 'Toprock', level: 'Beginner', xp: 25 },
  //   { name: 'Salsa step', category: 'Toprock', level: 'Beginner', xp: 25 },
  //   { name: 'CC', category: 'Footwork', level: 'Beginner', xp: 25 },
  //   { name: 'Kick outs', category: 'Footwork', level: 'Beginner', xp: 25 },
  // ];
  
  // Uncomment this line to test badges with some moves
  // React.useEffect(() => { testMoves.forEach(move => addMasteredMove(move)); }, []);

  // const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  // const styleData = categories.map((cat) => {
  //   const totalCat = allMoves.filter((m) => m.category === cat).length;
  //   const masteredCat = masteredMoves.filter((m) => m.category === cat).length;
  //   const pct = totalCat ? Math.round((masteredCat / totalCat) * 100) : 0;
  //   return { category: cat, score: pct };
  // });

  const totalByCategory = allMoves.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});
  const masteredByCategory = masteredMoves.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});



  return (
    <>
      {/* Cover Photo Section - Outside main container for full width */}
      <CoverPhotoSection 
        isEditing={isEditing}
        tempCoverPhoto={tempCoverPhoto}
        setTempCoverPhoto={setTempCoverPhoto}
        setCoverPhoto={setCoverPhoto}
      />

      <div className="main-content">
        <section className="moves-page">

          {/* Profile header */}
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-pic-wrapper">
                {tempProfileImage || profileImage ? (
                  <img
                    src={tempProfileImage || profileImage}
                    alt="Profile"
                    className="profile-pic"
                    onError={(e) => {
                      console.error('Failed to load profile image:', tempProfileImage || profileImage);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('Profile image loaded successfully:', tempProfileImage || profileImage)}
                  />
                ) : (
                  <div className="profile-pic-placeholder">
                    <span>Upload Photo</span>
                  </div>
                )}
                {isEditing && (
                  <label className="edit-icon-periphery" tabIndex={0} aria-label="Edit profile picture">
                    <FaEdit />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            // Upload the file to server
                            const imageUrl = await uploadProfileImage(file);
                            setTempProfileImage(imageUrl);
                            setProfileImage(imageUrl); // Update the actual profile image immediately
                            toast.success('Profile image uploaded!');
                          } catch (error) {
                            console.error('Error uploading profile image:', error);
                            toast.error('Failed to upload profile image');
                          }
                        }
                      }}
                      hidden
                    />
                  </label>
                )}
              </div>
              <div>
                  <h1 className="dashboard-title">{currentUser?.name || 'Breaker'}</h1>
                  <div className="header-progress-container">
                      <p className="xp-text">Level {level}</p>
                      <ProgressBar 
                        progress={progress} 
                        currentXP={xp}
                        nextLevelXP={nextXP}
                        currentLevel={level}
                      />
                  </div>
              </div>
            </div>
            <div className="profile-buttons">
              <button
                className="edit-profile-btn"
                onClick={() => {
                  if (isEditing) {
                    // Clear temp states since images are already saved
                    setTempProfileImage(null);
                    setTempCoverPhoto(null);
                    toast.success('Profil gemt!');
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Gem' : 'Rediger Profil'}
              </button>
            </div>
          </div>

  
        {/* Badges */}
        <div className="dashboard-grid mt-6">
          <div className="section-card">
            <h2 className="section-heading">Badges</h2>
            <div className="badges-wrapper">
              {badges.filter(badge => isBadgeUnlocked(badge, masteredMoves)).length > 0 ? (
                <div className="badges-row">
                  {badges
                    .filter(badge => isBadgeUnlocked(badge, masteredMoves))
                    .filter(badge => badge.name !== 'Grandmaster')
                    .map((badge) => (
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
                  <h3>Fuldfør en mission for at tjene en badge</h3>
                  <p>Mester moves i hver kategori for at låse op for prestigefyldte badges</p>
                  <button 
                    className="cta-button"
                    onClick={() => window.location.href = '/badges'}
                  >
                    Se Alle Badges
                  </button>
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
          <LevelSummary 
            masteredByCategory={masteredByCategory}
            totalByCategory={totalByCategory}
          />
        </div>

        {/* Mastered Moves */}
        <div className="section-card mt-8">
          <h2 className="section-heading">Mesterede Moves</h2>
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
            <p className="text-muted">Ingen moves mesteret endnu. Gå til Moves siden!</p>
          )}
        </div>
  

       
      </section>
    </div>
    </>
  );
}
