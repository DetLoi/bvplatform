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
    status: "pending", // pending, accepted, declined, in_progress, completed, judged
    callOutDate: "2024-01-15T10:30:00Z",
    responseDate: null,
    acceptedBy: null, // "challenger" or "opponent"
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
    category: "All-Style",
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
    category: "Power Moves",
    description: "Power move battle - let's see who can throw down harder! Been practicing my flares and I want to test them against you.",
    stakes: "Respect and bragging rights"
  },
  {
    id: 3,
    challenger: {
      id: "user1",
      name: "DLoi", 
      level: "Advanced",
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user4",
      name: "Kien",
      level: "Intermediate",
      crew: "Specific Kidz"
    },
    status: "in_progress",
    callOutDate: "2024-01-08T16:45:00Z",
    responseDate: "2024-01-09T11:30:00Z", 
    acceptedBy: "opponent",
    acceptedDate: "2024-01-09T11:30:00Z",
    roomId: "battle_room_3",
    videos: {
      challenger: "https://example.com/video1.mp4",
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
    category: "Toprock",
    description: "Toprock battle - let's see who has the better rhythm! I've been working on my Indian step and want to challenge you.",
    stakes: "Respect and bragging rights"
  },
  {
    id: 4,
    challenger: {
      id: "user5",
      name: "Pele",
      level: "Intermediate",
      crew: "Specific Kidz"
    },
    opponent: {
      id: "user6",
      name: "Oritami",
      level: "Intermediate",
      crew: "Specific Kidz"
    },
    status: "completed",
    callOutDate: "2024-01-05T12:00:00Z",
    responseDate: "2024-01-06T10:00:00Z",
    acceptedBy: "opponent",
    acceptedDate: "2024-01-06T10:00:00Z",
    roomId: "battle_room_4",
    videos: {
      challenger: "https://example.com/video4_challenger.mp4",
      opponent: "https://example.com/video4_opponent.mp4"
    },
    adminReview: {
      isReady: true,
      judgedBy: null,
      winner: null,
      score: null,
      comments: null,
      judgedDate: null
    },
    category: "Freezes",
    description: "Freeze battle! Let's see who can hold the most creative freezes. I've been working on my airchair and want to test it.",
    stakes: "Respect and bragging rights"
  },
  {
    id: 5,
    challenger: {
      id: "user7",
      name: "Emilio",
      level: "Advanced",
      crew: "Famillia Loca"
    },
    opponent: {
      id: "user8",
      name: "Andy",
      level: "Intermediate",
      crew: "Famillia Loca"
    },
    status: "judged",
    callOutDate: "2024-01-01T09:00:00Z",
    responseDate: "2024-01-02T14:00:00Z",
    acceptedBy: "opponent",
    acceptedDate: "2024-01-02T14:00:00Z",
    roomId: "battle_room_5",
    videos: {
      challenger: "https://example.com/video5_challenger.mp4",
      opponent: "https://example.com/video5_opponent.mp4"
    },
    adminReview: {
      isReady: true,
      judgedBy: "admin1",
      winner: "challenger",
      score: "3-2",
      comments: "Great battle! Emilio showed better technique and creativity. Andy had good energy but needs to work on transitions.",
      judgedDate: "2024-01-10T16:30:00Z"
    },
    category: "All-Style",
    description: "All-style battle! Let's see who has the most complete game. Been practicing my combinations and want to test them.",
    stakes: "Respect and bragging rights"
  },
  {
    id: 6,
    challenger: {
      id: "user9",
      name: "Danielito",
      level: "Novice",
      crew: "Famillia Loca"
    },
    opponent: {
      id: "user10",
      name: "Alireza",
      level: "Novice",
      crew: "Famillia Loca"
    },
    status: "pending",
    callOutDate: "2024-01-20T11:00:00Z",
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
    category: "Footwork",
    description: "Footwork battle for beginners! Let's practice our 6-step and coffee grinder together.",
    stakes: "Learning experience"
  }
];

// Helper functions for battle operations
export const createCallOut = (challenger, opponent, category, description, stakes) => {
  const newBattle = {
    id: Math.max(...battles.map(b => b.id)) + 1,
    challenger,
    opponent,
    status: "pending",
    callOutDate: new Date().toISOString(),
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
    category,
    description,
    stakes
  };
  
  battles.push(newBattle);
  return newBattle;
};

export const respondToCallOut = (battleId, response, responderId) => {
  const battle = battles.find(b => b.id === battleId);
  if (!battle) return null;
  
  battle.responseDate = new Date().toISOString();
  
  if (response === "accept") {
    battle.status = "accepted";
    battle.acceptedBy = responderId === battle.challenger.id ? "challenger" : "opponent";
    battle.acceptedDate = new Date().toISOString();
    battle.roomId = `battle_room_${battleId}`;
  } else if (response === "decline") {
    battle.status = "declined";
  }
  
  return battle;
};

export const uploadVideo = (battleId, userId, videoUrl) => {
  const battle = battles.find(b => b.id === battleId);
  if (!battle) return null;
  
  if (battle.challenger.id === userId) {
    battle.videos.challenger = videoUrl;
  } else if (battle.opponent.id === userId) {
    battle.videos.opponent = videoUrl;
  }
  
  // Check if both videos are uploaded
  if (battle.videos.challenger && battle.videos.opponent) {
    battle.status = "completed";
    battle.adminReview.isReady = true;
  }
  
  return battle;
};

export const judgeBattle = (battleId, adminId, winner, score, comments) => {
  const battle = battles.find(b => b.id === battleId);
  if (!battle) return null;
  
  battle.status = "judged";
  battle.adminReview.judgedBy = adminId;
  battle.adminReview.winner = winner;
  battle.adminReview.score = score;
  battle.adminReview.comments = comments;
  battle.adminReview.judgedDate = new Date().toISOString();
  
  return battle;
};

export const getBattlesByUser = (userId) => {
  return battles.filter(b => 
    b.challenger.id === userId || b.opponent.id === userId
  );
};

export const getPendingCallOuts = (userId) => {
  return battles.filter(b => 
    b.opponent.id === userId && b.status === "pending"
  );
};

export const getMyCallOuts = (userId) => {
  return battles.filter(b => 
    b.challenger.id === userId && b.status === "pending"
  );
};

export const getActiveBattles = (userId) => {
  return battles.filter(b => 
    (b.challenger.id === userId || b.opponent.id === userId) &&
    (b.status === "accepted" || b.status === "in_progress")
  );
};

export const getCompletedBattles = (userId) => {
  return battles.filter(b => 
    (b.challenger.id === userId || b.opponent.id === userId) &&
    b.status === "completed"
  );
};

export const getJudgedBattles = (userId) => {
  return battles.filter(b => 
    (b.challenger.id === userId || b.opponent.id === userId) &&
    b.status === "judged"
  );
};

export const getBattlesReadyForReview = () => {
  return battles.filter(b => b.adminReview.isReady && b.status === "completed");
}; 