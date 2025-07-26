import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';

export const useUsers = (filters = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getAll({
        ...filters,
        ...params
      });
      
      // Handle both array and object responses
      const usersArray = Array.isArray(response) ? response : (response.users || []);
      setUsers(usersArray);
      
      if (response.pagination) {
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchUsersWithPasswords = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getAllWithPasswords({
        ...filters,
        ...params
      });
      
      // Handle both array and object responses
      const usersArray = Array.isArray(response) ? response : (response.users || []);
      setUsers(usersArray);
      
      if (response.pagination) {
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users with passwords:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchUserById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getById(id);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.create(userData);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.update(id, userData);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await usersAPI.delete(id);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const addMasteredMove = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.addMasteredMove(userId, moveId);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error adding mastered move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const removeMasteredMove = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.removeMasteredMove(userId, moveId);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error removing mastered move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const addPendingMove = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.addPendingMove(userId, moveId);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error adding pending move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const approvePendingMove = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.approvePendingMove(userId, moveId);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error approving pending move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const rejectPendingMove = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.rejectPendingMove(userId, moveId);
      await fetchUsers(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error rejecting pending move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const getUserStats = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getStats(userId);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user stats:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array to run only once

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchUsersWithPasswords,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    addMasteredMove,
    removeMasteredMove,
    addPendingMove,
    approvePendingMove,
    rejectPendingMove,
    getUserStats,
    refetch: () => fetchUsers()
  };
}; 