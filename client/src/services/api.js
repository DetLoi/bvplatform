// Use Vite env if provided, else default based on mode
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  || ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) === 'production'
    ? 'https://breakverse-api.onrender.com/api'
    : 'http://localhost:5000/api');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 Making API request to:', url);
  
  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // Only set Content-Type for JSON requests, not for FormData
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Add user ID for admin requests if available
  const savedUser = localStorage.getItem('breakverse_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user._id) {
        config.headers['user-id'] = user._id;
      }
      if (Array.isArray(user.roles) && user.roles.length) {
        config.headers['user-roles'] = user.roles.join(',');
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
    }
  }

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
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item !== undefined && item !== null && item !== '') {
            searchParams.append(key, item);
          }
        });
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
  
  // Instructor management
  getInstructors: () => apiRequest('/users/instructors'),
  
  getStudentsByInstructor: (instructorId) => apiRequest(`/users/instructor/${instructorId}/students`),
  
  assignInstructor: (studentId, instructorId) => apiRequest(`/users/${studentId}/instructor`, {
    method: 'PUT',
    body: JSON.stringify({ instructorId }),
  }),
  
  removeInstructor: (studentId) => apiRequest(`/users/${studentId}/instructor`, {
    method: 'DELETE',
  }),
};

// Auth API (registration + verification)
export const authAPI = {
  register: (data) => apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  verify: (email, code) => apiRequest('/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  }),
};

// Bulk Submissions API
export const bulkSubmissionsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/bulk-submissions?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/bulk-submissions/${id}`),
  
  getByUser: (userId) => apiRequest(`/bulk-submissions/user/${userId}`),
  
  create: (submissionData) => apiRequest('/bulk-submissions', {
    method: 'POST',
    body: JSON.stringify(submissionData),
  }),
  
  approve: (submissionId, adminNotes = '') => apiRequest(`/bulk-submissions/${submissionId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ adminNotes }),
  }),
  
  reject: (submissionId, adminNotes = '') => apiRequest(`/bulk-submissions/${submissionId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ adminNotes }),
  }),
  
  delete: (submissionId) => apiRequest(`/bulk-submissions/${submissionId}`, {
    method: 'DELETE',
  }),
};

// Badges API
export const badgesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/badges?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/badges/${id}`),
  
  create: (badgeData) => {
    // Check if badgeData is FormData (for file uploads) or regular object
    if (badgeData instanceof FormData) {
      return apiRequest('/badges', {
        method: 'POST',
        body: badgeData,
        headers: {
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
      });
    } else {
      return apiRequest('/badges', {
        method: 'POST',
        body: JSON.stringify(badgeData),
      });
    }
  },
  
  update: (id, badgeData) => {
    if (badgeData instanceof FormData) {
      return apiRequest(`/badges/${id}`, {
        method: 'PUT',
        body: badgeData,
        headers: {
          // Let browser set the multipart boundary
        },
      });
    }
    return apiRequest(`/badges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(badgeData),
    });
  },
  
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
  
  getByUser: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/battles/user/${userId}?${queryString}`);
  },
  
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
  
  uploadVideo: (battleId, userId, videoUrl) => apiRequest(`/battles/${battleId}/upload`, {
    method: 'POST',
    body: JSON.stringify({ userId, videoUrl }),
  }),
  
  // Judge voting methods
  getJudgeVote: (battleId, judgeId, category) => {
    const params = new URLSearchParams({ judgeId, category }).toString();
    return apiRequest(`/battles/${battleId}/vote?${params}`);
  },
  
  submitJudgeVote: (battleId, voteData) => apiRequest(`/battles/${battleId}/vote`, {
    method: 'POST',
    body: JSON.stringify(voteData),
  }),
  
  // Resolve battle and update user statistics
  resolveBattle: (battleId) => apiRequest(`/battles/${battleId}/resolve`, {
    method: 'POST',
  }),
};





// Notifications API
export const notificationsAPI = {
  getByUser: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/notifications/user/${userId}?${queryString}`);
  },
  
  getUnreadCount: (userId) => apiRequest(`/notifications/user/${userId}/unread`),
  
  markAsRead: (notificationId) => apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  }),
  
  markAllAsRead: (userId) => apiRequest(`/notifications/user/${userId}/read-all`, {
    method: 'PUT',
  }),
  
  create: (notificationData) => apiRequest('/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  }),
  
  delete: (notificationId) => apiRequest(`/notifications/${notificationId}`, {
    method: 'DELETE',
  }),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => apiRequest('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  list: (q = '') => {
    const query = q ? `?q=${encodeURIComponent(q)}` : '';
    return apiRequest(`/newsletter${query}`);
  },
  remove: (id) => apiRequest(`/newsletter/${id}`, { method: 'DELETE' }),
};

// Upload API
export const uploadAPI = {
  uploadProfileImage: (formData) => apiRequest('/upload/profile-image', {
    method: 'POST',
    body: formData,
  }),
  
  uploadCoverImage: (formData) => apiRequest('/upload/cover-image', {
    method: 'POST',
    body: formData,
  }),
  

  
  uploadVideo: (formData) => apiRequest('/upload/video', {
    method: 'POST',
    body: formData,
  }),
  
  deleteVideo: (filename) => apiRequest(`/upload/video/${filename}`, {
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
}; 