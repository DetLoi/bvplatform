// Use localhost for development, Render for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://breakverse-api.onrender.com/api'
  : 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 Making API request to:', url);
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('📡 Sending request...');
    const response = await fetch(url, config);
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', response.status, errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received:', data);
    return data;
  } catch (error) {
    console.error('💥 API request failed:', error);
    console.error('🔗 URL attempted:', url);
    throw error;
  }
};

// Moves API
export const movesAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    
    // Handle array parameters properly
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    });
    
    const queryString = searchParams.toString();
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
  login: (username, password) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users?${queryString}`);
  },
  
  getAllWithPasswords: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users/admin/with-passwords?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/users/${id}`),
  
  getStats: (userId) => apiRequest(`/users/${userId}/stats`),
  
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  update: (id, userData) => {
    console.log('🔧 Updating user with data:', userData);
    console.log('🔧 masteredMoves in userData:', userData.masteredMoves);
    console.log('🔧 masteredMoves type:', typeof userData.masteredMoves);
    console.log('🔧 masteredMoves is array:', Array.isArray(userData.masteredMoves));
    console.log('🔧 JSON.stringify(userData):', JSON.stringify(userData));
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
  
  // Get all pending move requests (admin)
  getPendingMoveRequests: () => apiRequest('/users/pending-moves'),
  
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