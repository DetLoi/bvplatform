import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Global function to clear quest tracker (accessible from anywhere)
let globalClearQuestTracker = null;
export const clearQuestTrackerGlobal = () => {
  if (globalClearQuestTracker) {
    globalClearQuestTracker();
  }
};

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

  // Memoize the battles page check to prevent unnecessary re-renders
  const isBattlesPage = useMemo(() => {
    return location.pathname === '/battles';
  }, [location.pathname]);

  // Hide quest tracker on battles page
  useEffect(() => {
    if (isBattlesPage && isActive) {
      setIsActive(false);
    }
  }, [isBattlesPage, isActive]);

  // Function to clear quest tracker state (called on logout)
  const clearQuestTracker = useCallback(() => {
    setQuestMoves([]);
    setIsActive(false);
  }, []);

  // Set the global reference when component mounts
  useEffect(() => {
    globalClearQuestTracker = clearQuestTracker;
    return () => {
      globalClearQuestTracker = null;
    };
  }, [clearQuestTracker]);

  // Memoize functions to prevent unnecessary re-renders
  const activateQuest = useCallback((moves) => {
    try {
      console.log('Activating quest with moves:', moves);
      if (Array.isArray(moves) && moves.length > 0) {
        setQuestMoves(moves);
        setIsActive(true);
      } else {
        console.warn('Invalid moves data provided to activateQuest:', moves);
      }
    } catch (error) {
      console.error('Error activating quest:', error);
    }
  }, []);

  const removeQuest = useCallback(() => {
    try {
      console.log('Removing quest');
      setQuestMoves([]);
      setIsActive(false);
    } catch (error) {
      console.error('Error removing quest:', error);
    }
  }, []);

  const completeMove = useCallback((move) => {
    try {
      console.log('Move completed:', move);
      // Here you could add logic to mark moves as mastered
      // For now, just log the completion
    } catch (error) {
      console.error('Error completing move:', error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    questMoves,
    isActive,
    activateQuest,
    removeQuest,
    completeMove,
    isBattlesPage,
    clearQuestTracker
  }), [questMoves, isActive, activateQuest, removeQuest, completeMove, isBattlesPage, clearQuestTracker]);

  return (
    <QuestTrackerContext.Provider value={value}>
      {children}
    </QuestTrackerContext.Provider>
  );
};
