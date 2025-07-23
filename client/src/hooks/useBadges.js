import { useState, useEffect, useCallback } from 'react';
import { badgesAPI } from '../services/api';

export const useBadges = (filters = {}) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBadges = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await badgesAPI.getAll({
        ...filters,
        ...params
      });
      
      setBadges(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchBadgeById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await badgesAPI.getById(id);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching badge by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBadge = useCallback(async (badgeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await badgesAPI.create(badgeData);
      await fetchBadges(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating badge:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBadges]);

  const updateBadge = useCallback(async (id, badgeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await badgesAPI.update(id, badgeData);
      await fetchBadges(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating badge:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBadges]);

  const deleteBadge = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await badgesAPI.delete(id);
      await fetchBadges(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting badge:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBadges]);

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchBadges();
  }, []); // Empty dependency array to run only once

  return {
    badges,
    loading,
    error,
    fetchBadges,
    fetchBadgeById,
    createBadge,
    updateBadge,
    deleteBadge,
    refetch: () => fetchBadges()
  };
}; 