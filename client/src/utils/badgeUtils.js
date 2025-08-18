// Utility functions for badge unlocking logic

// Get moves for a specific category (fallback for legacy badges)
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

// Get moves for a specific level (fallback for legacy badges)
const getLevelMoves = (level) => {
  const levelMovesMap = {
    'beginner': ['Two step', 'Salsa step', 'CC', 'Kick outs', 'Yoga freeze', 'Turtle freeze', 'Butt spin', 'Cartwheel', 'Squat down', 'Corkspin drop'],
    'novice': ['Indian step', 'Charlie rock', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Baby freeze', 'Spider freeze', 'Headstand', 'Back spin', 'Baby swipe', 'Ormen', 'Knee drop', 'Knee rock drop'],
    'intermediate': ['Battle rock', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Hook', 'Macaco', 'Icey Ice'],
    'advanced': ['Skater', 'Jerk rock', 'Gorilla 6 step', 'Knock out', 'Pretzels', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Power step back', 'Power front kick', 'Kick-up', 'Aerial', 'Butterfly'],
    'skilled': ['Airchair', 'Suicide', 'L-kick', 'V-kick', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin', 'Coindrop'],
    'master': ['Halo freeze', 'Sandwich', 'Hollowback', 'Airflare', 'Airtrack', 'Starstruck', 'Critical', 'Corkscrew'],
    'grandmaster': [] // Special case - will show level badges instead
  };
  return levelMovesMap[level] || [];
};

// Get required moves for a badge (supports both new and legacy structure)
export const getBadgeRequiredMoves = (badge, allMoves = []) => {
  if (!badge) return [];

  // If badge has requirements field with moves array (new structure)
  if (badge.requirements && badge.requirements.moves && Array.isArray(badge.requirements.moves)) {
    const requiredMoveIds = badge.requirements.moves;
    const requiredMoves = [];
    
    for (const moveId of requiredMoveIds) {
      const move = allMoves.find(m => m._id === moveId || m.id === moveId);
      if (move) {
        requiredMoves.push(move.name);
      }
    }
    
    return requiredMoves;
  }

  // Legacy fallback based on badge category and name
  if (badge.category && badge.category !== 'Level' && badge.category !== 'Special') {
    return getCategoryMoves(badge.category);
  }

  if (badge.category === 'Special' || badge.category === 'Level') {
    const level = badge.name.toLowerCase();
    return getLevelMoves(level);
  }

  // Handle power subcategory badges
  if (badge.name === 'Ground Master') {
    return ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin'];
  }

  if (badge.name === 'Air Master') {
    return ['Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
  }

  return [];
};

// Check if a badge is unlocked based on mastered moves
export const isBadgeUnlocked = (badge, masteredMoves, allMoves = []) => {
  if (!badge || !masteredMoves) return false;

  const masteredMoveNames = masteredMoves.map(move => move.name);
  const requiredMoves = getBadgeRequiredMoves(badge, allMoves);

  // If no required moves, badge cannot be unlocked
  if (requiredMoves.length === 0) return false;

  // Check if all required moves are mastered
  const masteredInCategory = masteredMoveNames.filter(moveName => 
    requiredMoves.includes(moveName)
  );

  return masteredInCategory.length === requiredMoves.length;
};

// Calculate progress for a badge
export const getBadgeProgress = (badge, masteredMoves, allMoves = []) => {
  if (!badge || !masteredMoves) return 0;

  const masteredMoveNames = masteredMoves.map(move => move.name);
  const requiredMoves = getBadgeRequiredMoves(badge, allMoves);

  // If no required moves, return 0
  if (requiredMoves.length === 0) return 0;

  const masteredInCategory = masteredMoveNames.filter(moveName => 
    requiredMoves.includes(moveName)
  );

  return Math.round((masteredInCategory.length / requiredMoves.length) * 100);
}; 