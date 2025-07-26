import { useState, useEffect, useCallback } from 'react';
import { battlesAPI } from '../services/api';

export const useBattles = () => {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBattles = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await battlesAPI.getAll(params);
      setBattles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching battles:', err);
      setError(err.message || 'Failed to fetch battles');
      setBattles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBattlesByUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await battlesAPI.getAll({ user: userId });
      setBattles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching battles by user:', err);
      setError(err.message || 'Failed to fetch user battles');
      setBattles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBattlesByStatus = useCallback(async (status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await battlesAPI.getAll({ status });
      setBattles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching battles by status:', err);
      setError(err.message || 'Failed to fetch battles by status');
      setBattles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBattle = useCallback(async (battleData) => {
    try {
      setLoading(true);
      setError(null);
      const newBattle = await battlesAPI.create(battleData);
      setBattles(prev => [...prev, newBattle]);
      return newBattle;
    } catch (err) {
      console.error('Error creating battle:', err);
      setError(err.message || 'Failed to create battle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBattle = useCallback(async (id, battleData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBattle = await battlesAPI.update(id, battleData);
      setBattles(prev => prev.map(battle => 
        battle._id === id ? updatedBattle : battle
      ));
      return updatedBattle;
    } catch (err) {
      console.error('Error updating battle:', err);
      setError(err.message || 'Failed to update battle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBattle = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await battlesAPI.delete(id);
      setBattles(prev => prev.filter(battle => battle._id !== id));
    } catch (err) {
      console.error('Error deleting battle:', err);
      setError(err.message || 'Failed to delete battle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch battles on mount
  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  return {
    battles,
    loading,
    error,
    fetchBattles,
    fetchBattlesByUser,
    fetchBattlesByStatus,
    createBattle,
    updateBattle,
    deleteBattle,
  };
}; 