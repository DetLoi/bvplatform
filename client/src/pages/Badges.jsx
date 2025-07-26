import { useProfile } from '../context/ProfileContext';
import { useBadges } from '../hooks/useBadges';
import BadgeCard from '../components/BadgeCard';
import { FaTrophy, FaLock, FaStar, FaCrown, FaLayerGroup, FaFire, FaUsers, FaTag } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import { isBadgeUnlocked } from '../utils/badgeUtils';
import '../styles/pages/badges.css';

export default function Badges() {
  const { masteredMoves } = useProfile();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use the API hook
  const { badges, loading, error } = useBadges();

  // Ensure badges is always an array
  const badgesArray = Array.isArray(badges) ? badges : [];

  // Calculate badge statistics
  const earnedBadges = badgesArray.filter(badge => isBadgeUnlocked(badge, masteredMoves));
  const totalBadges = badgesArray.length;
  const earnedPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

  // Category to icon mapping
  const categoryIconMap = {
    'Level': FaLayerGroup,
    'Element': FaFire,
    'Power': FaUsers,
    'Special': FaLayerGroup, // Legacy support
  };

  // Get unique categories from badges
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(badgesArray.map(badge => badge.category))].filter(Boolean);
    return categories.sort();
  }, [badgesArray]);

  // Group badges by category
  const badgesByCategory = useMemo(() => {
    const grouped = {};
    uniqueCategories.forEach(category => {
      grouped[category] = badgesArray.filter(badge => badge.category === category);
    });
    return grouped;
  }, [badgesArray, uniqueCategories]);

  // Navigation categories - dynamic based on actual badge categories
  const navCategories = useMemo(() => {
    const categories = [
      { id: 'all', name: 'All Badges', icon: FaTrophy, count: totalBadges, earned: earnedBadges.length }
    ];

    // Add category-specific tabs
    uniqueCategories.forEach(category => {
      const categoryBadges = badgesByCategory[category];
      const earnedCount = categoryBadges.filter(b => isBadgeUnlocked(b, masteredMoves)).length;
      const icon = categoryIconMap[category] || FaTag; // Use FaTag as fallback for custom categories
      
      categories.push({
        id: category.toLowerCase(),
        name: category,
        icon: icon,
        count: categoryBadges.length,
        earned: earnedCount
      });
    });

    return categories;
  }, [badgesArray, uniqueCategories, badgesByCategory, masteredMoves, totalBadges, earnedBadges.length]);

  // Get badges for active category
  const getActiveBadges = () => {
    if (activeCategory === 'all') {
      return badgesArray;
    }
    
    // Find the category that matches the active category (case-insensitive)
    const matchingCategory = uniqueCategories.find(category => 
      category.toLowerCase() === activeCategory
    );
    
    return matchingCategory ? badgesByCategory[matchingCategory] : badgesArray;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="badges-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading badges...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="badges-page">
        <div className="error-container">
          <p>Error loading badges: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="badges-page">
      {/* Top Navigation Panel */}
      <div className="badges-nav-panel">
        <div className="nav-header">
          <h3>Badge Categories</h3>
        </div>
        <div className="nav-categories">
          {navCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`nav-category ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="nav-category-icon">
                  <IconComponent size={20} />
                </div>
                <div className="nav-category-content">
                  <span className="nav-category-name">{category.name}</span>
                  <span className="nav-category-count">{category.earned}/{category.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="badges-main-content">
        <div className="badges-container">
          {/* Active Category Badges */}
          <div className="badge-section">
            <div className="badges-grid">
              {getActiveBadges().map((badge) => (
                <BadgeCard 
                  key={badge._id || badge.name} 
                  badge={badge} 
                  isEarned={isBadgeUnlocked(badge, masteredMoves)}
                  masteredMoves={masteredMoves}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 