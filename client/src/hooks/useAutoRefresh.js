import { useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';

export const useAutoRefresh = (refreshFunction, dependencies = [], shouldRefresh = true) => {
  const { lastUpdate } = useProfile();
  const lastUpdateRef = useRef(lastUpdate);

  useEffect(() => {
    // Only refresh if shouldRefresh is true and lastUpdate has actually changed
    if (shouldRefresh && lastUpdate !== lastUpdateRef.current) {
      lastUpdateRef.current = lastUpdate;
      refreshFunction();
    }
  }, [lastUpdate, refreshFunction, shouldRefresh, ...dependencies]);

  return { lastUpdate };
}; 