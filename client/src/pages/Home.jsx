// Home.jsx – dashboard with StyleRadar & LevelSummary + Cover and Profile Upload
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import { BattleStatistics } from '../components/BattleStatistics';
import { LevelSummary } from '../components/LevelSummary';
import CoverPhotoSection from '../components/CoverPhotoSection';
import { UserBattles } from '../components/UserBattles';
import { useMoves } from '../hooks/useMoves';
import DashboardBadges from '../components/DashboardBadges';
import { useBadges } from '../hooks/useBadges';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrophy, FaDumbbell, FaCalendar, FaUsers, FaPlay } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { isBadgeUnlocked } from '../utils/badgeUtils';
import MasteredMoveCard from '../components/MasteredMoveCard';

export default function Home() {
  // Add body class for dashboard background
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useAuth();
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

  // Refresh user data only once when component mounts
  useEffect(() => {
    if (currentUser?._id) {
      // Only refresh if we don't have battle statistics
      if (!currentUser.battleXP && !currentUser.battleWins && !currentUser.battleLosses) {
        refreshUser();
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Debug logging to track data updates
  useEffect(() => {
    // console.log('🏠 Home component - allMoves updated:', allMoves.length);
    // console.log('🏠 Home component - masteredMoves updated:', masteredMoves.length);
  }, [allMoves.length, masteredMoves.length]);

  // Show loading state while data is being fetched
  if (movesLoading || badgesLoading) {
    return (
      <div className="main-content home-loading">
        <section className="moves-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }



  // Function to handle navigation with data refresh
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

  // Debug logging for moves data
  // console.log('🏠 Total moves available:', allMoves.length);
  // console.log('🏠 Total moves by category:', totalByCategory);
  // console.log('🏠 Mastered moves by category:', masteredByCategory);


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
                {currentUser?.bio && (
                  <p className="dashboard-bio text-muted" style={{ marginTop: '0.25rem' }}>{currentUser.bio}</p>
                )}
                <div className="header-levels">
                  <div className="header-progress-container">
                    <p className="xp-text">Level {level}</p>
                    <ProgressBar 
                      progress={progress} 
                      currentXP={xp}
                      nextLevelXP={nextXP}
                      currentLevel={level}
                    />
                  </div>
                  <div className="battle-progress-container">
                    <p className="xp-text">Battle Level {currentUser?.battleLevel || 1}</p>
                    <ProgressBar 
                      progress={(() => {
                        const battleLevel = currentUser?.battleLevel || 1;
                        const battleXP = currentUser?.battleXP || 0;
                        const currentLevelXP = (battleLevel - 1) * 100;
                        const nextLevelXP = battleLevel * 100;
                        const xpProgress = battleXP - currentLevelXP;
                        const totalXPNeeded = nextLevelXP - currentLevelXP;
                        return totalXPNeeded > 0 ? Math.min(100, Math.round((xpProgress / totalXPNeeded) * 100)) : 100;
                      })()}
                      currentXP={currentUser?.battleXP || 0}
                      nextLevelXP={(currentUser?.battleLevel || 1) * 100}
                      currentLevel={currentUser?.battleLevel || 1}
                    />
                  </div>
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
                    toast.success('Profile saved!');
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>
          </div>

  
        {/* Badges - UB-styled widget */}
        <div className="mt-6">
          <DashboardBadges allMoves={allMoves} masteredMoves={masteredMoves} />
        </div>

        {/* User Battles */}
        <div className="mt-6">
          <UserBattles />
        </div>
     
        {/* Battle Statistics Section */}
        <div className="mt-6">
          <BattleStatistics 
            battleStats={{
              battlesWon: currentUser?.battleWins || 0,
              battlesLost: currentUser?.battleLosses || 0,
              battlesTied: 0, // TODO: Add battle ties to user model
              winStreak: 0, // TODO: Add win streak tracking
              bestWinStreak: 0, // TODO: Add best win streak tracking
              totalBattles: currentUser?.battlesParticipated || 0,
              battleLevel: currentUser?.battleLevel || 1,
              battleXP: currentUser?.battleXP || 0
            }}
          />
        </div>
         {/* Level Summary Section */}
         <div className="mt-6">
           <LevelSummary 
             masteredByCategory={masteredByCategory}
             totalByCategory={totalByCategory}
           />
         </div>

        {/* Mastered Moves */}
        <div className="mt-6">
          <div className="section-card section-card--centered-header">
            <div className="section-header">
              <h2 className="section-heading">Mastered Moves</h2>
            </div>
            {masteredMoves.length ? (
              <div className="mastered-grid">
                {masteredMoves.map((move) => (
                  <MasteredMoveCard key={move.name} move={move} />
                ))}
              </div>
            ) : (
              <p className="text-muted">No moves mastered yet. Go to the Moves page!</p>
            )}
          </div>
        </div>
  

       
      </section>
    </div>
    </>
  );
}
