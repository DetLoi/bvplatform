import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const QuestTrackerContext = createContext();

export const useQuestTracker = () => {
  const context = useContext(QuestTrackerContext);
  if (!context) {
    throw new Error('useQuestTracker must be used within a QuestTrackerProvider');
  }
  return context;
};

export const QuestTrackerProvider = ({ children }) => {
  const [questMoves, setQuestMoves] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  // Check if we're on the battles page
  const isBattlesPage = location.pathname === '/battles';

  // Hide quest tracker on battles page
  useEffect(() => {
    if (isBattlesPage && isActive) {
      setIsActive(false);
    }
  }, [isBattlesPage, isActive]);

  const activateQuest = (moves) => {
    console.log('Activating quest with moves:', moves);
    setQuestMoves(moves);
    setIsActive(true);
  };

  const removeQuest = () => {
    console.log('Removing quest');
    setQuestMoves([]);
    setIsActive(false);
  };

  const completeMove = (move) => {
    console.log('Move completed:', move);
    // Here you could add logic to mark moves as mastered
    // For now, just log the completion
  };

  const value = {
    questMoves,
    isActive,
    activateQuest,
    removeQuest,
    completeMove,
    isBattlesPage
  };

  return (
    <QuestTrackerContext.Provider value={value}>
      {children}
    </QuestTrackerContext.Provider>
  );
};
