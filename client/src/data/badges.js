// Badges Data
import topbadge from '../assets/badges/topbadge.png';
import footwork from '../assets/badges/footwork.png';
import freezes from '../assets/badges/freezes.png';
import Powermoves from '../assets/badges/Powermoves.png';
import Tricks from '../assets/badges/Tricks.png';
import Godown from '../assets/badges/Godown.png';
import air from '../assets/badges/air.png';
import ground from '../assets/badges/ground.png';
import beginner from '../assets/badges/beginner.png';
import novice from '../assets/badges/novice.png';
import intermediate from '../assets/badges/intermediate.png';
import advanced from '../assets/badges/Advanced.png';
import skilled from '../assets/badges/skilled.png';
import master from '../assets/badges/master.png';
import grandmaster from '../assets/badges/grandmaster.png';



export const badges = [
  {
    id: 'toprock-master',
    name: 'Toprock Master',
    description: 'Complete all Toprock moves',
    image: topbadge,
    category: 'Toprock',
    requirement: 'Complete all moves in Toprock category',
    unlock: (masteredMoves) => {
      const toprockMoves = ['Two step', 'Salsa step', 'Indian step', 'Charlie rock', 'Battle rock', 'Skater', 'Jerk rock'];
      return toprockMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'footwork-master',
    name: 'Footwork Master',
    description: 'Complete all Footwork moves',
    image: footwork,
    category: 'Footwork',
    requirement: 'Complete all moves in Footwork category',
    unlock: (masteredMoves) => {
      const footworkMoves = ['CC', 'Kick outs', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Gorilla 6 step', 'Knock out', 'Pretzels'];
      return footworkMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'freezes-master',
    name: 'Freezes Master',
    description: 'Complete all Freezes moves',
    image: freezes,
    category: 'Freezes',
    requirement: 'Complete all moves in Freezes category',
    unlock: (masteredMoves) => {
      const freezesMoves = ['Yoga freeze', 'Turtle freeze', 'Baby freeze', 'Spider freeze', 'Headstand', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Airchair', 'Suicide', 'L-kick', 'V-kick'];
      return freezesMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'power-master',
    name: 'Power Master',
    description: 'Complete all Power moves',
    image: Powermoves,
    category: 'Power',
    requirement: 'Complete all moves in Power category',
    unlock: (masteredMoves) => {
      const powerMoves = ['Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
      return powerMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'tricks-master',
    name: 'Tricks Master',
    description: 'Complete all Tricks moves',
    image: Tricks,
    category: 'Tricks',
    requirement: 'Complete all moves in Tricks category',
    unlock: (masteredMoves) => {
      const tricksMoves = ['Cartwheel', 'Ormen', 'Icey Ice', 'Macaco', 'Kick-up', 'Aerial', 'Butterfly'];
      return tricksMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'godowns-master',
    name: 'GoDowns Master',
    description: 'Complete all GoDowns moves',
    image: Godown,
    category: 'GoDowns',
    requirement: 'Complete all moves in GoDowns category',
    unlock: (masteredMoves) => {
      const godownsMoves = ['Squat down', 'Corkspin drop', 'Knee drop', 'Knee rock', 'Hook', 'Power step back', 'Power front kick', 'Coindrop', 'Power back kick'];
      return godownsMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'ground-power-master',
    name: 'Ground Master',
    description: 'Complete all ground power moves',
    image: ground,
    category: 'Power',
    requirement: 'Complete all ground power moves',
    unlock: (masteredMoves) => {
      const groundPowerMoves = ['Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill'];
      return groundPowerMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'air-power-master',
    name: 'Air Power Master',
    description: 'Complete all air power moves',
    image: air,
    category: 'Power',
    requirement: 'Complete all air power moves',
    unlock: (masteredMoves) => {
      const airPowerMoves = ['Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin'];
      return airPowerMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'beginner-master',
    name: 'Beginner',
    description: 'Complete all Beginner level moves',
    image: beginner,
    category: 'Level',
    requirement: 'Complete all Beginner level moves',
    unlock: (masteredMoves) => {
      const beginnerMoves = ['Two step', 'Salsa step', 'CC', 'Kick outs', 'Yoga freeze', 'Turtle freeze', 'Butt spin', 'Cartwheel', 'Squat down', 'Corkspin drop'];
      return beginnerMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'novice-master',
    name: 'Novice',
    description: 'Complete all Novice level moves',
    image: novice,
    category: 'Level',
    requirement: 'Complete all Novice level moves',
    unlock: (masteredMoves) => {
      const noviceMoves = ['Indian step', 'Charlie rock', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Baby freeze', 'Spider freeze', 'Headstand', 'Back spin', 'Baby swipe', 'Ormen', 'Knee drop'];
      return noviceMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'intermediate-master',
    name: 'Intermediate',
    description: 'Complete all Intermediate level moves',
    image: intermediate,
    category: 'Level',
    requirement: 'Complete all Intermediate level moves',
    unlock: (masteredMoves) => {
      const intermediateMoves = ['Battle rock', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Hook', 'Macaco', 'Icey Ice'];
      return intermediateMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'advanced-master',
    name: 'Advanced',
    description: 'Complete all Advanced level moves',
    image: advanced,
    category: 'Level',
    requirement: 'Complete all Advanced level moves',
    unlock: (masteredMoves) => {
      const advancedMoves = ['Skater', 'Jerk rock', 'Gorilla 6 step', 'Knock out', 'Pretzels', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Power step back', 'Power front kick', 'Kick-up', 'Aerial', 'Butterfly'];
      return advancedMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'skilled-master',
    name: 'Skilled',
    description: 'Complete all Skilled level moves',
    image: skilled,
    category: 'Level',
    requirement: 'Complete all Skilled level moves',
    unlock: (masteredMoves) => {
      const skilledMoves = ['Airchair', 'Suicide', 'L-kick', 'V-kick', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin', 'Coindrop', 'Power back kick'];
      return skilledMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Complete all Master level moves',
    image: master,
    category: 'Level',
    requirement: 'Complete all Master level moves',
    unlock: (masteredMoves) => {
      const masterMoves = ['Two step', 'Salsa step', 'Indian step', 'Charlie rock', 'Battle rock', 'Skater', 'Jerk rock', 'CC', 'Kick outs', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Gorilla 6 step', 'Knock out', 'Pretzels', 'Yoga freeze', 'Turtle freeze', 'Baby freeze', 'Spider freeze', 'Headstand', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Airchair', 'Suicide', 'L-kick', 'V-kick', 'Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin', 'Cartwheel', 'Ormen', 'Icey Ice', 'Macaco', 'Kick-up', 'Aerial', 'Butterfly', 'Squat down', 'Corkspin drop', 'Knee drop', 'Knee rock', 'Hook', 'Power step back', 'Power front kick', 'Coindrop', 'Power back kick'];
      return masterMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Complete all moves in the game',
    image: grandmaster,
    category: 'Level',
    requirement: 'Complete all moves in the game',
    unlock: (masteredMoves) => {
      const allMoves = ['Two step', 'Salsa step', 'Indian step', 'Charlie rock', 'Battle rock', 'Skater', 'Jerk rock', 'CC', 'Kick outs', 'Coffee grinder', '2 step', '3 step', 'Hooks', 'Zulu spin', 'Baby love', 'Knee rock', 'Russian step', 'Over/under lap', '6 step', '4 step', '5 step', '7 step', '8 step', 'Peter pan', 'Permanent increase', 'Half sweeps', 'Monkey swing', 'Gorilla 6 step', 'Knock out', 'Pretzels', 'Yoga freeze', 'Turtle freeze', 'Baby freeze', 'Spider freeze', 'Headstand', 'Handstand', 'Shoulder freeze', 'Elbow freeze', 'Chairfreeze', '1-hand freeze', '1-hand elbow freeze', 'Scorpion', 'Airbaby', 'Flag-freeze', 'Airchair', 'Suicide', 'L-kick', 'V-kick', 'Butt spin', 'Back spin', 'Baby swipe', 'Windmill', 'Swipe', 'Headspin', 'Turtles', 'Flare', 'Tapmill', 'Babymill', 'Bellymill', 'Head swipe', 'Headdrill', 'Halo', 'Freeze spin', 'Elbow track', 'Barrel mill', 'Nutcracker', 'Airplanes', 'Superman', 'Tombstones', 'T-flare', '1990', '2000', 'Shoulder halo', 'Shoulder spin', 'Cartwheel', 'Ormen', 'Icey Ice', 'Macaco', 'Kick-up', 'Aerial', 'Butterfly', 'Squat down', 'Corkspin drop', 'Knee drop', 'Knee rock', 'Hook', 'Power step back', 'Power front kick', 'Coindrop', 'Power back kick'];
      return allMoves.every(move => masteredMoves.some(m => m.name === move));
    }
  }
]; 