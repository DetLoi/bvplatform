import { useNavigate } from 'react-router-dom';

export default function BadgeCard({ badge, isEarned, masteredMoves = [] }) {
  const navigate = useNavigate();
  
  // Calculate progress for category badges
  const getProgress = () => {
    if (isEarned) return 100;
    
    // For category badges, calculate progress based on moves in that category
    if (badge.category && badge.category !== 'Master') {
      const categoryMoves = getCategoryMoves(badge.category);
      const masteredInCategory = masteredMoves.filter(move => 
        categoryMoves.includes(move.name)
      ).length;
      return Math.round((masteredInCategory / categoryMoves.length) * 100);
    }
    
    return 0;
  };

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

  const progress = getProgress();

  const handleClick = () => {
    navigate(`/badges/${badge.id}`);
  };

  return (
    <div className={`badge-card ${isEarned ? 'earned' : 'locked'}`} onClick={handleClick}>
      <div className="badge-icon">
        {badge.image.startsWith('/src/assets/badges/') ? (
          <img src={badge.image} alt={badge.name} className="badge-image" />
        ) : (
          <span className="badge-emoji">{badge.image}</span>
        )}
      </div>
      <div className="badge-info">
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-description">{badge.description}</p>
        {!isEarned && progress > 0 && (
          <div className="badge-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{progress}% Complete</span>
          </div>
        )}
      </div>
      <div className="badge-status">
        {isEarned ? (
          <span className="status-earned">✓ Earned</span>
        ) : (
          <span className="status-locked">🔒 Locked</span>
        )}
      </div>
    </div>
  );
}
