import { useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';

export const useAutoRefresh = (refreshFunction, dependencies = []) => {
  const { lastUpdate } = useProfile();
  const lastUpdateRef = useRef(lastUpdate);

  useEffect(() => {
    // Only refresh if lastUpdate has actually changed
    if (lastUpdate !== lastUpdateRef.current) {
      lastUpdateRef.current = lastUpdate;
      refreshFunction();
    }
  }, [lastUpdate, refreshFunction, ...dependencies]);

  return { lastUpdate };
}; 