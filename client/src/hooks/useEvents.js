import { useState, useEffect, useCallback } from 'react';
import { eventsAPI } from '../services/api';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.getAll({
        ...filters,
        ...params
      });
      
      // Handle both array and object responses
      const eventsArray = Array.isArray(response) ? response : (response.events || []);
      setEvents(eventsArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchEventById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.getById(id);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.create(eventData);
      await fetchEvents(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const updateEvent = useCallback(async (id, eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.update(id, eventData);
      await fetchEvents(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const deleteEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await eventsAPI.delete(id);
      await fetchEvents(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchEvents();
  }, []); // Empty dependency array to run only once

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: () => fetchEvents()
  };
}; 