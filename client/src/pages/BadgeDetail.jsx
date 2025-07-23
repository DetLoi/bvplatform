import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { badges } from '../data/badges';
import { moves } from '../data/moves';
import { FaArrowLeft, FaTrophy, FaCheck, FaLock, FaLightbulb, FaStar, FaFire } from 'react-icons/fa';
import { useEffect } from 'react';
import '../styles/pages/badge-detail.css';

export default function BadgeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { masteredMoves } = useProfile();

  // Prevent scroll to top when navigating to badge detail
  useEffect(() => {
    // Option 1: Scroll to top smoothly (current behavior)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Option 2: Don't scroll to top at all (uncomment if you want this)
    // window.scrollTo(0, 0);
    
    // Option 3: Maintain scroll position (uncomment if you want this)
    // const scrollPosition = sessionStorage.getItem('scrollPosition');
    // if (scrollPosition) {
    //   window.scrollTo(0, parseInt(scrollPosition));
    // }
  }, [id]);

  const badge = badges.find(b => b.id === id);
  
  if (!badge) {
    return (
      <div className="badge-detail-page">
        <div className="badge-detail-container">
          <h1>Badge not found</h1>
          <button onClick={() => navigate('/badges')} className="back-button">
            <FaArrowLeft size={16} />
            <span>Back to Badges</span>
          </button>
        </div>
      </div>
    );
  }

  const isEarned = badge.unlock(masteredMoves);
  
  // Get moves for this badge category
  const getCategoryMoves = (category) => {
    const categoryMovesMap = {
      'Toprock': ['Two step', 'Salsa step', 'Indian step', 'Charlie rock', 'Battle rock', 'Skater', 'Jerk rock'],
      'Footwork': ['CC', 'Kick outs', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Gorilla 6 step', 'Knock out', 'Pretzels'],
      'Freezes': ['Yoga freeze', 'Turtle freeze', 'Baby freeze', 'Spider freeze', 'Headstand', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Airchair', 'Suicide', 'L-kick', 'V-kick'],
      'Power': ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'],
      'Tricks': ['Cartwheel', 'Ormen', 'Icey Ice', 'Macaco', 'Kick-up', 'Aerial', 'Butterfly'],
      'GoDowns': ['Squat down', 'Corkspin drop', 'Knee drop', 'Knee rock', 'Hook', 'Power step back', 'Power front kick', 'Coindrop', 'Power back kick']
    };
    return categoryMovesMap[category] || [];
  };

  const getRequiredMoves = () => {
    if (badge.category === 'Power') {
      if (badge.id === 'ground-power-master') {
        return ['Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill'];
      } else if (badge.id === 'air-power-master') {
        return ['Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
      }
    } else if (badge.category === 'Level') {
      // Return the specific moves for each level badge
      const levelMovesMap = {
        'beginner-master': ['Two step', 'Salsa step', 'CC', 'Kick outs', 'Yoga freeze', 'Turtle freeze', 'Butt spin', 'Cartwheel', 'Squat down', 'Corkspin drop'],
        'novice-master': ['Indian step', 'Charlie rock', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Baby freeze', 'Spider freeze', 'Headstand', 'Back spin', 'Baby swipe', 'Ormen', 'Knee drop'],
        'intermediate-master': ['Battle rock', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Hook', 'Macaco', 'Icey Ice'],
        'advanced-master': ['Skater', 'Jerk rock', 'Gorilla 6 step', 'Knock out', 'Pretzels', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Power step back', 'Power front kick', 'Kick-up', 'Aerial', 'Butterfly'],
        'skilled-master': ['Airchair', 'Suicide', 'L-kick', 'V-kick', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin', 'Coindrop', 'Power back kick'],
        'master': ['Halo freeze', 'Sandwich', 'Hollowback', 'Airflare', 'Airtrack', 'Starstruck', 'Critical', 'Corkscrew'],
        'grandmaster': [] // Special case - will show level badges instead
      };
      return levelMovesMap[badge.id] || [];
    }
    return getCategoryMoves(badge.category);
  };

  const requiredMoves = getRequiredMoves();
  
  // Calculate progress differently for Grandmaster badge
  let progress;
  let masteredInCategory;
  
  if (badge.id === 'grandmaster') {
    const levelBadges = badges.filter(b => b.category === 'Level' && b.id !== 'grandmaster');
    const earnedLevelBadges = levelBadges.filter(b => b.unlock(masteredMoves));
    progress = Math.round((earnedLevelBadges.length / levelBadges.length) * 100);
    masteredInCategory = earnedLevelBadges;
  } else {
    masteredInCategory = masteredMoves.filter(move => 
      requiredMoves.includes(move.name)
    );
    progress = Math.round((masteredInCategory.length / requiredMoves.length) * 100);
  }

  // Get tips based on badge type
  const getBadgeTips = () => {
    if (badge.id === 'grandmaster') {
      return [
        "Focus on earning all level mastery badges first",
        "Master each level completely before moving to the next",
        "Practice consistently across all move categories",
        "Build a strong foundation with beginner and intermediate moves"
      ];
    } else if (badge.category === 'Level') {
      return [
        "Focus on mastering all moves in this level",
        "Practice regularly to build consistency",
        "Don't rush - quality over quantity",
        "Build a strong foundation for the next level"
      ];
    } else if (badge.category === 'Toprock') {
      return [
        "Focus on rhythm and musicality",
        "Practice with different tempos",
        "Learn to transition smoothly between steps",
        "Develop your own unique style"
      ];
    } else if (badge.category === 'Footwork') {
      return [
        "Master the basic steps first",
        "Focus on clean execution",
        "Practice combinations and transitions",
        "Build speed gradually"
      ];
    } else if (badge.category === 'Freezes') {
      return [
        "Build strength in your core and arms",
        "Practice balance exercises",
        "Start with easier freezes",
        "Hold positions longer each time"
      ];
    } else if (badge.category === 'Power') {
      return [
        "Build explosive strength",
        "Practice momentum and flow",
        "Master the basics before advanced moves",
        "Focus on technique over speed"
      ];
    } else if (badge.category === 'Tricks') {
      return [
        "Practice in a safe environment",
        "Master the fundamentals first",
        "Build confidence gradually",
        "Focus on clean execution"
      ];
    } else if (badge.category === 'GoDowns') {
      return [
        "Learn smooth transitions",
        "Practice control and precision",
        "Master the basic drops first",
        "Focus on flow between moves"
      ];
    }
    return [
      "Practice regularly",
      "Focus on technique",
      "Build strength gradually",
      "Stay consistent with training"
    ];
  };

  const tips = getBadgeTips();

  return (
    <div className="badge-detail-page">
      <div className="badge-detail-container">
        {/* Header */}
        <div className="badge-detail-header">
          <button onClick={() => navigate('/badges')} className="back-button">
            <FaArrowLeft size={16} />
            <span>Back to Badges</span>
          </button>
        </div>

        {/* Badge Info */}
        <div className="badge-detail-content">
          <div className="badge-hero">
            <div className="badge-icon-large">
              {badge.image.startsWith('/src/assets/badges/') || typeof badge.image === 'string' && badge.image.includes('.png') ? (
                <img src={badge.image} alt={badge.name} className="badge-image-large" />
              ) : (
                <span className="badge-emoji-large">{badge.image}</span>
              )}
              {isEarned ? (
                <div className="badge-status-earned">
                  <FaTrophy size={24} />
                  <span>Earned!</span>
                </div>
              ) : (
                <div className="badge-status-locked">
                  <FaLock size={24} />
                  <span>Locked</span>
                </div>
              )}
            </div>
            <div className="badge-info">
              <h1 className="badge-title">{badge.name}</h1>
              <p className="badge-description">{badge.description}</p>
              <div className="badge-requirement">
                <h3>Requirement:</h3>
                <p>{badge.requirement}</p>
              </div>
              {isEarned && (
                <div className="badge-achievement">
                  <FaStar className="achievement-icon" />
                  <span>Congratulations! You've mastered this category!</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-header">
              <h3>Progress</h3>
              <span className="progress-percentage">{progress}% Complete</span>
            </div>
            <div className="progress-bar-large">
              <div className="progress-fill-large" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              {badge.id === 'grandmaster' ? (
                <span>{masteredInCategory.length} / {badges.filter(b => b.category === 'Level' && b.id !== 'grandmaster').length} level badges earned</span>
              ) : (
                <span>{masteredInCategory.length} / {requiredMoves.length} moves mastered</span>
              )}
            </div>
          </div>

          {/* Required Moves or Level Badges */}
          {badge.id === 'grandmaster' ? (
            <div className="required-moves-section">
              <h3>Required Level Mastery Badges</h3>
              <div className="moves-grid">
                {badges.filter(b => b.category === 'Level' && b.id !== 'grandmaster').map((levelBadge) => {
                  const isEarned = levelBadge.unlock(masteredMoves);
                  
                  return (
                    <div key={levelBadge.id} className={`move-card ${isEarned ? 'mastered' : 'locked'}`}>
                      <div className="move-status">
                        {isEarned ? <FaCheck size={16} /> : <FaLock size={16} />}
                      </div>
                      <div className="move-info">
                        <h4 className="move-name">{levelBadge.name}</h4>
                        <p className="move-category">{levelBadge.description}</p>
                        <p className="move-xp">Level Badge</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="required-moves-section">
              <h3>Required Moves</h3>
              <div className="moves-grid">
                {requiredMoves.map((moveName) => {
                  const move = moves.find(m => m.name === moveName);
                  const isMastered = masteredMoves.some(m => m.name === moveName);
                  
                  const handleMoveClick = () => {
                    navigate(`/moves?move=${encodeURIComponent(moveName)}`);
                  };
                  
                  return (
                    <div 
                      key={moveName} 
                      className={`move-card ${isMastered ? 'mastered' : 'locked'}`}
                      onClick={handleMoveClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="move-status">
                        {isMastered ? <FaCheck size={16} /> : <FaLock size={16} />}
                      </div>
                      <div className="move-info">
                        <h4 className="move-name">{moveName}</h4>
                        <p className="move-category">{move?.category} • {move?.level}</p>
                        <p className="move-xp">+{move?.xp} XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
} 