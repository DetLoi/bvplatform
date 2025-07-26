import { useState, useEffect, useCallback } from 'react';
import { crewsAPI } from '../services/api';

export const useCrews = (filters = {}) => {
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchCrews = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await crewsAPI.getAll({
        ...filters,
        ...params
      });
      
      // Handle both array and object responses
      const crewsArray = Array.isArray(response) ? response : (response.crews || []);
      setCrews(crewsArray);
      
      if (response.pagination) {
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching crews:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCrewById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await crewsAPI.getById(id);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching crew by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCrew = useCallback(async (crewData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await crewsAPI.create(crewData);
      await fetchCrews(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating crew:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCrews]);

  const updateCrew = useCallback(async (id, crewData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await crewsAPI.update(id, crewData);
      await fetchCrews(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating crew:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCrews]);

  const deleteCrew = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await crewsAPI.delete(id);
      await fetchCrews(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting crew:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCrews]);

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchCrews();
  }, []); // Empty dependency array to run only once

  return {
    crews,
    loading,
    error,
    pagination,
    fetchCrews,
    fetchCrewById,
    createCrew,
    updateCrew,
    deleteCrew,
    refetch: () => fetchCrews()
  };
}; 