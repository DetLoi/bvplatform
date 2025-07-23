import { useState, useEffect } from 'react';
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

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getAll({
        ...filters,
        ...params
      });
      
      setUsers(response.users);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
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
  };

  const createUser = async (userData) => {
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
  };

  const updateUser = async (id, userData) => {
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
  };

  const deleteUser = async (id) => {
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
  };

  const addMasteredMove = async (userId, moveId) => {
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
  };

  const removeMasteredMove = async (userId, moveId) => {
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
  };

  const addPendingMove = async (userId, moveId) => {
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
  };

  const approvePendingMove = async (userId, moveId) => {
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
  };

  const rejectPendingMove = async (userId, moveId) => {
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
  };

  const getUserStats = async (userId) => {
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
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
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