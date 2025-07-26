import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usersAPI } from '../services/api';

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
  
  // Handle edge cases
  if (nextLevelXP === null || nextLevelXP === xp) return 100;
  if (currentLevelXP >= nextLevelXP) return 100;
  
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = xp - currentLevelXP;
  
  // Ensure progress is between 0 and 100
  const progress = Math.max(0, Math.min(100, Math.round((xpProgress / totalXPNeeded) * 100)));
  
  return progress;
};

export function ProfileProvider({ children }) {
  const { currentUser } = useAuth();
  const [masteredMoves, setMasteredMoves] = useState([]);
  const [pendingMoves, setPendingMoves] = useState([]);
  const [xp, setXP] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update time
  
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

  // Sync with current user data from API
  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchUserData(currentUser._id);
    } else {
      // Reset when user logs out
      setMasteredMoves([]);
      setPendingMoves([]);
      setXP(0);
      setProfileImage(null);
      setCoverPhoto(null);
      localStorage.removeItem('breakverse_profile_image');
      localStorage.removeItem('breakverse_cover_photo');
    }
  }, [currentUser]);

  // Function to refresh user data (can be called after updates)
  const refreshUserData = async () => {
    if (currentUser && currentUser._id) {
      await fetchUserData(currentUser._id);
      setLastUpdate(Date.now()); // Trigger global update
    }
  };

  // Function to trigger global update across all components
  const triggerGlobalUpdate = () => {
    setLastUpdate(Date.now());
  };
  const [profileImage, setProfileImage] = useState(() => {
    const saved = localStorage.getItem('breakverse_profile_image');
    return saved || null;
  });
  const [coverPhoto, setCoverPhoto] = useState(() => {
    const saved = localStorage.getItem('breakverse_cover_photo');
    return saved || null;
  });
  
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
  const [battleVideo, setBattleVideo] = useState(null);

  const addMasteredMove = async (move) => {
    if (!masteredMoves.some((m) => m.name === move.name)) {
      try {
        await usersAPI.addMasteredMove(currentUser._id, move._id);
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate(); // Trigger global update
      } catch (error) {
        console.error('Error adding mastered move:', error);
        throw error;
      }
    }
  };

  const removeMasteredMove = async (moveName) => {
    const moveToRemove = masteredMoves.find((m) => m.name === moveName);
    if (moveToRemove) {
      try {
        await usersAPI.removeMasteredMove(currentUser._id, moveToRemove._id);
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate(); // Trigger global update
      } catch (error) {
        console.error('Error removing mastered move:', error);
        throw error;
      }
    }
  };

  const requestMoveApproval = async (move) => {
    if (!pendingMoves.some((m) => m.name === move.name) && 
        !masteredMoves.some((m) => m.name === move.name)) {
      try {
        // Call the backend API to add the pending move
        await usersAPI.addPendingMove(currentUser._id, move._id);
        
        // Refresh user data from backend to ensure consistency
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate(); // Trigger global update
      } catch (error) {
        console.error('Error requesting move approval:', error);
        throw error;
      }
    }
  };

  const approveMoveRequest = async (moveName) => {
    const moveToApprove = pendingMoves.find((m) => m.name === moveName);
    if (moveToApprove) {
      try {
        await usersAPI.approvePendingMove(currentUser._id, moveToApprove._id);
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate(); // Trigger global update
      } catch (error) {
        console.error('Error approving move request:', error);
        throw error;
      }
    }
  };

  const rejectMoveRequest = async (moveName) => {
    const moveToReject = pendingMoves.find((m) => m.name === moveName);
    if (moveToReject) {
      try {
        await usersAPI.rejectPendingMove(currentUser._id, moveToReject._id);
        await fetchUserData(currentUser._id);
        triggerGlobalUpdate(); // Trigger global update
      } catch (error) {
        console.error('Error rejecting move request:', error);
        throw error;
      }
    }
  };

  const level = calculateLevel(xp, masteredMoves.length);
  const nextXP = getNextLevelXP(xp);
  const currentThreshold = xpThresholds[level - 1] || 0;
  const progress = getProgress(xp, masteredMoves.length);

  // Save photos to localStorage and database when they change
  const saveProfileImage = async (imageUrl) => {
    setProfileImage(imageUrl);
    if (imageUrl) {
      localStorage.setItem('breakverse_profile_image', imageUrl);
    } else {
      localStorage.removeItem('breakverse_profile_image');
    }
    
    // Save to database if user is logged in
    if (currentUser && currentUser._id) {
      try {
        await usersAPI.update(currentUser._id, { profileImage: imageUrl });
      } catch (error) {
        console.error('Error saving profile image to database:', error);
      }
    }
  };

  const saveCoverPhoto = async (imageUrl) => {
    setCoverPhoto(imageUrl);
    if (imageUrl) {
      localStorage.setItem('breakverse_cover_photo', imageUrl);
    } else {
      localStorage.removeItem('breakverse_cover_photo');
    }
    
    // Save to database if user is logged in
    if (currentUser && currentUser._id) {
      try {
        await usersAPI.update(currentUser._id, { coverImage: imageUrl });
      } catch (error) {
        console.error('Error saving cover image to database:', error);
      }
    }
  };

  // Upload profile image to server
  const uploadProfileImage = async (file) => {
    if (!currentUser || !currentUser._id) {
      throw new Error('User not logged in');
    }

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('userId', currentUser._id);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/profile-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile image');
      }

      const data = await response.json();
      
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
  const uploadCoverImage = async (file) => {
    if (!currentUser || !currentUser._id) {
      throw new Error('User not logged in');
    }

    const formData = new FormData();
    formData.append('coverImage', file);
    formData.append('userId', currentUser._id);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/cover-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload cover image');
      }

      const data = await response.json();
      
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

export const useProfile = () => useContext(ProfileContext);