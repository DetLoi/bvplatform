const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bvplatform-api.onrender.com/api'
  : 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Moves API
export const movesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/moves?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/moves/${id}`),
  
  getByCategory: (category) => apiRequest(`/moves/category/${category}`),
  
  getByLevel: (level) => apiRequest(`/moves/level/${level}`),
  
  create: (moveData) => apiRequest('/moves', {
    method: 'POST',
    body: JSON.stringify(moveData),
  }),
  
  update: (id, moveData) => apiRequest(`/moves/${id}`, {
    method: 'PUT',
    body: JSON.stringify(moveData),
  }),
  
  delete: (id) => apiRequest(`/moves/${id}`, {
    method: 'DELETE',
  }),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/users/${id}`),
  
  getStats: (userId) => apiRequest(`/users/${userId}/stats`),
  
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
  
  // Move management
  addMasteredMove: (userId, moveId) => apiRequest(`/users/${userId}/moves/${moveId}/master`, {
    method: 'POST',
  }),
  
  removeMasteredMove: (userId, moveId) => apiRequest(`/users/${userId}/moves/${moveId}/master`, {
    method: 'DELETE',
  }),
  
  addPendingMove: (userId, moveId) => apiRequest(`/users/${userId}/moves/${moveId}/pending`, {
    method: 'POST',
  }),
  
  approvePendingMove: (userId, moveId) => apiRequest(`/users/${userId}/moves/${moveId}/approve`, {
    method: 'PUT',
  }),
  
  rejectPendingMove: (userId, moveId) => apiRequest(`/users/${userId}/moves/${moveId}/reject`, {
    method: 'PUT',
  }),
};

// Badges API
export const badgesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/badges?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/badges/${id}`),
  
  create: (badgeData) => apiRequest('/badges', {
    method: 'POST',
    body: JSON.stringify(badgeData),
  }),
  
  update: (id, badgeData) => apiRequest(`/badges/${id}`, {
    method: 'PUT',
    body: JSON.stringify(badgeData),
  }),
  
  delete: (id) => apiRequest(`/badges/${id}`, {
    method: 'DELETE',
  }),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/events/${id}`),
  
  create: (eventData) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  
  update: (id, eventData) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// Battles API
export const battlesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/battles?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/battles/${id}`),
  
  create: (battleData) => apiRequest('/battles', {
    method: 'POST',
    body: JSON.stringify(battleData),
  }),
  
  update: (id, battleData) => apiRequest(`/battles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(battleData),
  }),
  
  delete: (id) => apiRequest(`/battles/${id}`, {
    method: 'DELETE',
  }),
};

// Crews API
export const crewsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/crews?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/crews/${id}`),
  
  create: (crewData) => apiRequest('/crews', {
    method: 'POST',
    body: JSON.stringify(crewData),
  }),
  
  update: (id, crewData) => apiRequest(`/crews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(crewData),
  }),
  
  delete: (id) => apiRequest(`/crews/${id}`, {
    method: 'DELETE',
  }),
};

// Export all APIs
export default {
  moves: movesAPI,
  users: usersAPI,
  badges: badgesAPI,
  events: eventsAPI,
  battles: battlesAPI,
  crews: crewsAPI,
}; 