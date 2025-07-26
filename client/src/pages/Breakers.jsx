import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { useCrews } from '../hooks/useCrews';
import { FaSearch, FaFilter, FaUsers, FaCrosshairs, FaUserTimes, FaCrown, FaStar, FaSpinner } from 'react-icons/fa';
import '../styles/pages/breakers.css';

export default function Breakers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrew, setSelectedCrew] = useState('all');
  const [sortBy, setSortBy] = useState('level');
  const [callOuts, setCallOuts] = useState(new Set());

  // Fetch real data from database
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { crews, loading: crewsLoading, error: crewsError } = useCrews();

  // Get all breakers from database - show each user individually
  const allBreakers = useMemo(() => {
    if (usersLoading || crewsLoading) return [];
    
    return users.map(user => {
      // Find user's crew information
      let userCrew = null;
      if (user.crew) {
        const crew = crews.find(c => c._id === user.crew);
        if (crew) {
          userCrew = {
            name: crew.name,
            color: crew.color,
            id: crew._id
          };
        }
      }
      
      return {
        id: user._id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage || '/src/assets/placeholder.jpg',
        level: user.level,
        xp: user.xp,
        crew: userCrew,
        status: user.status
      };
    });
  }, [users, crews, usersLoading, crewsLoading]);

  // Filter and sort breakers
  const filteredBreakers = useMemo(() => {
    let filtered = allBreakers;

    // Filter by crew
    if (selectedCrew !== 'all') {
      filtered = filtered.filter(breaker => breaker.crew && breaker.crew.name === selectedCrew);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(breaker => 
        breaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breaker.username.toLowerCase().includes(searchTerm.toLowerCase())
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
          return (a.crew?.name || '').localeCompare(b.crew?.name || '');
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

  // Get unique crew names for filter options
  const crewOptions = useMemo(() => {
    const uniqueCrews = [...new Set(crews.map(crew => crew.name))];
    return [
      { value: 'all', label: 'All Crews' },
      ...uniqueCrews.map(crewName => ({
        value: crewName,
        label: crewName
      }))
    ];
  }, [crews]);

  const sortOptions = [
    { value: 'level', label: 'Level' },
    { value: 'name', label: 'Name' },
    { value: 'crew', label: 'Crew' }
  ];

  // Show loading state
  if (usersLoading || crewsLoading) {
    return (
      <div className="breakers-page">
        <div className="breakers-header">
          <h1 className="page-title">Breakers</h1>
          <p className="page-subtitle">Find and challenge the best breakers in Denmark</p>
        </div>
        <div className="loading-state">
          <FaSpinner className="loading-spinner" />
          <p>Loading breakers...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (usersError || crewsError) {
    return (
      <div className="breakers-page">
        <div className="breakers-header">
          <h1 className="page-title">Breakers</h1>
          <p className="page-subtitle">Find and challenge the best breakers in Denmark</p>
        </div>
        <div className="error-state">
          <p>Error loading breakers: {usersError || crewsError}</p>
        </div>
      </div>
    );
  }

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
                      onError={(e) => {
                        e.target.src = '/src/assets/placeholder.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="breaker-details">
                    {getLevelIcon(breaker.level)}
                    <h3 className="breaker-name">{breaker.name}</h3>
                    <div className="breaker-level">
                      <span className="level-text">Level {breaker.level}</span>
                    </div>
                    {breaker.crew && (
                      <div className="breaker-crew">
                        <span className="crew-name" style={{ color: breaker.crew.color }}>
                          {breaker.crew.name}
                        </span>
                      </div>
                    )}
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