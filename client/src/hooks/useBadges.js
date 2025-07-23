import { useState, useEffect } from 'react';
import { badgesAPI } from '../services/api';

export const useBadges = (filters = {}) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBadges = async (params = {}) => {
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
  };

  const fetchBadgeById = async (id) => {
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
  };

  const createBadge = async (badgeData) => {
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
  };

  const updateBadge = async (id, badgeData) => {
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
  };

  const deleteBadge = async (id) => {
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
  };

  // Initial fetch
  useEffect(() => {
    fetchBadges();
  }, [filters]);

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