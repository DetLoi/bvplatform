import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usersAPI, uploadAPI } from '../services/api';

const ProfileContext = createContext();

// Use the same XP thresholds as the backend
const xpThresholds = [
  0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000
];

const getLevelFromXP = (xp) => {
  for (let i = xpThresholds.length - 1; i >= 0; i--) {
    if (xp >= xpThresholds[i]) return i + 1;
  }
  return 1;
};

const getNextLevelXP = (xp) => {
  const currentLevel = getLevelFromXP(xp);
  return xpThresholds[currentLevel] || null;
};

// Combined level calculation (same as backend)
const calculateLevel = (xp, masteredMovesCount) => {
  // Base level from XP
  let xpLevel = 1;
  
  for (let i = 0; i < xpThresholds.length; i++) {
    if (xp >= xpThresholds[i]) {
      xpLevel = i + 1;
    } else {
      break;
    }
  }
  
  // Level from moves mastered (more weight on moves)
  const movesLevel = Math.min(Math.floor(masteredMovesCount / 2) + 1, 15);
  
  // Combine both factors, giving more weight to moves
  const combinedLevel = Math.round((movesLevel * 0.7) + (xpLevel * 0.3));
  
  return Math.min(Math.max(combinedLevel, 1), 15);
};

const getProgress = (xp, masteredMovesCount) => {
  const currentLevel = calculateLevel(xp, masteredMovesCount);
  const nextLevelXP = getNextLevelXP(xp);
  const currentLevelXP = currentLevel > 1 ? xpThresholds[currentLevel - 2] : 0;
  
  // Handle edge cases - cap at 99% to avoid showing 100% completion
  if (nextLevelXP === null || nextLevelXP === xp) return 99;
  if (currentLevelXP >= nextLevelXP) return 99;
  
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = xp - currentLevelXP;
  
  // Ensure progress is between 0 and 99 (never 100%)
  const progress = Math.max(0, Math.min(99, Math.round((xpProgress / totalXPNeeded) * 100)));
  
  return progress;
};

// Wrapper component to handle AuthContext dependency
function ProfileProviderWrapper({ children }) {
  const { currentUser } = useAuth();
  
  return (
    <ProfileProviderInner currentUser={currentUser}>
      {children}
    </ProfileProviderInner>
  );
}

// Inner provider that doesn't depend on AuthContext
function ProfileProviderInner({ children, currentUser }) {
  const [masteredMoves, setMasteredMoves] = useState([]);
  const [pendingMoves, setPendingMoves] = useState([]);
  const [xp, setXP] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update time
  
  // Add missing state variables
  const [profileImage, setProfileImage] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [battleVideo, setBattleVideo] = useState('');
  
  // Fetch fresh user data from backend
  const fetchUserData = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userData = await usersAPI.getById(userId);
      
      if (userData) {
        setMasteredMoves(userData.masteredMoves || []);
        setPendingMoves(userData.pendingMoves || []);
        setXP(userData.xp || 0);
        // Set profile and cover images from database
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
          localStorage.setItem('breakverse_profile_image', userData.profileImage);
        }
        if (userData.coverImage) {
          setCoverPhoto(userData.coverImage);
          localStorage.setItem('breakverse_cover_photo', userData.coverImage);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize images from current user if available
  useEffect(() => {
    if (currentUser) {
      if (currentUser.profileImage && !profileImage) {
        setProfileImage(currentUser.profileImage);
        localStorage.setItem('breakverse_profile_image', currentUser.profileImage);
      }
      if (currentUser.coverImage && !coverPhoto) {
        setCoverPhoto(currentUser.coverImage);
        localStorage.setItem('breakverse_cover_photo', currentUser.coverImage);
      }
    }
  }, [currentUser, profileImage, coverPhoto]);
  
  // Fetch user data when currentUser changes
  useEffect(() => {
    if (currentUser?._id) {
      fetchUserData(currentUser._id);
    }
  }, [currentUser]);
  
  // Add missing computed values and functions
  const level = calculateLevel(xp, masteredMoves.length);
  const nextXP = getNextLevelXP(xp);
  const progress = getProgress(xp, masteredMoves.length);
  
  // Save functions for profile and cover images
  const saveProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
    localStorage.setItem('breakverse_profile_image', imageUrl);
  };
  
  const saveCoverPhoto = (imageUrl) => {
    setCoverPhoto(imageUrl);
    localStorage.setItem('breakverse_cover_photo', imageUrl);
  };
  
  // Add missing functions
  const addMasteredMove = async (move) => {
    if (!currentUser?._id) return;
    
    try {
      const response = await usersAPI.addMasteredMove(currentUser._id, move._id);
      if (response.success) {
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate();
      }
    } catch (error) {
      console.error('Error adding mastered move:', error);
    }
  };
  
  const removeMasteredMove = async (move) => {
    if (!currentUser?._id) return;
    
    try {
      const response = await usersAPI.removeMasteredMove(currentUser._id, move._id);
      if (response.success) {
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate();
      }
    } catch (error) {
      console.error('Error removing mastered move:', error);
    }
  };
  
  const requestMoveApproval = async (move) => {
    if (!currentUser?._id) return;
    
    try {
      const response = await usersAPI.addPendingMove(currentUser._id, move._id);
      if (response.success) {
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate();
      }
    } catch (error) {
      console.error('Error requesting move approval:', error);
    }
  };
  
  const approveMoveRequest = async (move) => {
    if (!currentUser?._id) return;
    
    try {
      const response = await usersAPI.approvePendingMove(currentUser._id, move._id);
      if (response.success) {
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate();
      }
    } catch (error) {
      console.error('Error approving move request:', error);
    }
  };
  
  const rejectMoveRequest = async (move) => {
    if (!currentUser?._id) return;
    
    try {
      const response = await usersAPI.rejectPendingMove(currentUser._id, move._id);
      if (response.success) {
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate();
      }
    } catch (error) {
      console.error('Error rejecting move request:', error);
    }
  };
  
  const refreshUserData = async () => {
    if (currentUser?._id) {
      await fetchUserData(currentUser._id);
    }
  };
  
  const triggerGlobalUpdate = () => {
    setLastUpdate(Date.now());
  };
  
  // Upload profile image to server
  const uploadProfileImage = async (file, previousUrl = '') => {
    if (!currentUser || !currentUser._id) {
      throw new Error('User not logged in');
    }

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('userId', currentUser._id);
    if (previousUrl) {
      formData.append('previousUrl', previousUrl);
    }

    try {
      const data = await uploadAPI.uploadProfileImage(formData);
      
      // Update local state
      setProfileImage(data.imageUrl);
      localStorage.setItem('breakverse_profile_image', data.imageUrl);
      
      // Update user data
      await fetchUserData(currentUser._id);
      triggerGlobalUpdate();
      
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };

  // Upload cover image to server
  const uploadCoverImage = async (file, previousUrl = '') => {
    if (!currentUser || !currentUser._id) {
      throw new Error('User not logged in');
    }

    const formData = new FormData();
    formData.append('coverImage', file);
    formData.append('userId', currentUser._id);
    if (previousUrl) {
      formData.append('previousUrl', previousUrl);
    }

    try {
      const data = await uploadAPI.uploadCoverImage(formData);
      
      // Update local state
      setCoverPhoto(data.imageUrl);
      localStorage.setItem('breakverse_cover_photo', data.imageUrl);
      
      // Update user data
      await fetchUserData(currentUser._id);
      triggerGlobalUpdate();
      
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        masteredMoves,
        pendingMoves,
        addMasteredMove,
        removeMasteredMove,
        requestMoveApproval,
        approveMoveRequest,
        rejectMoveRequest,
        xp,
        level,
        nextXP,
        profileImage,
        setProfileImage: saveProfileImage,
        coverPhoto,
        setCoverPhoto: saveCoverPhoto,
        battleVideo,
        setBattleVideo,
        progress,
        loading,
        refreshUserData,
        lastUpdate, // Add this for global updates
        triggerGlobalUpdate, // Add this for manual triggers
        uploadProfileImage, // Add upload functions
        uploadCoverImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// Export the wrapper component as the main ProfileProvider
export { ProfileProviderWrapper as ProfileProvider };

export const useProfile = () => useContext(ProfileContext);