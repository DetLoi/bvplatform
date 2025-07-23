import { useState, useEffect } from 'react';
import { movesAPI } from '../services/api';

export const useMoves = (filters = {}) => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchMoves = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movesAPI.getAll({
        ...filters,
        ...params
      });
      
      setMoves(response.moves);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching moves:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovesByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movesAPI.getByCategory(category);
      // Handle both array and object responses
      const movesArray = Array.isArray(response) ? response : (response.moves || []);
      setMoves(movesArray);
      return movesArray; // Return the array for the component to use
    } catch (err) {
      setError(err.message);
      console.error('Error fetching moves by category:', err);
      return []; // Return empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchMovesByLevel = async (level) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movesAPI.getByLevel(level);
      setMoves(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching moves by level:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoveById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movesAPI.getById(id);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching move by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMove = async (moveData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movesAPI.create(moveData);
      await fetchMoves(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMove = async (id, moveData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await movesAPI.update(id, moveData);
      await fetchMoves(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMove = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await movesAPI.delete(id);
      await fetchMoves(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMoves();
  }, [filters]);

  return {
    moves,
    loading,
    error,
    pagination,
    fetchMoves,
    fetchMovesByCategory,
    fetchMovesByLevel,
    fetchMoveById,
    createMove,
    updateMove,
    deleteMove,
    refetch: () => fetchMoves()
  };
}; 