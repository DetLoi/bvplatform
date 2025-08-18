import { useState, useEffect, useCallback } from 'react';
import { bulkSubmissionsAPI } from '../services/api';

export const useBulkSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bulkSubmissionsAPI.getAll();
      setSubmissions(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bulk submissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubmission = useCallback(async (submissionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bulkSubmissionsAPI.create(submissionData);
      await fetchSubmissions(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating bulk submission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSubmissions]);

  const approveSubmission = useCallback(async (submissionId, adminNotes = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bulkSubmissionsAPI.approve(submissionId, adminNotes);
      await fetchSubmissions(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error approving bulk submission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSubmissions]);

  const rejectSubmission = useCallback(async (submissionId, adminNotes = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bulkSubmissionsAPI.reject(submissionId, adminNotes);
      await fetchSubmissions(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error rejecting bulk submission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSubmissions]);

  const deleteSubmission = useCallback(async (submissionId) => {
    try {
      setLoading(true);
      setError(null);
      
      await bulkSubmissionsAPI.delete(submissionId);
      await fetchSubmissions(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting bulk submission:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSubmissions]);

  // Initial fetch
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    createSubmission,
    approveSubmission,
    rejectSubmission,
    deleteSubmission,
    refetch: fetchSubmissions
  };
}; 