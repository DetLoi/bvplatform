import { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { clearQuestTrackerGlobal } from './QuestTrackerContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate stored user data
  const validateStoredUser = (userData) => {
    if (!userData || typeof userData !== 'object') return null;
    if (!userData._id || !userData.username) return null;
    
    // Check if the stored data has expired (24 hours)
    const storedTime = userData._storedAt;
    if (storedTime && Date.now() - storedTime > 24 * 60 * 60 * 1000) {
      return null;
    }
    
    return userData;
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check localStorage first, then sessionStorage
        let savedUser = localStorage.getItem('breakverse_user');
        let storageType = 'localStorage';
        
        if (!savedUser) {
          savedUser = sessionStorage.getItem('breakverse_user');
          storageType = 'sessionStorage';
        }
        
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            const validatedUser = validateStoredUser(parsedUser);
            
            if (validatedUser) {
              // Verify user still exists on server
              try {
                const serverUser = await usersAPI.getById(validatedUser._id);
                if (serverUser) {
                  const userWithStorage = { ...serverUser, _storageType: storageType, _storedAt: Date.now() };
                  setCurrentUser(userWithStorage);
                  
                  // Update storage with fresh data
                  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
                  storage.setItem('breakverse_user', JSON.stringify(userWithStorage));
                } else {
                  // User no longer exists on server, clear storage
                  localStorage.removeItem('breakverse_user');
                  sessionStorage.removeItem('breakverse_user');
                }
              } catch (serverError) {
                console.warn('Could not verify user on server, using stored data:', serverError);
                setCurrentUser(validatedUser);
              }
            } else {
              // Invalid stored data, clear it
              localStorage.removeItem('breakverse_user');
              sessionStorage.removeItem('breakverse_user');
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            localStorage.removeItem('breakverse_user');
            sessionStorage.removeItem('breakverse_user');
          }
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password, stayLoggedIn = false) => {
    try {
      setError(null);
      const response = await usersAPI.login(username, password);
      
      if (response.success && response.user) {
        const userWithStorage = { 
          ...response.user, 
          _storageType: stayLoggedIn ? 'localStorage' : 'sessionStorage',
          _storedAt: Date.now()
        };
        
        setCurrentUser(userWithStorage);
        
        // Store user data based on stayLoggedIn preference
        const storage = stayLoggedIn ? localStorage : sessionStorage;
        storage.setItem('breakverse_user', JSON.stringify(userWithStorage));
        
        // Clear the other storage type
        if (stayLoggedIn) {
          sessionStorage.removeItem('breakverse_user');
        } else {
          localStorage.removeItem('breakverse_user');
        }
        
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.message || 'Ugyldigt brugernavn eller adgangskode';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.message || 'Der opstod en fejl under login';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setError(null);
    localStorage.removeItem('breakverse_user');
    sessionStorage.removeItem('breakverse_user');
    
    // Clear quest tracker state when user logs out
    clearQuestTrackerGlobal();
  };

  const updateUser = (updatedUser) => {
    if (!currentUser) return;
    
    const newUser = { ...currentUser, ...updatedUser, _storedAt: Date.now() };
    setCurrentUser(newUser);
    
    // Update in the same storage where user was originally stored
    const storageType = currentUser._storageType || 'localStorage';
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.setItem('breakverse_user', JSON.stringify(newUser));
  };

  const refreshUser = async () => {
    if (currentUser?._id) {
      try {
        setError(null);
        const userData = await usersAPI.getById(currentUser._id);
        if (userData) {
          const userWithStorage = { 
            ...userData, 
            _storageType: currentUser._storageType || 'localStorage',
            _storedAt: Date.now()
          };
          
          setCurrentUser(userWithStorage);
          
          // Update in the same storage where user was originally stored
          const storageType = currentUser._storageType || 'localStorage';
          const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
          storage.setItem('breakverse_user', JSON.stringify(userWithStorage));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        setError('Failed to refresh user data');
      }
    }
  };

  const isAdmin = () => {
    return currentUser && currentUser.roles && currentUser.roles.includes('admin');
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    refreshUser,
    isAdmin,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 