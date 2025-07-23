import { useProfile } from '../context/ProfileContext';
import { useBadges } from '../hooks/useBadges';
import BadgeCard from '../components/BadgeCard';
import { FaTrophy, FaLock, FaStar, FaCrown, FaLayerGroup, FaFire, FaUsers } from 'react-icons/fa';
import { useState } from 'react';
import '../styles/pages/badges.css';

export default function Badges() {
  const { masteredMoves } = useProfile();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Use the API hook
  const { badges, loading, error } = useBadges();

  // Calculate badge statistics
  const earnedBadges = badges.filter(badge => badge.unlock && badge.unlock(masteredMoves));
  const totalBadges = badges.length;
  const earnedPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

  // Group badges by category
  const elementBadges = badges.filter(badge => 
    badge.category && 
    badge.category !== 'Level' &&
    (badge.category !== 'Power' || badge.id === 'power-master')
  );
  const levelBadges = badges.filter(badge => badge.category === 'Level');
  const specialBadges = badges.filter(badge => badge.category === 'Power' && badge.id !== 'power-master');

  // Navigation categories
  const navCategories = [
    { id: 'all', name: 'All Badges', icon: FaTrophy, count: totalBadges, earned: earnedBadges.length },
    { id: 'level', name: 'Level Mastery', icon: FaLayerGroup, count: levelBadges.length, earned: levelBadges.filter(b => b.unlock(masteredMoves)).length },
    { id: 'element', name: 'Element Mastery', icon: FaFire, count: elementBadges.length, earned: elementBadges.filter(b => b.unlock(masteredMoves)).length },
    { id: 'power', name: 'Power Specialists', icon: FaUsers, count: specialBadges.length, earned: specialBadges.filter(b => b.unlock(masteredMoves)).length }
  ];

  // Get badges for active category
  const getActiveBadges = () => {
    switch (activeCategory) {
      case 'level':
        return levelBadges;
      case 'element':
        return elementBadges;
      case 'power':
        return specialBadges;
      default:
        return badges;
    }
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
      <div className="badges-layout">
        {/* Left Navigation Panel */}
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
              <div className="section-header">
                <h2 className="section-title">
                  {navCategories.find(cat => cat.id === activeCategory)?.name || 'All Badges'}
                </h2>
                <p className="section-description">
                  {activeCategory === 'all' && 'Browse all available badges and track your progress'}
                  {activeCategory === 'level' && 'Progress through each skill level to earn these achievement badges'}
                  {activeCategory === 'element' && 'Master all moves in each element to earn these prestigious badges'}
                  {activeCategory === 'power' && 'Prove your mastery of ground and air power moves'}
                </p>
              </div>
              <div className="badges-grid">
                {getActiveBadges().map((badge) => (
                  <BadgeCard 
                    key={badge.id} 
                    badge={badge} 
                    isEarned={badge.unlock(masteredMoves)}
                    masteredMoves={masteredMoves}
                  />
                ))}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
} 