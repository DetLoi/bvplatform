import { useProfile } from '../context/ProfileContext';
import { useBadges } from '../hooks/useBadges';
import { useMoves } from '../hooks/useMoves';
import BadgeCard from '../components/BadgeCard';
import { FaTrophy, FaLayerGroup, FaFire, FaUsers, FaTag } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import { isBadgeUnlocked } from '../utils/badgeUtils';
import '../styles/pages/badges.css';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

export default function Badges() {
  const { masteredMoves } = useProfile();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use the API hooks
  const { badges, loading, error } = useBadges();
  const { moves, loading: movesLoading } = useMoves();
  // Ensure this hook is called on every render (before any early returns)
  const observe = useIntersectionReveal({ threshold: 0.15 });

  // Ensure badges is always an array
  const badgesArray = Array.isArray(badges) ? badges : [];

  // Calculate badge statistics using new badge utilities
  const earnedBadges = badgesArray.filter(badge => isBadgeUnlocked(badge, masteredMoves, moves));
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

  // Ensure Level category appears first when listing categories together
  const orderedCategories = useMemo(() => {
    const others = uniqueCategories.filter(cat => cat !== 'Level');
    return uniqueCategories.includes('Level') ? ['Level', ...others] : uniqueCategories;
  }, [uniqueCategories]);

  // Navigation categories - dynamic based on actual badge categories
  const navCategories = useMemo(() => {
    const categories = [
      { id: 'all', name: 'All Badges', icon: FaTrophy, count: totalBadges, earned: earnedBadges.length }
    ];

    // Add category-specific tabs
    uniqueCategories.forEach(category => {
      const categoryBadges = badgesByCategory[category];
      const earnedCount = categoryBadges.filter(b => isBadgeUnlocked(b, masteredMoves, moves)).length;
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
  }, [badgesArray, uniqueCategories, badgesByCategory, masteredMoves, moves, totalBadges, earnedBadges.length]);

  // Get badges for active category
  const getActiveBadges = () => {
    if (activeCategory === 'all') {
      return badgesArray;
    }
    
    // Find the category that matches the active category (case-insensitive)
    const matchingCategory = uniqueCategories.find(category => 
      category.toLowerCase() === activeCategory
    );
    
    if (!matchingCategory) return badgesArray;

    const categoryBadges = badgesByCategory[matchingCategory] || [];

    // If we're on the Level tab, sort badges by the defined level order
    if (matchingCategory === 'Level') {
      const levelOrder = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'];
      const orderMap = new Map(levelOrder.map((level, index) => [level.toLowerCase(), index]));
      return [...categoryBadges].sort((a, b) => {
        const aIndex = orderMap.get((a.name || '').toLowerCase());
        const bIndex = orderMap.get((b.name || '').toLowerCase());
        const aVal = aIndex !== undefined ? aIndex : Number.MAX_SAFE_INTEGER;
        const bVal = bIndex !== undefined ? bIndex : Number.MAX_SAFE_INTEGER;
        return aVal - bVal;
      });
    }

    return categoryBadges;
  };

  // Show loading state
  if (loading || movesLoading) {
    return (
      <div className="badges-page main-content fullpage-loading">
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
      <div className="badges-page main-content fullpage-loading">
        <div className="error-container">
          <p>Error loading badges: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="badges-page">
      {/* Category Tabs (styled like Moves page) */}
      <div className="badges-tabs reveal-on-scroll" ref={observe}>
        {navCategories.map((cat) => (
          <button
            key={cat.id}
            className={`badges-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="badges-main-content">
        <div className="badges-container">
          {/* Active Category Badges */}
          {activeCategory === 'all' ? (
            // Group all badges under their category titles
            orderedCategories.map((category) => {
              const categoryBadges = badgesByCategory[category] || [];
              if (categoryBadges.length === 0) return null;

              // Sort Level badges in the defined order
              const sortedBadges = category === 'Level'
                ? (() => {
                    const levelOrder = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'];
                    const orderMap = new Map(levelOrder.map((level, index) => [level.toLowerCase(), index]));
                    return [...categoryBadges].sort((a, b) => {
                      const aIndex = orderMap.get((a.name || '').toLowerCase());
                      const bIndex = orderMap.get((b.name || '').toLowerCase());
                      const aVal = aIndex !== undefined ? aIndex : Number.MAX_SAFE_INTEGER;
                      const bVal = bIndex !== undefined ? bIndex : Number.MAX_SAFE_INTEGER;
                      return aVal - bVal;
                    });
                  })()
                : categoryBadges;

              return (
                <div key={category} className="badge-section">
                  <div className="badges-section-header reveal-on-scroll" ref={observe}>
                    <h3 className="section-title">{category}</h3>
                  </div>
                  <div className="badges-grid">
                    {sortedBadges.map((badge) => (
                      <div key={badge._id || badge.name} className="reveal-on-scroll" ref={observe}>
                        <BadgeCard 
                          badge={badge} 
                          isEarned={isBadgeUnlocked(badge, masteredMoves, moves)}
                          masteredMoves={masteredMoves}
                          allMoves={moves}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="badge-section">
              <div className="badges-grid">
                {getActiveBadges().map((badge) => (
                  <div key={badge._id || badge.name} className="reveal-on-scroll" ref={observe}>
                    <BadgeCard 
                      badge={badge} 
                      isEarned={isBadgeUnlocked(badge, masteredMoves, moves)}
                      masteredMoves={masteredMoves}
                      allMoves={moves}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 