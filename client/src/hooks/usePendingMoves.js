import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';

export const usePendingMoves = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getPendingMoveRequests();
      setPendingRequests(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pending move requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRequest = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.approvePendingMove(userId, moveId);
      await fetchPendingRequests(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error approving pending move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPendingRequests]);

  const rejectRequest = useCallback(async (userId, moveId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.rejectPendingMove(userId, moveId);
      await fetchPendingRequests(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error rejecting pending move:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPendingRequests]);

  // Initial fetch
  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  return {
    pendingRequests,
    loading,
    error,
    approveRequest,
    rejectRequest,
    refetch: fetchPendingRequests
  };
}; 