// Seeder data without image imports
export const moves = [
  // Level 1 – Beginner
  { id: 1, name: 'Two step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Knee drop', 'Salsa step', 'CC'] },
  { id: 2, name: 'Salsa step', category: 'Toprock', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Two step', 'Indian step', 'Kick outs'] },
  { id: 3, name: 'CC', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Two step', 'Kick outs', 'Yoga freeze'] },
  { id: 4, name: 'Kick outs', category: 'Footwork', level: 'Beginner', xp: 25, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['CC', 'Salsa step', 'Turtle freeze'] },
  { id: 5, name: 'Yoga freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['CC', 'Turtle freeze', 'Baby freeze'] },
  { id: 6, name: 'Turtle freeze', category: 'Freezes', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Kick outs', 'Yoga freeze', 'Windmill'] },
  { id: 7, name: 'Butt spin', category: 'Power', level: 'Beginner', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Back spin', 'Cartwheel', 'Squat down'] },
  { id: 8, name: 'Cartwheel', category: 'Tricks', level: 'Beginner', xp: 40, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Butt spin', 'Macaco', 'Aerial'] },
  { id: 9, name: 'Squat down', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Butt spin', 'Corkspin drop', 'Knee drop'] },
  { id: 10, name: 'Corkspin drop', category: 'GoDowns', level: 'Beginner', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Squat down', 'Knee drop', 'Hook'] },

  // Level 2 – Novice
  { id: 11, name: 'Indian step', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Salsa step', 'Charlie rock', 'Battle rock'] },
  { id: 12, name: 'Charlie rock', category: 'Toprock', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Indian step', 'Battle rock', 'Skater'] },
  { id: 13, name: 'Coffee grinder', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['2 step', '3 step', '6 step'] },
  { id: 14, name: '2 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Coffee grinder', '3 step', 'Hooks'] },
  { id: 15, name: '3 step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['2 step', 'Coffee grinder', '4 step'] },
  { id: 16, name: 'Hooks', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['2 step', 'Zulu spin', 'Half sweeps'] },
  { id: 17, name: 'Zulu spin', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Hooks', 'Baby love', 'Monkey swing'] },
  { id: 18, name: 'Baby love', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Zulu spin', 'Knee rock', 'Russian step'] },
  { id: 19, name: 'Knee rock', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Baby love', 'Russian step', 'Knee drop'] },
  { id: 20, name: 'Russian step', category: 'Footwork', level: 'Novice', xp: 35, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Knee rock', 'Baby love', 'Over/under lap'] },
  { id: 21, name: 'Baby freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Yoga freeze', 'Spider freeze', 'Halo'] },
  { id: 22, name: 'Spider freeze', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Baby freeze', 'Headstand', 'Handstand'] },
  { id: 23, name: 'Headstand', category: 'Freezes', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Spider freeze', 'Handstand', 'Headspin'] },
  { id: 24, name: 'Back spin', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Butt spin', 'Baby swipe', 'Windmill'] },
  { id: 25, name: 'Baby swipe', category: 'Power', level: 'Novice', xp: 60, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Back spin', 'Swipe', 'Turtles'] },
  { id: 26, name: 'Ormen', category: 'Tricks', level: 'Novice', xp: 50, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Cartwheel', 'Macaco', 'Icey Ice'] },
  { id: 27, name: 'Knee drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Squat down', 'Knee rock', 'Hook'] },
  { id: 28, name: 'Knee rock drop', category: 'GoDowns', level: 'Novice', xp: 45, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Knee drop', 'Knee rock', 'Power step back'] },

  // Level 3 – Intermediate
  { id: 29, name: 'Battle rock', category: 'Toprock', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Indian step', 'Charlie rock', 'Skater'] },
  { id: 30, name: 'Over/under lap', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Russian step', '6 step', 'Pretzels'] },
  { id: 31, name: '6 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Coffee grinder', 'Over/under lap', 'Gorilla 6 step'] },
  { id: 32, name: '4 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['3 step', '5 step', '7 step'] },
  { id: 33, name: '5 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['4 step', '6 step', '7 step'] },
  { id: 34, name: '7 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['6 step', '8 step', 'Peter pan'] },
  { id: 35, name: '8 step', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['7 step', 'Peter pan', 'Permanent increase'] },
  { id: 36, name: 'Peter pan', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['7 step', '8 step', 'Monkey swing'] },
  { id: 37, name: 'Permanent increase', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['8 step', 'Half sweeps', 'Monkey swing'] },
  { id: 38, name: 'Half sweeps', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Hooks', 'Permanent increase', 'Knock out'] },
  { id: 39, name: 'Monkey swing', category: 'Footwork', level: 'Intermediate', xp: 65, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Zulu spin', 'Peter pan', 'Permanent increase'] },
  { id: 40, name: 'Handstand', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Headstand', 'Shoulder freeze', 'Elbow freeze'] },
  { id: 41, name: 'Shoulder freeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Handstand', 'Elbow freeze', 'Chairfreeze'] },
  { id: 42, name: 'Elbow freeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Shoulder freeze', 'Chairfreeze', '1-hand freeze'] },
  { id: 43, name: 'Chairfreeze', category: 'Freezes', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Shoulder freeze', 'Elbow freeze', '1-hand freeze'] },
  { id: 44, name: 'Windmill', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Back spin', 'Turtle freeze', 'Swipe'] },
  { id: 45, name: 'Swipe', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Baby swipe', 'Windmill', 'Headspin'] },
  { id: 46, name: 'Headspin', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Headstand', 'Swipe', 'Turtles'] },
  { id: 47, name: 'Turtles', category: 'Power', level: 'Intermediate', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Turtle freeze', 'Headspin', 'Flare'] },
  { id: 48, name: 'Hook', category: 'GoDowns', level: 'Intermediate', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Knee drop', 'Corkspin drop', 'Power step back'] },
  { id: 49, name: 'Macaco', category: 'Tricks', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Cartwheel', 'Ormen', 'Kick-up'] },
  { id: 50, name: 'Icey Ice', category: 'Tricks', level: 'Intermediate', xp: 80, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Ormen', 'Halo', 'Aerial'] },

  // Level 4 – Advanced
  { id: 51, name: 'Skater', category: 'Toprock', level: 'Advanced', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Battle rock', 'Jerk rock', 'Gorilla 6 step'] },
  { id: 52, name: 'Jerk rock', category: 'Toprock', level: 'Advanced', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Skater', 'Battle rock', 'Knock out'] },
  { id: 53, name: 'Gorilla 6 step', category: 'Footwork', level: 'Advanced', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['6 step', 'Knock out', 'Pretzels'] },
  { id: 54, name: 'Knock out', category: 'Footwork', level: 'Advanced', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Gorilla 6 step', 'Jerk rock', 'Pretzels'] },
  { id: 55, name: 'Pretzels', category: 'Footwork', level: 'Advanced', xp: 75, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Over/under lap', 'Gorilla 6 step', 'Knock out'] },
  { id: 56, name: '1-hand freeze', category: 'Freezes', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Elbow freeze', 'Chairfreeze', '1-hand elbow freeze'] },
  { id: 57, name: '1-hand elbow freeze', category: 'Freezes', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['1-hand freeze', 'Elbow freeze', 'Scorpion'] },
  { id: 58, name: 'Scorpion', category: 'Freezes', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['1-hand elbow freeze', 'Airbaby', 'Flag-freeze'] },
  { id: 59, name: 'Airbaby', category: 'Freezes', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Scorpion', 'Flag-freeze', 'Airchair'] },
  { id: 60, name: 'Flag-freeze', category: 'Freezes', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Scorpion', 'Airbaby', 'Suicide'] },
  { id: 61, name: 'Flare', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Turtles', 'Tapmill', 'Babymill'] },
  { id: 62, name: 'Tapmill', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Flare', 'Babymill', 'Bellymill'] },
  { id: 63, name: 'Babymill', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Flare', 'Tapmill', 'Bellymill'] },
  { id: 64, name: 'Bellymill', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Babymill', 'Tapmill', 'Head swipe'] },
  { id: 65, name: 'Head swipe', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Bellymill', 'Headdrill', 'Halo'] },
  { id: 66, name: 'Headdrill', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Head swipe', 'Halo', 'Freeze spin'] },
  { id: 67, name: 'Halo', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Baby freeze', 'Headspin', 'Icey Ice'] },
  { id: 68, name: 'Freeze spin', category: 'Power', level: 'Advanced', xp: 150, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Headdrill', 'Halo', 'Shoulder halo'] },
  { id: 69, name: 'Power step back', category: 'GoDowns', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Hook', 'Power front kick', 'Coindrop'] },
  { id: 70, name: 'Power front kick', category: 'GoDowns', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Power step back', 'Kick-up', 'Power back kick'] },
  { id: 71, name: 'Kick-up', category: 'Tricks', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Macaco', 'Power front kick', 'Aerial'] },
  { id: 72, name: 'Aerial', category: 'Tricks', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Kick-up', 'Cartwheel', 'Butterfly'] },
  { id: 73, name: 'Butterfly', category: 'Tricks', level: 'Advanced', xp: 100, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Aerial', 'Butterfly Twist', 'Backflip'] },

  // Level 5 – Skilled
  { id: 74, name: 'Airchair', category: 'Freezes', level: 'Skilled', xp: 500, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Airbaby', 'Suicide', 'L-kick'] },
  { id: 75, name: 'Suicide', category: 'Freezes', level: 'Skilled', xp: 500, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Airchair', 'Flag-freeze', 'V-kick'] },
  { id: 76, name: 'L-kick', category: 'Freezes', level: 'Skilled', xp: 500, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Airchair', 'V-kick', 'Halo freeze'] },
  { id: 77, name: 'V-kick', category: 'Freezes', level: 'Skilled', xp: 500, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Suicide', 'L-kick', 'Sandwich'] },
  { id: 78, name: 'Elbow track', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Barrel mill', 'Nutcracker', 'Airplanes'] },
  { id: 79, name: 'Barrel mill', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Elbow track', 'Nutcracker', 'Superman'] },
  { id: 80, name: 'Nutcracker', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Elbow track', 'Barrel mill', 'Tombstones'] },
  { id: 81, name: 'Airplanes', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Elbow track', 'Superman', 'T-flare'] },
  { id: 82, name: 'Superman', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Airplanes', 'Barrel mill', 'Tombstones'] },
  { id: 83, name: 'Tombstones', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Nutcracker', 'Superman', 'T-flare'] },
  { id: 84, name: 'T-flare', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Airplanes', 'Tombstones', '1990'] },
  { id: 85, name: '1990', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['T-flare', '2000', 'Shoulder halo'] },
  { id: 86, name: '2000', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['1990', 'Shoulder halo', 'Shoulder spin'] },
  { id: 87, name: 'Shoulder halo', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['1990', '2000', 'Shoulder spin'] },
  { id: 88, name: 'Shoulder spin', category: 'Power', level: 'Skilled', xp: 1500, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['2000', 'Shoulder halo', 'Airflare'] },
  { id: 89, name: 'Coindrop', category: 'GoDowns', level: 'Skilled', xp: 400, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Power step back', 'Power back kick', 'Backflip'] },
  { id: 90, name: 'Power back kick', category: 'GoDowns', level: 'Skilled', xp: 400, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Coindrop', 'Power front kick', 'Butterfly Twist'] },
  { id: 91, name: 'Backflip', category: 'Tricks', level: 'Skilled', xp: 700, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Coindrop', 'Butterfly Twist', 'Corkscrew'] },
  { id: 92, name: 'Butterfly Twist', category: 'Tricks', level: 'Skilled', xp: 700, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Butterfly', 'Power back kick', 'Backflip'] },

  // Level 6 – Master
  { id: 93, name: 'Halo freeze', category: 'Freezes', level: 'Master', xp: 700, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['L-kick', 'Sandwich', 'Hollowback'] },
  { id: 94, name: 'Sandwich', category: 'Freezes', level: 'Master', xp: 700, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['V-kick', 'Halo freeze', 'Hollowback'] },
  { id: 95, name: 'Hollowback', category: 'Freezes', level: 'Master', xp: 700, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Halo freeze', 'Sandwich', 'Airflare'] },
  { id: 96, name: 'Airflare', category: 'Power', level: 'Master', xp: 2000, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Shoulder spin', 'Hollowback', 'Airtrack'] },
  { id: 97, name: 'Airtrack', category: 'Power', level: 'Master', xp: 2000, videoUrl: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', recommendations: ['Airflare', 'Starstruck', 'Critical'] },
  { id: 98, name: 'Starstruck', category: 'Power', level: 'Master', xp: 2000, videoUrl: 'https://www.youtube.com/watch?v=QZ9vXj8BpM0', recommendations: ['Airtrack', 'Critical', 'Corkscrew'] },
  { id: 99, name: 'Critical', category: 'Power', level: 'Master', xp: 2000, videoUrl: 'https://www.youtube.com/watch?v=6WREgZ9YtYI', recommendations: ['Airtrack', 'Starstruck', 'Corkscrew'] },
  { id: 100, name: 'Corkscrew', category: 'Tricks', level: 'Master', xp: 900, videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A', recommendations: ['Backflip', 'Butterfly Twist', 'Starstruck'] }
];

export const users = [
  {
    id: 1,
    username: 'admin',
    name: 'Admin User',
    email: 'admin@breakverse.com',
    password: 'admin123',
    level: 15,
    xp: 15000,
    joinDate: '2024-01-01',
    status: 'admin',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop',
    crew: 'Specific Kidz',
    specialty: 'Power Moves',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Windmill', 'Headspin', 'Flare', 'Back spin', 'Baby swipe', 'Turtles', 'Tapmill'],
    pendingMoves: [],
    achievements: 12,
    battleVideos: ['https://youtube.com/watch?v=xyz123', 'https://vimeo.com/uvw456'],
    bio: 'Admin of Breakverse - helping breakers level up their game!',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@admin_breaker',
      facebook: 'Admin Breaker'
    }
  },
  {
    id: 2,
    username: 'dloi',
    name: 'DLoi',
    email: 'dloi@example.com',
    password: 'password123',
    level: 12,
    xp: 8500,
    joinDate: '2024-01-15',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop',
    crew: 'Specific Kidz',
    specialty: 'Power Moves',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Windmill', 'Headspin'],
    pendingMoves: ['Flare', 'Tapmill'],
    achievements: 8,
    battleVideos: ['https://youtube.com/watch?v=dloi_battle1'],
    bio: 'Power move specialist from Specific Kidz crew',
    location: 'Copenhagen, Denmark',
    socialMedia: {
      instagram: '@dloi_breaker',
      facebook: 'DLoi Breaker'
    }
  },
  {
    id: 3,
    username: 'benji',
    name: 'Benji',
    email: 'benji@example.com',
    password: 'password123',
    level: 10,
    xp: 6500,
    joinDate: '2024-02-01',
    status: 'active',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop',
    crew: 'Specific Kidz',
    specialty: 'Footwork',
    masteredMoves: ['Two step', 'Salsa step', 'CC', 'Coffee grinder', '2 step', '3 step'],
    pendingMoves: ['6 step', 'Hooks'],
    achievements: 6,
    battleVideos: ['https://youtube.com/watch?v=benji_footwork'],
    bio: 'Footwork master with smooth transitions',
    location: 'Aarhus, Denmark',
    socialMedia: {
      instagram: '@benji_footwork',
      facebook: 'Benji Footwork'
    }
  }
];

export const crews = [
  {
    id: 'specific-kidz',
    name: 'Specific Kidz',
    logo: null,
    description: 'Breaking crew from Denmark',
    memberCount: 12,
    totalXP: 32500,
    level: 14,
    color: '#e6c77b',
    members: []
  },
  {
    id: 'familia-loca',
    name: 'Famillia Loca',
    logo: null,
    description: 'Breaking crew from Denmark',
    memberCount: 6,
    totalXP: 14500,
    level: 9,
    color: '#ff6b6b',
    members: []
  }
];

export const badges = [
  {
    id: 'toprock-master',
    name: 'Toprock Master',
    description: 'Complete all Toprock moves',
    image: '/badges/topbadge.png',
    category: 'Toprock',
    requirement: 'Complete all moves in Toprock category'
  },
  {
    id: 'footwork-master',
    name: 'Footwork Master',
    description: 'Complete all Footwork moves',
    image: '/badges/footwork.png',
    category: 'Footwork',
    requirement: 'Complete all moves in Footwork category'
  },
  {
    id: 'freezes-master',
    name: 'Freezes Master',
    description: 'Complete all Freezes moves',
    image: '/badges/freezes.png',
    category: 'Freezes',
    requirement: 'Complete all moves in Freezes category'
  },
  {
    id: 'power-master',
    name: 'Power Master',
    description: 'Complete all Power moves',
    image: '/badges/Powermoves.png',
    category: 'Power',
    requirement: 'Complete all moves in Power category'
  },
  {
    id: 'tricks-master',
    name: 'Tricks Master',
    description: 'Complete all Tricks moves',
    image: '/badges/Tricks.png',
    category: 'Tricks',
    requirement: 'Complete all moves in Tricks category'
  },
  {
    id: 'godowns-master',
    name: 'GoDowns Master',
    description: 'Complete all GoDowns moves',
    image: '/badges/Godown.png',
    category: 'GoDowns',
    requirement: 'Complete all moves in GoDowns category'
  },
  {
    id: 'ground-power-master',
    name: 'Ground Master',
    description: 'Complete all ground power moves',
    image: '/badges/ground.png',
    category: 'Power',
    requirement: 'Complete all ground power moves'
  },
  {
    id: 'air-power-master',
    name: 'Air Power Master',
    description: 'Complete all air power moves',
    image: '/badges/air.png',
    category: 'Power',
    requirement: 'Complete all air power moves'
  },
  {
    id: 'beginner-master',
    name: 'Beginner',
    description: 'Complete all Beginner level moves',
    image: '/badges/beginner.png',
    category: 'Special',
    requirement: 'Complete all Beginner level moves'
  },
  {
    id: 'novice-master',
    name: 'Novice',
    description: 'Complete all Novice level moves',
    image: '/badges/novice.png',
    category: 'Special',
    requirement: 'Complete all Novice level moves'
  },
  {
    id: 'intermediate-master',
    name: 'Intermediate',
    description: 'Complete all Intermediate level moves',
    image: '/badges/intermediate.png',
    category: 'Special',
    requirement: 'Complete all Intermediate level moves'
  },
  {
    id: 'advanced-master',
    name: 'Advanced',
    description: 'Complete all Advanced level moves',
    image: '/badges/Advanced.png',
    category: 'Special',
    requirement: 'Complete all Advanced level moves'
  },
  {
    id: 'skilled-master',
    name: 'Skilled',
    description: 'Complete all Skilled level moves',
    image: '/badges/skilled.png',
    category: 'Special',
    requirement: 'Complete all Skilled level moves'
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Complete all Master level moves',
    image: '/badges/master.png',
    category: 'Special',
    requirement: 'Complete all Master level moves'
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Complete all moves in the game',
    image: '/badges/grandmaster.png',
    category: 'Special',
    requirement: 'Complete all moves in the game'
  }
];

export const events = [
  {
    id: 1,
    title: "Nordic Break League 2025",
    date: "March 15, 2025",
    time: "18:00 - 22:00",
    location: "Copenhagen Breakdance Center",
    battleFormat: "2v2 international + kids battle",
    category: "Competition",
    description: "The biggest breaking competition of the year! Show off your skills and compete against the best breakers in Denmark. Categories include: Toprock, Footwork, Freezes, Power Moves, and All-Style. Cash prizes and trophies for winners.",
    image: null,
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 32,
    currentParticipants: 24,
    entryFee: "Free",
    prizes: "Cash prizes and trophies",
    organizer: "Nordic Break League",
    contactEmail: "info@nordicbreakleague.com",
    website: "https://nordicbreak.dk",
    socialMedia: {
      instagram: "@nordicbreakleague",
      facebook: "Nordic Break League"
    }
  },
  {
    id: 2,
    title: "Workshop with DLoi - Power Moves Masterclass",
    date: "February 28, 2024",
    time: "14:00 - 17:00",
    location: "Urban Dance Studio, Copenhagen",
    participants: 18,
    maxParticipants: 20,
    category: "Workshop",
    description: "Join DLoi from Specific Kidz for an intensive 3-hour workshop focusing on power moves and transitions. Perfect for intermediate to advanced breakers looking to level up their game. Learn proper technique, safety, and progression methods.",
    image: null,
    status: "upcoming",
    featured: false,
    registrationOpen: true,
    entryFee: "150 DKK",
    prizes: "Certificate of completion",
    organizer: "Urban Dance Studio",
    contactEmail: "workshops@urbandancestudio.dk",
    website: "https://urbandancestudio.dk",
    socialMedia: {
      instagram: "@urbandancestudio",
      facebook: "Urban Dance Studio"
    }
  }
];

export const battles = [
  {
    id: 1,
    challenger: {
      id: "user1",
      name: "DLoi",
      level: "Advanced",
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user2", 
      name: "Yung M",
      level: "Skilled",
      crew: "Famillia Loca"
    },
    status: "pending",
    callOutDate: "2024-01-15T10:30:00Z",
    responseDate: null,
    acceptedBy: null,
    acceptedDate: null,
    roomId: null,
    videos: {
      challenger: null,
      opponent: null
    },
    adminReview: {
      isReady: false,
      judgedBy: null,
      winner: null,
      score: null,
      comments: null,
      judgedDate: null
    },
    category: "All Style",
    description: "Let's see who has the better footwork! Been watching your moves and I think we should battle it out.",
    stakes: "Respect and bragging rights"
  },
  {
    id: 2,
    challenger: {
      id: "user3",
      name: "Benji",
      level: "Advanced", 
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user1",
      name: "DLoi",
      level: "Advanced",
      crew: "Specific Kidz"
    },
    status: "accepted",
    callOutDate: "2024-01-10T14:20:00Z",
    responseDate: "2024-01-12T09:15:00Z",
    acceptedBy: "opponent",
    acceptedDate: "2024-01-12T09:15:00Z",
    roomId: "battle_room_2",
    videos: {
      challenger: null,
      opponent: null
    },
    adminReview: {
      isReady: false,
      judgedBy: null,
      winner: null,
      score: null,
      comments: null,
      judgedDate: null
    },
    category: "1v1",
    description: "Power move battle - let's see who can throw down harder! Been practicing my flares and I want to test them against you.",
    stakes: "Respect and bragging rights"
  }
]; 