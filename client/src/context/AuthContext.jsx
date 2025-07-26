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
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('breakverse_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('breakverse_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await usersAPI.login(username, password);
      
      if (response.success && response.user) {
        setCurrentUser(response.user);
        localStorage.setItem('breakverse_user', JSON.stringify(response.user));
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
  };

  const updateUser = (updatedUser) => {
    const newUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newUser);
    localStorage.setItem('breakverse_user', JSON.stringify(newUser));
  };

  const isAdmin = () => {
    return currentUser && currentUser.status === 'admin';
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 