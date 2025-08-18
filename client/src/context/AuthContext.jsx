import { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

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

  useEffect(() => {
    // Check if user is logged in from localStorage or sessionStorage
    const savedUser = localStorage.getItem('breakverse_user') || sessionStorage.getItem('breakverse_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('breakverse_user');
        sessionStorage.removeItem('breakverse_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, stayLoggedIn = false) => {
    try {
      const response = await usersAPI.login(username, password);
      
      if (response.success && response.user) {
        setCurrentUser(response.user);
        
        // Store user data based on stayLoggedIn preference
        const storage = stayLoggedIn ? localStorage : sessionStorage;
        storage.setItem('breakverse_user', JSON.stringify(response.user));
        
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.message || 'Ugyldigt brugernavn eller adgangskode' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Der opstod en fejl under login' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('breakverse_user');
    sessionStorage.removeItem('breakverse_user');
  };

  const updateUser = (updatedUser) => {
    const newUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newUser);
    
    // Update in the same storage where user was originally stored
    const storage = localStorage.getItem('breakverse_user') ? localStorage : sessionStorage;
    storage.setItem('breakverse_user', JSON.stringify(newUser));
  };

  const refreshUser = async () => {
    if (currentUser?._id) {
      try {
        const userData = await usersAPI.getById(currentUser._id);
        if (userData) {
          setCurrentUser(userData);
          
          // Update in the same storage where user was originally stored
          const storage = localStorage.getItem('breakverse_user') ? localStorage : sessionStorage;
          storage.setItem('breakverse_user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 