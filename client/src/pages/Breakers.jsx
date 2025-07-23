import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { crews } from '../data/crews';
import { FaSearch, FaFilter, FaUsers, FaCrosshairs, FaUserTimes, FaCrown, FaStar } from 'react-icons/fa';
import '../styles/pages/breakers.css';

export default function Breakers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrew, setSelectedCrew] = useState('all');
  const [sortBy, setSortBy] = useState('level');
  const [callOuts, setCallOuts] = useState(new Set());

  // Get all breakers from both crews, grouped by name
  const allBreakers = useMemo(() => {
    const breakerMap = new Map();
    
    crews.forEach(crew => {
      crew.members.forEach(member => {
        if (breakerMap.has(member.name)) {
          // Add crew membership to existing breaker
          breakerMap.get(member.name).crews.push({
            name: crew.name,
            color: crew.color,
            id: crew.id
          });
          // Update level if this crew has a higher level
          const currentLevel = breakerMap.get(member.name).level;
          if (member.level > currentLevel) {
            breakerMap.get(member.name).level = member.level;
          }
        } else {
          // Create new breaker entry
          breakerMap.set(member.name, {
            id: member.id,
            name: member.name,
            profileImage: member.profileImage,
            level: member.level,
            crews: [{
              name: crew.name,
              color: crew.color,
              id: crew.id
            }]
          });
        }
      });
    });
    
    return Array.from(breakerMap.values());
  }, []);

  // Filter and sort breakers
  const filteredBreakers = useMemo(() => {
    let filtered = allBreakers;

    // Filter by crew
    if (selectedCrew !== 'all') {
      filtered = filtered.filter(breaker => breaker.crews.some(crew => crew.name === selectedCrew));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(breaker => 
        breaker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort breakers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'crew':
          return a.crews[0]?.name.localeCompare(b.crews[0]?.name || '');
        default:
          return b.level - a.level;
      }
    });

    return filtered;
  }, [allBreakers, searchTerm, selectedCrew, sortBy]);

  const handleCallOut = (breakerId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking call out button
    setCallOuts(prev => {
      const newSet = new Set(prev);
      newSet.add(breakerId);
      return newSet;
    });
    console.log(`Call out sent to breaker: ${breakerId}`);
  };

  const handleRemoveCallOut = (breakerId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking remove button
    setCallOuts(prev => {
      const newSet = new Set(prev);
      newSet.delete(breakerId);
      return newSet;
    });
    console.log(`Call out removed for breaker: ${breakerId}`);
  };

  const handleCardClick = (breakerId) => {
    navigate(`/breakers/${breakerId}`);
  };

  const getLevelIcon = (level) => {
    if (level >= 8) return <FaCrown className="level-icon crown" />;
    if (level >= 6) return <FaStar className="level-icon star" />;
    return <FaStar className="level-icon" />;
  };

  const crewOptions = [
    { value: 'all', label: 'All Crews' },
    { value: 'Specific Kidz', label: 'Specific Kidz' },
    { value: 'Famillia Loca', label: 'Famillia Loca' }
  ];

  const sortOptions = [
    { value: 'level', label: 'Level' },
    { value: 'name', label: 'Name' },
    { value: 'crew', label: 'Crew' }
  ];

  return (
    <div className="breakers-page">
      <div className="breakers-header">
        <h1 className="page-title">Breakers</h1>
        <p className="page-subtitle">Find and challenge the best breakers in Denmark</p>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search breakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-bar">
          <div className="filter-item">
            <label>Crew</label>
            <select
              value={selectedCrew}
              onChange={(e) => setSelectedCrew(e.target.value)}
              className="filter-select"
            >
              {crewOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="results-count">
            <FaUsers />
            <span>{filteredBreakers.length} breakers</span>
          </div>
        </div>
      </div>

      {/* Breakers Grid */}
      <div className="breakers-container">
        <div className="breakers-grid">
          {filteredBreakers.map((breaker) => (
            <div 
              key={breaker.id} 
              className="breaker-card"
              onClick={() => handleCardClick(breaker.id)}
            >
              <div className="card-header">
                <div className="breaker-info">
                  <div className="avatar-container">
                    <img
                      src={breaker.profileImage}
                      alt={breaker.name}
                      className="breaker-avatar"
                    />
                  </div>
                  
                  <div className="breaker-details">
                    {getLevelIcon(breaker.level)}
                    <h3 className="breaker-name">{breaker.name}</h3>
                    <div className="breaker-level">
                      <span className="level-text">Level {breaker.level}</span>
                    </div>
                  </div>
                </div>

                <div className="action-button">
                  {callOuts.has(breaker.id) ? (
                    <button
                      className="btn-remove"
                      onClick={(e) => handleRemoveCallOut(breaker.id, e)}
                      title="Remove call out"
                    >
                      <FaUserTimes />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button
                      className="btn-callout"
                      onClick={(e) => handleCallOut(breaker.id, e)}
                      title="Send call out"
                    >
                      <FaCrosshairs />
                      <span>Call out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBreakers.length === 0 && (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No breakers found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 