// Utility functions for badge unlocking logic

// Get moves for a specific category
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

// Get moves for a specific level
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

// Check if a badge is unlocked based on mastered moves
export const isBadgeUnlocked = (badge, masteredMoves) => {
  if (!badge || !masteredMoves) return false;

  const masteredMoveNames = masteredMoves.map(move => move.name);

  // Handle category badges
  if (badge.category && badge.category !== 'Level' && badge.category !== 'Special') {
    const requiredMoves = getCategoryMoves(badge.category);
    const masteredInCategory = masteredMoveNames.filter(moveName => 
      requiredMoves.includes(moveName)
    );
    return masteredInCategory.length === requiredMoves.length;
  }

  // Handle level badges
  if (badge.category === 'Special' || badge.category === 'Level') {
    // Use badge.name for level badges since they don't have an id field
    const level = badge.name.toLowerCase();
    const requiredMoves = getLevelMoves(level);
    const masteredInLevel = masteredMoveNames.filter(moveName => 
      requiredMoves.includes(moveName)
    );
    return masteredInLevel.length === requiredMoves.length;
  }

  // Handle power subcategory badges
  if (badge.name === 'Ground Master') {
    const groundPowerMoves = ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin'];
    const masteredGroundPower = masteredMoveNames.filter(moveName => 
      groundPowerMoves.includes(moveName)
    );
    return masteredGroundPower.length === groundPowerMoves.length;
  }

  if (badge.name === 'Air Master') {
    const airPowerMoves = ['Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
    const masteredAirPower = masteredMoveNames.filter(moveName => 
      airPowerMoves.includes(moveName)
    );
    return masteredAirPower.length === airPowerMoves.length;
  }

  // Handle grandmaster badge (requires all level badges)
  if (badge.name === 'Grandmaster') {
    // Check if all level badges are unlocked
    const levelBadgeNames = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master'];
    const allLevelMoves = levelBadgeNames.flatMap(level => getLevelMoves(level.toLowerCase()));
    const masteredLevelMoves = masteredMoveNames.filter(moveName => allLevelMoves.includes(moveName));
    return masteredLevelMoves.length === allLevelMoves.length;
  }

  return false;
};

// Calculate progress for a badge
export const getBadgeProgress = (badge, masteredMoves) => {
  if (!badge || !masteredMoves) return 0;

  const masteredMoveNames = masteredMoves.map(move => move.name);

  // Handle category badges
  if (badge.category && badge.category !== 'Level' && badge.category !== 'Special') {
    const requiredMoves = getCategoryMoves(badge.category);
    const masteredInCategory = masteredMoveNames.filter(moveName => 
      requiredMoves.includes(moveName)
    );
    return Math.round((masteredInCategory.length / requiredMoves.length) * 100);
  }

  // Handle level badges
  if (badge.category === 'Special' || badge.category === 'Level') {
    // Use badge.name for level badges since they don't have an id field
    const level = badge.name.toLowerCase();
    const requiredMoves = getLevelMoves(level);
    const masteredInLevel = masteredMoveNames.filter(moveName => 
      requiredMoves.includes(moveName)
    );
    return Math.round((masteredInLevel.length / requiredMoves.length) * 100);
  }

  // Handle power subcategory badges
  if (badge.name === 'Ground Master') {
    const groundPowerMoves = ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin'];
    const masteredGroundPower = masteredMoveNames.filter(moveName => 
      groundPowerMoves.includes(moveName)
    );
    return Math.round((masteredGroundPower.length / groundPowerMoves.length) * 100);
  }

  if (badge.name === 'Air Master') {
    const airPowerMoves = ['Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
    const masteredAirPower = masteredMoveNames.filter(moveName => 
      airPowerMoves.includes(moveName)
    );
    return Math.round((masteredAirPower.length / airPowerMoves.length) * 100);
  }

  // Handle grandmaster badge progress
  if (badge.name === 'Grandmaster') {
    const levelBadgeNames = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master'];
    const allLevelMoves = levelBadgeNames.flatMap(level => getLevelMoves(level.toLowerCase()));
    const masteredLevelMoves = masteredMoveNames.filter(moveName => allLevelMoves.includes(moveName));
    return Math.round((masteredLevelMoves.length / allLevelMoves.length) * 100);
  }

  return 0;
}; 