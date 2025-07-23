import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

const xpThresholds = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800,
  3600, 4500, 5500, 6600, 7800, 9100, 10500,
  12000, 13600, 15300, 17100, 19000
];

const getLevelFromXP = (xp) => {
  for (let i = xpThresholds.length - 1; i >= 0; i--) {
    if (xp >= xpThresholds[i]) return i + 1;
  }
  return 1;
};

const getNextLevelXP = (xp) => {
  const currentLevel = getLevelFromXP(xp);
  return xpThresholds[currentLevel] || null;
};

export function ProfileProvider({ children }) {
  const [masteredMoves, setMasteredMoves] = useState([]);
  const [pendingMoves, setPendingMoves] = useState([]);
  const [xp, setXP] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [battleVideo, setBattleVideo] = useState(null);

  const addMasteredMove = (move) => {
    if (!masteredMoves.some((m) => m.name === move.name)) {
      const newXP = xp + move.xp;
      setMasteredMoves([...masteredMoves, move]);
      setXP(newXP);
    }
  };

  const removeMasteredMove = (moveName) => {
    const moveToRemove = masteredMoves.find((m) => m.name === moveName);
    if (moveToRemove) {
      const newXP = Math.max(0, xp - moveToRemove.xp);
      setMasteredMoves(masteredMoves.filter((m) => m.name !== moveName));
      setXP(newXP);
    }
  };

  const requestMoveApproval = (move) => {
    if (!pendingMoves.some((m) => m.name === move.name) && 
        !masteredMoves.some((m) => m.name === move.name)) {
      setPendingMoves([...pendingMoves, move]);
    }
  };

  const approveMoveRequest = (moveName) => {
    const moveToApprove = pendingMoves.find((m) => m.name === moveName);
    if (moveToApprove) {
      const newXP = xp + moveToApprove.xp;
      setMasteredMoves([...masteredMoves, moveToApprove]);
      setPendingMoves(pendingMoves.filter((m) => m.name !== moveName));
      setXP(newXP);
    }
  };

  const rejectMoveRequest = (moveName) => {
    setPendingMoves(pendingMoves.filter((m) => m.name !== moveName));
  };

  const level = getLevelFromXP(xp);
  const nextXP = getNextLevelXP(xp);
  const currentThreshold = xpThresholds[level - 1] || 0;
  const progress = nextXP
    ? ((xp - currentThreshold) / (nextXP - currentThreshold)) * 100
    : 100;

  return (
    <ProfileContext.Provider
      value={{
        masteredMoves,
        pendingMoves,
        addMasteredMove,
        removeMasteredMove,
        requestMoveApproval,
        approveMoveRequest,
        rejectMoveRequest,
        xp,
        level,
        profileImage,
        setProfileImage,
        battleVideo,
        setBattleVideo,
        progress,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);