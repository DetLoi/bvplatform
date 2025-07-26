import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaSearch, FaPlus, FaTimes as FaTimesIcon } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import '../styles/pages/add-form.css';

export default function AddMove() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'moves';
  const { createMove, loading, error } = useMoves({ skipInitialFetch: true });
  const { moves: existingMoves } = useMoves({ skipInitialFetch: false });
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Toprock',
    level: 'Beginner',
    xp: 25,
    description: '',
    recommendations: '',
    videoUrl: ''
  });

  // State for recommendations dropdown
  const [showRecommendationsDropdown, setShowRecommendationsDropdown] = useState(false);
  const [recommendationsSearch, setRecommendationsSearch] = useState('');
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  
  // Ref for click outside detection
  const dropdownRef = useRef(null);

  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled'];

  // Filter existing moves for recommendations dropdown
  const filteredMoves = existingMoves.filter(move => 
    move.name.toLowerCase().includes(recommendationsSearch.toLowerCase()) &&
    !selectedRecommendations.includes(move.name)
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRecommendationsDropdown(false);
      }
    };

    if (showRecommendationsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRecommendationsDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRecommendation = (moveName) => {
    if (!selectedRecommendations.includes(moveName)) {
      setSelectedRecommendations(prev => [...prev, moveName]);
      setRecommendationsSearch('');
      setShowRecommendationsDropdown(false);
    }
  };

  const handleRemoveRecommendation = (moveName) => {
    setSelectedRecommendations(prev => prev.filter(name => name !== moveName));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredMoves.length > 0) {
      e.preventDefault();
      handleAddRecommendation(filteredMoves[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Use selected recommendations instead of parsing text input
      const moveData = {
        ...formData,
        recommendations: selectedRecommendations
      };

      // Create the move using the API
      await createMove(moveData);
      
      // Navigate back to admin with success message
      navigate(`/admin?tab=${currentTab}&message=Move added successfully!`);
    } catch (err) {
      console.error('Error creating move:', err);
      // You could add a toast notification here for error handling
      alert('Error creating move: ' + err.message);
    }
  };

  const handleCancel = () => {
    navigate(`/admin?tab=${currentTab}`);
  };

  return (
    <div className="add-form-page">
      <div className="form-container">
        <div className="form-header">
          <button onClick={handleCancel} className="back-btn">
            <FaArrowLeft /> Back
          </button>
          <h1>Add New Move</h1>
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label htmlFor="name">Move Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter move name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <div className="select-wrapper">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="level">Level *</label>
            <div className="select-wrapper">
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="form-select"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="xp">XP Points *</label>
            <input
              type="number"
              id="xp"
              name="xp"
              value={formData.xp}
              onChange={handleChange}
              required
              min="10"
              max="100"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter move description (optional)"
              rows="4"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="recommendations">Recommendations</label>
            <div className="recommendations-container">
              {/* Selected recommendations display */}
              {selectedRecommendations.length > 0 && (
                <div className="selected-recommendations">
                  {selectedRecommendations.map((moveName, index) => (
                    <span key={index} className="recommendation-tag">
                      {moveName}
                      <button
                        type="button"
                        onClick={() => handleRemoveRecommendation(moveName)}
                        className="remove-recommendation"
                      >
                        <FaTimesIcon />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Search input and dropdown */}
              <div className="recommendations-input-container" ref={dropdownRef}>
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                                     <input
                     type="text"
                     placeholder="Search for moves to recommend..."
                     value={recommendationsSearch}
                     onChange={(e) => setRecommendationsSearch(e.target.value)}
                     onFocus={() => setShowRecommendationsDropdown(true)}
                     onKeyDown={handleSearchKeyDown}
                     className="form-input"
                   />
                  <button
                    type="button"
                    onClick={() => setShowRecommendationsDropdown(!showRecommendationsDropdown)}
                    className="dropdown-toggle"
                  >
                    ▼
                  </button>
                </div>
                
                {/* Dropdown with existing moves */}
                {showRecommendationsDropdown && (
                  <div className="recommendations-dropdown">
                    {filteredMoves.length > 0 ? (
                      filteredMoves.map((move) => (
                        <div
                          key={move._id}
                          className="recommendation-option"
                          onClick={() => handleAddRecommendation(move.name)}
                        >
                          <div className="move-info">
                            <span className="move-name">{move.name}</span>
                            <span className="move-category">{move.category}</span>
                            <span className="move-level">{move.level}</span>
                          </div>
                          <FaPlus className="add-icon" />
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        {recommendationsSearch ? 'No moves found' : 'Start typing to search moves'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="videoUrl">Video URL *</label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              required
              placeholder="Enter video URL"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : 'Save Move'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 