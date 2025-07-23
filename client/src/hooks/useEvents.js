import { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.getAll({
        ...filters,
        ...params
      });
      
      setEvents(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventById = async (id) => {
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
  };

  const createEvent = async (eventData) => {
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
  };

  const updateEvent = async (id, eventData) => {
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
  };

  const deleteEvent = async (id) => {
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
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [filters]);

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