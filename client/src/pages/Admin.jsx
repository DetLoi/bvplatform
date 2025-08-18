import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaTrophy, FaDumbbell, FaCalendar, FaUserEdit, FaTrash, FaPlus, FaMinus, FaEdit, FaSave, FaTimes, FaSearch, FaCheckCircle, FaTimesCircle, FaClipboardCheck, FaSync, FaTh, FaList, FaGlobe, FaFlag, FaCrosshairs, FaVideo, FaUpload, FaEye, FaGamepad, FaCrown, FaFire, FaClock, FaEnvelopeOpenText } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import { useUsers } from '../hooks/useUsers';
import { useBadges } from '../hooks/useBadges';
import { useEvents } from '../hooks/useEvents';

import { useBattles } from '../hooks/useBattles';
import { useBulkSubmissions } from '../hooks/useBulkSubmissions';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { toast } from 'react-hot-toast';
import Toast from '../components/Toast';
import '../styles/pages/admin.css';
import '../styles/pages/add-form.css';
import { newsletterAPI, usersAPI } from '../services/api';

// Helper function to identify Danish events
const isDanishEvent = (event) => {
  const danishKeywords = ['denmark', 'danmark', 'danish', 'dansk'];
  const nonDanishOrganizers = ['sweden', 'norway', 'finland', 'iceland', 'germany', 'france', 'spain', 'italy', 'poland', 'czech', 'austria', 'switzerland', 'belgium', 'netherlands', 'portugal', 'greece', 'hungary', 'romania', 'bulgaria', 'croatia', 'serbia', 'slovenia', 'slovakia', 'lithuania', 'latvia', 'estonia'];
  
  const organizer = (event.organizer || '').toLowerCase();
  const location = (event.location || '').toLowerCase();
  
  // First check if organizer is clearly non-Danish
  if (nonDanishOrganizers.some(country => organizer.includes(country))) {
    return false;
  }
  
  // Then check for Danish keywords in organizer or location
  return danishKeywords.some(keyword => 
    organizer.includes(keyword) || location.includes(keyword)
  );
};

// Edit Form Components
const EditMoveForm = ({ move, onSave, onCancel, formRef }) => {
  const [formData, setFormData] = useState({
    name: move.name,
    category: move.category,
    level: move.level,
    xp: move.xp,
    description: move.description || '',
    videoUrl: move.videoUrl || ''
  });

  // State for recommendations dropdown
  const [showRecommendationsDropdown, setShowRecommendationsDropdown] = useState(false);
  const [recommendationsSearch, setRecommendationsSearch] = useState('');
  const [selectedRecommendations, setSelectedRecommendations] = useState(
    move.recommendations ? move.recommendations.map(rec => rec.name || rec) : []
  );
  
  // Ref for click outside detection
  const dropdownRef = useRef(null);

  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'];

  // Get existing moves for recommendations dropdown
  const { moves: existingMoves } = useMoves({ skipInitialFetch: false });

  // Filter existing moves for recommendations dropdown
  const filteredMoves = existingMoves.filter(existingMove => 
    existingMove.name.toLowerCase().includes(recommendationsSearch.toLowerCase()) &&
    !selectedRecommendations.includes(existingMove.name) &&
    existingMove.name !== move.name // Exclude the currently edited move from recommendations
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      ...move, 
      ...formData, 
      recommendations: selectedRecommendations,
      type: 'moves'
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="add-form">
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
                    <FaTimes />
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
    </form>
  );
};

const EditBadgeForm = ({ badge, onSave, onCancel, formRef, moves }) => {
  const [formData, setFormData] = useState({
    name: badge.name || '',
    description: badge.description || '',
    category: badge.category || '',
    image: null,
    imagePreview: badge.image || null,
  });

  // Category dropdown state (aligned with AddBadge)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState(badge.category || '');
  const [customCategories, setCustomCategories] = useState([]);

  const defaultCategories = ['Level', 'Element', 'Power'];
  const allCategories = [...defaultCategories, ...customCategories];

  // Requirements state (aligned with AddBadge) – we work with move names
  const [showRequirementsDropdown, setShowRequirementsDropdown] = useState(false);
  const [requirementsSearch, setRequirementsSearch] = useState('');
  const [requirementsCategoryFilter, setRequirementsCategoryFilter] = useState('');
  const [selectedRequirements, setSelectedRequirements] = useState(() => {
    const requirementIds = badge.requirements?.moves || [];
    const idSet = new Set(requirementIds.map(id => id.toString()))
    return moves
      .filter(m => idSet.has((m._id || m.id).toString()))
      .map(m => m.name);
  });

  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const availableCategories = [...new Set(moves.map(move => move.category))].sort();
  const filteredCategories = allCategories.filter(category => 
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredMoves = moves.filter(move => {
    const matchesName = move.name.toLowerCase().includes(requirementsSearch.toLowerCase());
    const matchesCategory = !requirementsCategoryFilter || 
      move.category.toLowerCase().includes(requirementsCategoryFilter.toLowerCase());
    const notSelected = !selectedRequirements.includes(move.name);
    return matchesName && matchesCategory && notSelected;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRequirementsDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    if (showCategoryDropdown || showRequirementsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown, showRequirementsDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategorySearch(value);
    if (allCategories.includes(value)) {
      setFormData(prev => ({ ...prev, category: value }));
    } else {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  };

  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newCategory = categorySearch.trim();
      if (newCategory && !allCategories.includes(newCategory)) {
        setCustomCategories(prev => [...prev, newCategory]);
        setFormData(prev => ({ ...prev, category: newCategory }));
        setCategorySearch(newCategory);
        setShowCategoryDropdown(false);
      } else if (filteredCategories.length > 0) {
        const selected = filteredCategories[0];
        setFormData(prev => ({ ...prev, category: selected }));
        setCategorySearch(selected);
        setShowCategoryDropdown(false);
      }
    }
  };

  const handleSelectCategory = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setCategorySearch(category);
    setShowCategoryDropdown(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddRequirement = (moveName) => {
    if (!selectedRequirements.includes(moveName)) {
      setSelectedRequirements(prev => [...prev, moveName]);
      setRequirementsSearch('');
      setShowRequirementsDropdown(false);
    }
  };

  const handleRemoveRequirement = (moveName) => {
    setSelectedRequirements(prev => prev.filter(name => name !== moveName));
  };

  const clearRequirementsFilters = () => {
    setRequirementsSearch('');
    setRequirementsCategoryFilter('');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredMoves.length > 0) {
      e.preventDefault();
      handleAddRequirement(filteredMoves[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    fd.append('requirements', JSON.stringify(selectedRequirements));
    if (formData.image) {
      fd.append('badgeImage', formData.image);
    }
    onSave({ ...badge, type: 'badges', formData: fd, isMultipart: true });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="add-form">
      <div className="form-group">
        <label htmlFor="name">Badge Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter badge name"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Enter badge description"
          rows="3"
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <div className="recommendations-input-container" ref={categoryDropdownRef}>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              id="category"
              name="category"
              value={categorySearch}
              onChange={handleCategoryChange}
              onFocus={() => setShowCategoryDropdown(true)}
              onKeyDown={handleCategoryKeyDown}
              required
              placeholder="Type category name or select from dropdown..."
              className="form-input"
            />
            <button type="button" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="dropdown-toggle">▼</button>
          </div>
          {showCategoryDropdown && (
            <div className="recommendations-dropdown">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category} className="recommendation-option" onClick={() => handleSelectCategory(category)}>
                    <div className="move-info">
                      <span className="move-name">{category}</span>
                      {customCategories.includes(category) && <span className="move-category">Custom Category</span>}
                    </div>
                    <FaPlus className="add-icon" />
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {categorySearch ? 'Press Enter to create new category' : 'Start typing to search categories'}
                </div>
              )}
            </div>
          )}
        </div>
        {formData.category && (
          <div className="selected-category">
            <span className="category-tag">{formData.category}{customCategories.includes(formData.category) && (<span className="custom-badge">Custom</span>)}</span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="requirements">Requirements (Moves to Master) *</label>
        <div className="recommendations-container">
          {selectedRequirements.length > 0 && (
            <div className="selected-recommendations">
              {selectedRequirements.map((moveName, index) => (
                <span key={index} className="recommendation-tag">
                  {moveName}
                  <button type="button" onClick={() => handleRemoveRequirement(moveName)} className="remove-recommendation">
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="recommendations-input-container" ref={dropdownRef}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for moves to require..."
                value={requirementsSearch}
                onChange={(e) => setRequirementsSearch(e.target.value)}
                onFocus={() => setShowRequirementsDropdown(true)}
                onKeyDown={handleSearchKeyDown}
                className="form-input"
              />
              <button type="button" onClick={() => setShowRequirementsDropdown(!showRequirementsDropdown)} className="dropdown-toggle">▼</button>
            </div>
            <div className="category-filter-wrapper">
              <select
                value={requirementsCategoryFilter}
                onChange={(e) => setRequirementsCategoryFilter(e.target.value)}
                className="form-select category-filter"
                onFocus={() => setShowRequirementsDropdown(true)}
              >
                <option value="">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {(requirementsSearch || requirementsCategoryFilter) && (
                <button type="button" onClick={clearRequirementsFilters} className="clear-filters-btn" title="Clear filters">
                  <FaTimes />
                </button>
              )}
            </div>
            {showRequirementsDropdown && (
              <div className="recommendations-dropdown">
                {filteredMoves.length > 0 ? (
                  filteredMoves.map((move) => (
                    <div key={move._id} className="recommendation-option" onClick={() => handleAddRequirement(move.name)}>
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
                    {requirementsSearch || requirementsCategoryFilter ? `No moves found matching "${requirementsSearch}"${requirementsCategoryFilter ? ` in ${requirementsCategoryFilter}` : ''}` : 'Start typing to search moves or select a category'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">Badge Icon *</label>
        <div className="image-upload-container">
          {formData.imagePreview ? (
            <div className="image-preview">
              <img src={formData.imagePreview.startsWith('/uploads/') ? `http://localhost:5000${formData.imagePreview}` : formData.imagePreview} alt="Badge preview" className="preview-image" />
              <button type="button" onClick={handleRemoveImage} className="remove-image-btn"><FaTimes /> Remove</button>
            </div>
          ) : (
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <FaImage className="upload-icon" />
              <p>Click to upload badge image</p>
              <small>PNG, JPG up to 5MB</small>
            </div>
          )}
          <input ref={fileInputRef} type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload} className="hidden-file-input" />
        </div>
      </div>
    </form>
  );
};

const EditEventForm = ({ event, onSave, onCancel, formRef }) => {
  // Format date for display in the form
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const [formData, setFormData] = useState({
    title: event.title,
    date: formatDateForInput(event.date),
    location: event.location,
    category: event.category,
    description: event.description || '',
    status: event.status || 'upcoming',
    organizer: event.organizer || '',
    website: event.website || '',
    image: event.image || ''
  });

  const [imagePreview, setImagePreview] = useState(event.image || '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert date string to Date object if it's a valid date
    let processedData = { ...formData };
    if (formData.date) {
      const dateObj = new Date(formData.date);
      if (!isNaN(dateObj.getTime())) {
        processedData.date = dateObj.toISOString();
      }
    }
    
    onSave({
      ...event,
      ...processedData,
      image: imagePreview,
      type: 'events'
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="add-form">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="Competition">Competition</option>
          <option value="Workshop">Workshop</option>
          <option value="Cypher">Cypher</option>
          <option value="Battle">Battle</option>
          <option value="Showcase">Showcase</option>
        </select>
      </div>
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>


      <div className="form-group">
        <label>Organizer</label>
        <input
          type="text"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows="4"
          placeholder="Event description..."
        />
      </div>

      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="form-input"
          placeholder="https://event.com"
        />
      </div>
      <div className="form-group">
        <label>Event Banner</label>
        <div className="image-upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="image-upload-input"
            id={`banner-upload-${event.id}`}
          />
          <label htmlFor={`banner-upload-${event.id}`} className="image-upload-label">
            {imagePreview ? 'Change Banner' : 'Upload Banner'}
          </label>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Event banner preview" />
            </div>
          )}
        </div>
      </div>


    </form>
  );
};



const EditUserForm = ({ user, onSave, onCancel, formRef, moves }) => {
  // Convert move objects to move names for the form
  const masteredMoveNames = user.masteredMoves ? 
    user.masteredMoves.map(move => {
      // Handle both populated objects and string IDs
      if (typeof move === 'string') {
        // If it's a string ID, we need to find the move name
        const foundMove = moves.find(m => m._id === move);
        return foundMove ? foundMove.name : move;
      } else {
        // If it's a populated object, use the name
        return move.name;
      }
    }) : [];
  
  const [formData, setFormData] = useState({
    username: user.username,
    password: user.password || '',
    name: user.name || '',
    email: user.email,
    bio: user.bio || '',
    profileImage: user.profileImage || '',
    coverImage: user.coverImage || '',
    masteredMoves: masteredMoveNames,
    battleVideos: user.battleVideos || [],
    level: user.level || 1,
    status: user.status || 'active',
    roles: user.roles || ['student'],
    instructor: user.instructor || null
  });

  const [moveSearchTerm, setMoveSearchTerm] = useState('');
  const [showMovesDropdown, setShowMovesDropdown] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch instructors when component mounts
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setInstructorsLoading(true);
        console.log('🔍 Fetching instructors...');
        const data = await usersAPI.getInstructors();
        console.log('🔍 Instructors data:', data);
        setInstructors(data);
      } catch (error) {
        console.error('🔍 Error fetching instructors:', error);
      } finally {
        setInstructorsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMovesDropdown(false);
      }
    };
    if (showMovesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMovesDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const addMove = (moveName) => {
    if (!formData.masteredMoves.includes(moveName)) {
      setFormData(prev => ({
        ...prev,
        masteredMoves: [...prev.masteredMoves, moveName]
      }));
    }
  };

  const removeMove = (moveName) => {
    setFormData(prev => ({
      ...prev,
      masteredMoves: prev.masteredMoves.filter(move => move !== moveName)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert move names back to move IDs for the API
    const masteredMoveIds = formData.masteredMoves
      .map(moveName => {
        const move = moves.find(m => m.name === moveName);
        return move ? move._id : null;
      })
      .filter(id => id !== null);
    
    // Only include password if it's been changed (not empty)
    const updateData = {
      ...user,
      ...formData,
      masteredMoves: masteredMoveIds
    };
    
    // Remove password if it's empty (not changed)
    if (!formData.password || formData.password.trim() === '') {
      delete updateData.password;
    }
    
    // Handle instructor field - convert empty string to null/undefined
    if (formData.instructor === '') {
      updateData.instructor = undefined;
    }
    
    // Add the type property that handleSave expects
    onSave({ ...updateData, type: 'users' });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="admin-edit-user-form">
      <div className="admin-edit-user-form-content">
        
        {/* Basic Information Section */}
        <div className="admin-edit-user-section">
          <h3 className="admin-edit-user-section-title">Basic Information</h3>
          <div className="admin-edit-user-form-grid">
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="admin-edit-user-input"
                required
              />
            </div>
            
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="admin-edit-user-input"
                placeholder="Enter full name"
              />
            </div>
            
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="admin-edit-user-input"
                required
              />
            </div>
            
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="admin-edit-user-input"
                placeholder="Enter new password (leave blank to keep current)"
              />
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="admin-edit-user-section">
          <h3 className="admin-edit-user-section-title">Profile Details</h3>
          <div className="admin-edit-user-form-grid">
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="admin-edit-user-textarea"
                rows="3"
                placeholder="Enter user bio"
              />
            </div>
            
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="admin-edit-user-input"
                placeholder="https://example.com/profile.jpg"
              />
              {formData.profileImage && (
                <div className="admin-edit-user-image-preview">
                  <img src={formData.profileImage} alt="profile preview" className="admin-edit-user-preview-image admin-edit-user-preview-profile" />
                </div>
              )}
            </div>
            
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="admin-edit-user-input"
                placeholder="https://example.com/cover.jpg"
              />
              {formData.coverImage && (
                <div className="admin-edit-user-image-preview">
                  <img src={formData.coverImage} alt="cover preview" className="admin-edit-user-preview-image admin-edit-user-preview-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="admin-edit-user-section">
          <h3 className="admin-edit-user-section-title">Account Settings</h3>
          <div className="admin-edit-user-form-grid">
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Level (Auto-calculated)</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                className="admin-edit-user-input admin-edit-user-input-disabled"
                readOnly
                disabled
              />
            </div>
            
            <div className="admin-edit-user-form-group">
              <label className="admin-edit-user-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="admin-edit-user-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            
            {formData.roles.includes('student') && (
              <div className="admin-edit-user-form-group admin-edit-user-instructor-field">
                <label className="admin-edit-user-label">Instructor</label>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                  Debug: roles={JSON.stringify(formData.roles)}, instructors count={instructors.length}
                </div>
                <select
                  name="instructor"
                  value={formData.instructor || ''}
                  onChange={handleChange}
                  className="admin-edit-user-select"
                >
                  <option value="">No instructor assigned</option>
                  {instructorsLoading ? (
                    <option value="" disabled>Loading instructors...</option>
                  ) : instructors.length > 0 ? (
                    instructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name || instructor.username} ({instructor.email})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No instructors found</option>
                  )}
                </select>
                <small className="admin-edit-user-help-text">
                  Only students can have an instructor assigned
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Roles Section */}
        <div className="admin-edit-user-section">
          <h3 className="admin-edit-user-section-title">User Roles</h3>
          <div className="admin-edit-user-roles-container">
            {['student', 'instructor', 'judge', 'admin'].map(role => (
              <label key={role} className="admin-edit-user-role-checkbox">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        roles: [...prev.roles, role]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        roles: prev.roles.filter(r => r !== role)
                      }));
                    }
                  }}
                  className="admin-edit-user-role-input"
                />
                <span className="admin-edit-user-role-label">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mastered Moves Section */}
        <div className="admin-edit-user-section">
          <h3 className="admin-edit-user-section-title">Mastered Moves</h3>
          <div className="admin-edit-user-moves-container">
            <div className="admin-edit-user-moves-search-container" ref={dropdownRef}>
              <div className="admin-edit-user-moves-search-wrapper">
                <FaSearch className="admin-edit-user-moves-search-icon" />
                <input
                  type="text"
                  placeholder="Search moves to add..."
                  value={moveSearchTerm}
                  onChange={(e) => {
                    setMoveSearchTerm(e.target.value);
                    setShowMovesDropdown(true);
                  }}
                  onFocus={() => setShowMovesDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const first = moves
                        .filter(m => !formData.masteredMoves.includes(m.name))
                        .filter(m => m.name.toLowerCase().includes(moveSearchTerm.toLowerCase()))[0];
                      if (first) {
                        addMove(first.name);
                        setMoveSearchTerm('');
                        setShowMovesDropdown(false);
                      }
                    }
                  }}
                  className="admin-edit-user-moves-search-input"
                />
                <button
                  type="button"
                  className="admin-edit-user-moves-dropdown-toggle"
                  onClick={() => setShowMovesDropdown(v => !v)}
                  aria-label="Toggle moves dropdown"
                >
                  ▾
                </button>
              </div>

              {showMovesDropdown && (
                <div className="admin-edit-user-moves-dropdown">
                  {moves
                    .filter(m => !formData.masteredMoves.includes(m.name))
                    .filter(m => m.name.toLowerCase().includes(moveSearchTerm.toLowerCase()))
                    .slice(0, 50)
                    .map((move) => (
                      <div
                        key={move._id || move.name}
                        className="admin-edit-user-moves-option"
                        onClick={() => {
                          addMove(move.name);
                          setMoveSearchTerm('');
                          setShowMovesDropdown(false);
                        }}
                      >
                        <div className="admin-edit-user-moves-option-info">
                          <span className={`admin-edit-user-moves-option-name admin-edit-user-moves-option-level-${(move.level || '').toLowerCase()}`}>
                            {move.name}
                          </span>
                          <span className="admin-edit-user-moves-option-category">
                            {move.category} · <span className="admin-edit-user-moves-option-level">{move.level}</span>
                          </span>
                        </div>
                        <FaPlus className="admin-edit-user-moves-option-add-icon" />
                      </div>
                    ))}
                                     {moves
                     .filter(m => !formData.masteredMoves.includes(m.name))
                     .filter(m => m.name.toLowerCase().includes(moveSearchTerm.toLowerCase())).length === 0 && (
                      <div className="admin-edit-user-moves-no-results">No matching moves</div>
                    )}
                </div>
              )}
            </div>

            <div className="admin-edit-user-moves-lists">
              <div className="admin-edit-user-mastered-moves">
                <h4 className="admin-edit-user-moves-subtitle">Mastered Moves ({formData.masteredMoves.length})</h4>
                <div className="admin-edit-user-moves-grid">
                  {formData.masteredMoves.map((moveName, index) => {
                    const move = moves.find(m => m.name === moveName);
                    return (
                      <div key={`${moveName}-${index}`} className="admin-edit-user-move-item admin-edit-user-move-item-mastered">
                        <span className={`admin-edit-user-move-name admin-edit-user-move-level-${move?.level?.toLowerCase() || 'beginner'}`}>
                          {moveName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMove(moveName)}
                          className="admin-edit-user-remove-move-btn"
                          title="Remove move"
                        >
                          <FaMinus size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Videos Section */}
        <div className="admin-edit-user-section">
          <h3 className="admin-edit-user-section-title">Battle Videos</h3>
          <div className="admin-edit-user-form-group">
            <label className="admin-edit-user-label">Battle Video URLs (comma-separated)</label>
            <textarea
              name="battleVideos"
              value={formData.battleVideos.join(', ')}
              onChange={(e) => handleArrayChange('battleVideos', e.target.value)}
              className="admin-edit-user-textarea"
              rows="3"
              placeholder="e.g., https://youtube.com/watch?v=..., https://vimeo.com/..."
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { currentUser, isAdmin, updateUser: updateAuthUser } = useAuth();
  const { userProfile } = useProfile();
  const { moves, loading: movesLoading, error: movesError, addMove, updateMove, deleteMove } = useMoves();
  const { users, loading: usersLoading, error: usersError, addUser, updateUser, deleteUser } = useUsers();
  const { badges, loading: badgesLoading, error: badgesError, addBadge, updateBadge, deleteBadge } = useBadges();
  const { events, loading: eventsLoading, error: eventsError, addEvent, updateEvent, deleteEvent } = useEvents();

  const { battles, loading: battlesLoading, error: battlesError, updateBattle, deleteBattle, refreshBattles } = useBattles();
  const { submissions: bulkSubmissions, loading: bulkSubmissionsLoading, error: bulkSubmissionsError, approveSubmission: approveBulkSubmission, rejectSubmission: rejectBulkSubmission } = useBulkSubmissions();
  
  // Check if we're on an edit page to disable auto-refresh
  const isOnEditPage = location.pathname.includes('/edit-');
  
  // Check if user is logged in and is admin
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
  }, [currentUser, isAdmin, navigate]);
  
  // Show loading or redirect if not admin
  if (!currentUser || !isAdmin()) {
    return (
      <div className="admin-page">
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Checking admin access...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Initialize activeTab based on URL parameters
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    return (tab && ['moves', 'badges', 'events', 'users', 'battles', 'approvals', 'newsletter'].includes(tab)) ? tab : 'moves';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    moves: '',
    badges: '',
    events: '',

    users: '',
    battles: '',
    approvals: '',
    newsletter: ''
  });
  const [toast, setToast] = useState({ show: false, message: '' });
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [eventsSubTab, setEventsSubTab] = useState('and8'); // 'and8' or 'danish'
  const [battlesSubTab, setBattlesSubTab] = useState('all'); // 'all', 'pending', 'active', 'completed', 'judged'
  const [approvalsSubTab, setApprovalsSubTab] = useState('pending'); // 'pending' or 'all'

  // Update tab when URL parameters change and check for success messages
  useEffect(() => {
    const tab = searchParams.get('tab');
    const message = searchParams.get('message');
    
    if (tab && ['moves', 'badges', 'events', 'users', 'battles', 'approvals'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Show toast if there's a success message from add pages
    if (message) {
      showToast(message);
      // Remove the message from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('message');
      setSearchParams(newSearchParams);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    // Clear search term when switching tabs
    setSearchTerms(prev => ({
      ...prev,
      [activeTab]: '' // Clear the current tab's search
    }));
    // Scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Use real API data
  const usersData = users || [];
  const movesData = moves || [];
  const badgesData = badges || [];
  const eventsData = events || [];

  const battlesData = battles || [];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffd54f';
      case 'accepted': return '#4caf50';
      case 'declined': return '#ff6b6b';
      case 'in progress': return '#2196f3';
      case 'completed': return '#9c27b0';
      case 'judged': return '#ff9800';
      default: return '#999';
    }
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Awaiting Response';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'in progress': return 'In Progress';
      case 'completed': return 'Videos Uploaded';
      case 'judged': return 'Judged';
      default: return status;
    }
  };



  const handleEdit = (item, type) => {
    // Set the item to edit mode instead of navigating
    setEditingItem({ ...item, type });
  };

  const handleSave = async (updatedItem) => {
    const { type, ...itemData } = updatedItem;
    let itemName = '';
    
    try {
      switch (type) {
        case 'moves':
          itemName = itemData.name || 'Move';
          await updateMove(itemData._id, itemData);
          break;
        case 'badges':
          itemName = itemData.name || 'Badge';
          if (itemData.isMultipart && itemData.formData) {
            await updateBadge(itemData._id, itemData.formData);
          } else {
            await updateBadge(itemData._id, itemData);
          }
          break;
        case 'events':
          itemName = itemData.title || 'Event';
          await updateEvent(itemData._id, itemData);
          break;
        case 'users':
          itemName = itemData.username || 'User';
          const response = await updateUser(itemData._id, itemData);
          // Refresh user data in ProfileContext after updating a user
          if (refreshUserData) {
            refreshUserData();
          }
          // Update AuthContext if the updated user is the current user
          if (currentUser && currentUser._id === itemData._id) {
            updateAuthUser(itemData);
          }
          // Show badge notification if new badges were earned
          if (response && response.newBadges && response.newBadges.length > 0) {
            const badgeNames = response.newBadges.map(badge => badge.name).join(', ');
            showToast(`🎉 ${itemName} earned new badges: ${badgeNames}!`);
          }
          break;

        case 'battles':
          itemName = `Battle ${itemData._id}` || 'Battle';
          await updateBattle(itemData._id, itemData);
          break;
        default:
          showToast(`${itemName} updated successfully!`);
          break;
      }
      
      setEditingItem(null);
      showToast(`${itemName} updated successfully!`);
    } catch (error) {
      showToast(`Error updating ${itemName}: ${error.message}`);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      let itemName = '';
      try {
        switch (type) {
          case 'moves':
            const moveToDelete = moves.find(item => item._id === id);
            itemName = moveToDelete?.name || 'Move';
            await deleteMove(id);
            break;
          case 'badges':
            const badgeToDelete = badges.find(item => item._id === id);
            itemName = badgeToDelete?.name || 'Badge';
            await deleteBadge(id);
            break;
          case 'events':
            const eventToDelete = events.find(item => item._id === id);
            itemName = eventToDelete?.title || 'Event';
            await deleteEvent(id);
            break;
          case 'users':
            const userToDelete = users.find(item => item._id === id);
            itemName = userToDelete?.username || 'User';
            await deleteUser(id);
            break;

          case 'battles':
            const battleToDelete = battles.find(item => item._id === id);
            itemName = `Battle ${battleToDelete?._id || id}` || 'Battle';
            await deleteBattle(id);
            break;
          default:
            break;
        }
        showToast(`${itemName} deleted successfully!`);
      } catch (error) {
        showToast(`Error deleting ${itemName}: ${error.message}`);
      }
    }
  };

  const handleApproval = async (id, status, type) => {
    try {
      const submission = (bulkSubmissions || []).find(sub => sub._id === id);
      if (submission) {
        if (status === 'approved') {
          const response = await approveBulkSubmission(id);
          showToast(`Bulk submission approved successfully`);
          // Show badge notification if new badges were earned
          if (response && response.newBadges && response.newBadges.length > 0) {
            const badgeNames = response.newBadges.map(badge => badge.name).join(', ');
            showToast(`🎉 User earned new badges: ${badgeNames}!`);
          }
          // Trigger global update to refresh all components
          window.location.reload();
        } else if (status === 'rejected') {
          await rejectBulkSubmission(id);
          showToast(`Bulk submission rejected`);
          // Trigger global update to refresh all components
          window.location.reload();
        }
      }
    } catch (error) {
      showToast(`Error ${status === 'approved' ? 'approving' : 'rejecting'} request: ${error.message}`);
    }
  };

  const handleRemoveMasteredMove = (moveName) => {
    removeMasteredMove(moveName);
    showToast(`Removed ${moveName} from mastered moves`);
  };

  // Newsletter state (fixed hooks order; hooks declared at top-level, not inside render function)
  const [newsletterSignups, setNewsletterSignups] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const fetchNewsletter = async () => {
    try {
      setNewsletterLoading(true);
      setNewsletterError('');
      const res = await newsletterAPI.list(searchTerms.newsletter);
      setNewsletterSignups(res.signups || []);
    } catch (e) {
      setNewsletterError(e?.message || 'Failed to load');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleDeleteNewsletter = async (id) => {
    if (!id) return;
    if (!window.confirm('Remove this email from the newsletter list?')) return;
    try {
      await newsletterAPI.remove(id);
      showToast('Signup removed');
      fetchNewsletter();
    } catch (e) {
      showToast(e?.message || 'Failed to remove signup');
    }
  };

  useEffect(() => {
    if (activeTab === 'newsletter') {
      fetchNewsletter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchTerms.newsletter]);

  const renderNewsletterTab = () => {
    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Newsletter Signups</h2>
          <div className="header-actions">
            <div className="users-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search email..."
                value={searchTerms.newsletter}
                onChange={(e) => setSearchTerms((p) => ({ ...p, newsletter: e.target.value }))}
                className="admin-users-search-input"
              />
            </div>
            <button className="header-action-btn refresh-btn" onClick={fetchNewsletter}><FaSync /></button>
          </div>
        </div>

        <div className="data-list">
          {newsletterLoading && <div className="no-battles">Loading…</div>}
          {newsletterError && <div className="no-battles">{newsletterError}</div>}
          {!newsletterLoading && !newsletterError && newsletterSignups.length === 0 && (
            <div className="no-battles">No signups yet.</div>
          )}
          {newsletterSignups.map((s, idx) => (
            <div key={`${s._id || s.email}-${idx}`} className="data-list-item">
              <div className="card-header">
                <h3>{s.email}</h3>
                <div className="card-actions">
                  <button className="delete-btn" onClick={() => handleDeleteNewsletter(s._id)} title="Remove">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="card-content">
                <p><strong>Signed up:</strong> {s.createdAt ? new Date(s.createdAt).toLocaleString() : 'Unknown'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMovesTab = () => {
    const formRefs = {};
    
    if (movesLoading) {
      return (
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading moves...</p>
          </div>
        </div>
      );
    }

    if (movesError) {
      return (
        <div className="admin-content">
          <div className="error-container">
            <p>Error loading moves: {movesError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      );
    }
    
    // Filter moves based on search term
    const filteredMoves = movesData.filter(move =>
      move.name.toLowerCase().includes(searchTerms.moves.toLowerCase()) ||
      move.category.toLowerCase().includes(searchTerms.moves.toLowerCase()) ||
      move.level.toLowerCase().includes(searchTerms.moves.toLowerCase())
    );
    
    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Moves Management</h2>
          <div className="header-actions">
            <div className="moves-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search moves..."
                value={searchTerms.moves}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, moves: e.target.value }))}
                className="admin-moves-search-input"
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaTh />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>
            <button className="header-action-btn add-btn" onClick={() => navigate(`/admin/add-move?tab=${activeTab}`)}>
              <FaPlus />
            </button>
            <button className="header-action-btn refresh-btn" onClick={() => refetchMoves()}>
              <FaSync />
            </button>
          </div>
        </div>
                  <div className={`data-container ${viewMode === 'list' ? 'data-list' : 'data-grid'}`}>
            {filteredMoves.map((move) => (
            <div key={move._id} className={`data-card ${viewMode === 'list' ? 'data-list-item' : ''} ${editingItem && editingItem._id === move._id && editingItem.type === 'moves' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>{move.name}</h3>
                <div className="card-actions">
                  {editingItem && editingItem._id === move._id && editingItem.type === 'moves' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[move._id]) {
                          // Manually trigger the form submission
                          const form = formRefs[move._id];
                          if (form) {
                            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                            form.dispatchEvent(submitEvent);
                          }
                        }
                      }} className="save-btn">
                        <FaSave />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(move, 'moves')} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(move._id, 'moves')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem._id === move._id && editingItem.type === 'moves' ? (
                  <EditMoveForm
                    move={move}
                    onSave={(updatedMove) => {
                      handleSave(updatedMove);
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => {
                      if (ref) {
                        formRefs[move._id] = ref;
                      }
                    }}
                  />
                ) : (
                  <>
                    <p><strong>Category:</strong> {move.category}</p>
                    <p><strong>Level:</strong> {move.level}</p>
                    <p><strong>XP:</strong> {move.xp}</p>
                    <p><strong>Recommendations:</strong> {move.recommendations ? move.recommendations.map(rec => rec.name || rec).join(', ') : 'None'}</p>
                    {move.videoUrl && (
                      <p>
                        <a href={move.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                          Watch Video
                        </a>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBadgesTab = () => {
    const formRefs = {};
    // Filter badges based on search term
    const filteredBadges = badgesData.filter(badge =>
      badge.name.toLowerCase().includes(searchTerms.badges.toLowerCase()) ||
      badge.category.toLowerCase().includes(searchTerms.badges.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerms.badges.toLowerCase())
    );

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Badges Management</h2>
          <div className="header-actions">
            <div className="badges-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerms.badges}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, badges: e.target.value }))}
                className="admin-badges-search-input"
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaTh />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>
            <button className="header-action-btn add-btn" onClick={() => navigate(`/admin/add-badge?tab=${activeTab}`)}>
              <FaPlus />
            </button>
            <button className="header-action-btn refresh-btn" onClick={() => refetchBadges()}>
              <FaSync />
            </button>
          </div>
        </div>
        <div className={`data-container ${viewMode === 'list' ? 'data-list' : 'data-grid'}`}>
          {filteredBadges.map((badge) => (
            <div key={badge._id} className={`data-card ${viewMode === 'list' ? 'data-list-item' : ''} ${editingItem && editingItem._id === badge._id && editingItem.type === 'badges' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>{badge.name}</h3>
                <div className="card-actions">
                  {editingItem && editingItem._id === badge._id && editingItem.type === 'badges' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[badge._id]) {
                          const form = formRefs[badge._id];
                          if (form) {
                            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                            form.dispatchEvent(submitEvent);
                          }
                        }
                      }} className="save-btn">
                        <FaSave />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(badge, 'badges')} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(badge._id, 'badges')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem._id === badge._id && editingItem.type === 'badges' ? (
                  <EditBadgeForm
                    badge={badge}
                    moves={moves}
                    onSave={(updatedBadge) => {
                      handleSave(updatedBadge);
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => {
                      if (ref) {
                        formRefs[badge._id] = ref;
                      }
                    }}
                  />
                ) : (
                  <>
                    <p><strong>Category:</strong> {badge.category}</p>
                    <p><strong>Description:</strong> {badge.description}</p>
                    <p><strong>Requirement:</strong> {badge.requirement || 'None'}</p>
                    {badge.image && (
                      <div className="badge-image-preview">
                        <img src={badge.image.startsWith('/uploads/') ? `http://localhost:5000${badge.image}` : badge.image} alt={badge.name} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEventsTab = () => {
    const formRefs = {};
    
    // Filter events based on search term and Danish detection
    const filteredEvents = eventsData.filter(event => {
      const searchMatch = event.title.toLowerCase().includes(searchTerms.events.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerms.events.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerms.events.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerms.events.toLowerCase());
      
      if (eventsSubTab === 'and8') {
        // Show international events that are NOT Danish
        return searchMatch && event.eventType === 'international' && !isDanishEvent(event);
      } else {
        // Show Danish events (either national type OR international events that are Danish)
        return searchMatch && (event.eventType === 'national' || (event.eventType === 'international' && isDanishEvent(event)));
      }
    });

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Events Management</h2>
          <div className="header-actions">
            <div className="events-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerms.events}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, events: e.target.value }))}
                className="admin-events-search-input"
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaTh />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>
            {eventsSubTab === 'danish' && (
              <button className="header-action-btn add-btn" onClick={() => navigate(`/admin/add-event?tab=${activeTab}`)}>
                <FaPlus />
              </button>
            )}
            <button className="header-action-btn refresh-btn" onClick={() => refetchEvents()}>
              <FaSync />
            </button>
          </div>
        </div>

        {/* Events Sub-tabs */}
        <div className="events-sub-tabs">
          <button 
            className={`sub-tab-btn ${eventsSubTab === 'and8' ? 'active' : ''}`}
            onClick={() => setEventsSubTab('and8')}
          >
            <FaGlobe /> And8 International Events ({eventsData.filter(e => e.eventType === 'international' && !isDanishEvent(e)).length})
          </button>
          <button 
            className={`sub-tab-btn ${eventsSubTab === 'danish' ? 'active' : ''}`}
            onClick={() => setEventsSubTab('danish')}
          >
            <FaFlag /> Danish Events ({eventsData.filter(e => e.eventType === 'national' || (e.eventType === 'international' && isDanishEvent(e))).length})
          </button>
        </div>

        {/* And8 Events Section */}
        {eventsSubTab === 'and8' && (
          <div className="events-section">
            <div className={`data-container ${viewMode === 'list' ? 'data-list' : 'data-grid'}`} data-container="events">
              {filteredEvents.map((event) => (
                <div key={event._id} className={`data-card international-event ${viewMode === 'list' ? 'data-list-item' : ''} ${editingItem && editingItem._id === event._id && editingItem.type === 'events' ? 'editing' : ''}`} data-card="event">
                  <div className="card-header">
                    <h3>{event.title}</h3>
                    <div className="card-actions">
                      {editingItem && editingItem._id === event._id && editingItem.type === 'events' ? (
                        <>
                          <button onClick={() => setEditingItem(null)} className="cancel-btn">
                            <FaTimes />
                          </button>
                          <button onClick={(e) => {
                            e.preventDefault();
                            if (formRefs[event._id]) {
                              const form = formRefs[event._id];
                              if (form) {
                                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                                form.dispatchEvent(submitEvent);
                              }
                            }
                          }} className="save-btn">
                            <FaSave />
                          </button>
                        </>
                      ) : (
                                <>
          <button onClick={() => handleEdit(event, 'events')} className="edit-btn">
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(event._id, 'events')} className="delete-btn">
            <FaTrash />
          </button>
        </>
                      )}
                    </div>
                  </div>
                  <div className="card-content">
                    {editingItem && editingItem._id === event._id && editingItem.type === 'events' ? (
                      <EditEventForm
                        event={event}
                        onSave={(updatedEvent) => {
                          handleSave(updatedEvent);
                          setEditingItem(null);
                        }}
                        onCancel={() => setEditingItem(null)}
                        formRef={(ref) => {
                          if (ref) {
                            formRefs[event._id] = ref;
                          }
                        }}
                      />
                    ) : (
                      <>
                        <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Date TBA'}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Category:</strong> {event.category}</p>
                        <p><strong>Organizer:</strong> {event.organizer}</p>
                        <p><strong>Website:</strong> <a href={event.website} target="_blank" rel="noopener noreferrer">Visit Site</a></p>
                        {event.endDate && (
                          <p><strong>End Date:</strong> {new Date(event.endDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danish Events Section */}
        {eventsSubTab === 'danish' && (
          <div className="events-section">
            <div className={`data-container ${viewMode === 'list' ? 'data-list' : 'data-grid'}`} data-container="events">
              {filteredEvents.map((event) => (
                <div key={event._id} className={`data-card national-event ${viewMode === 'list' ? 'data-list-item' : ''} ${editingItem && editingItem._id === event._id && editingItem.type === 'events' ? 'editing' : ''}`} data-card="event">
                  <div className="card-header">
                    <h3>{event.title}</h3>
                    <div className="card-actions">
                      {editingItem && editingItem._id === event._id && editingItem.type === 'events' ? (
                        <>
                          <button onClick={() => setEditingItem(null)} className="cancel-btn">
                            <FaTimes />
                          </button>
                          <button onClick={(e) => {
                            e.preventDefault();
                            if (formRefs[event._id]) {
                              const form = formRefs[event._id];
                              if (form) {
                                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                                form.dispatchEvent(submitEvent);
                              }
                            }
                          }} className="save-btn">
                            <FaSave />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(event, 'events')} className="edit-btn">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(event._id, 'events')} className="delete-btn">
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="card-content">
                    {editingItem && editingItem._id === event._id && editingItem.type === 'events' ? (
                      <EditEventForm
                        event={event}
                        onSave={(updatedEvent) => {
                          handleSave(updatedEvent);
                          setEditingItem(null);
                        }}
                        onCancel={() => setEditingItem(null)}
                        formRef={(ref) => {
                          if (ref) {
                            formRefs[event._id] = ref;
                          }
                        }}
                      />
                    ) : (
                      <>
                        <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Date TBA'}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Category:</strong> {event.category}</p>
                        <p><strong>Status:</strong> {event.status}</p>
                        <p><strong>Organizer:</strong> {event.organizer}</p>
                        {event.battleFormat && (
                          <p><strong>Battle Format:</strong> {event.battleFormat}</p>
                        )}
                        {event.image && (
                          <div className="event-banner-preview">
                            <img src={event.image} alt={event.title} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };



  const renderUsersTab = () => {
    const formRefs = {};
    
    if (usersLoading) {
      return (
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      );
    }

    if (usersError) {
      return (
        <div className="admin-content">
          <div className="error-container">
            <p>Error loading users: {usersError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      );
    }
    
    // Filter users based on search term and roles
    const filteredUsers = users.filter(user => {
      const searchTerm = searchTerms.users.toLowerCase();
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.status.toLowerCase().includes(searchTerm) ||
        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
        (user.roles && user.roles.some(role => role.toLowerCase().includes(searchTerm)));
      
      return matchesSearch;
    });

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Users Management</h2>
          <div className="header-actions">
            <div className="users-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users, roles, or status..."
                value={searchTerms.users}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, users: e.target.value }))}
                className="admin-users-search-input"
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaTh />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>
            <button className="header-action-btn add-btn" onClick={() => navigate(`/admin/add-user?tab=${activeTab}`)}>
              <FaPlus />
            </button>
            <button className="header-action-btn refresh-btn" onClick={() => refetchUsers()}>
              <FaSync />
            </button>
          </div>
        </div>
        <div className={`data-container ${viewMode === 'list' ? 'data-list' : 'data-grid'}`} data-container="users">
          {filteredUsers.map((user) => (
            <div key={user._id} className={`data-card ${viewMode === 'list' ? 'data-list-item' : ''} ${editingItem && editingItem._id === user._id && editingItem.type === 'users' ? 'editing' : ''}`} data-card="user">
              <div className="card-header">
                <h3>{user.username}</h3>
                <div className="card-actions">
                  {editingItem && editingItem._id === user._id && editingItem.type === 'users' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[user._id]) {
                          const form = formRefs[user._id];
                          if (form) {
                            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                            form.dispatchEvent(submitEvent);
                          }
                        }
                      }} className="save-btn">
                        <FaSave />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user, 'users')} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(user._id, 'users')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem._id === user._id && editingItem.type === 'users' ? (
                  <EditUserForm
                    user={user}
                    onSave={(updatedUser) => {
                      handleSave(updatedUser);
                      setEditingItem(null);
                    }}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => {
                      if (ref) {
                        formRefs[user._id] = ref;
                      }
                    }}
                    moves={moves}
                  />
                ) : (
                  <>
                    <p><strong>Name:</strong> {user.name || 'Not specified'}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.profileImage && (
                      <p><strong>Profile:</strong> <img src={user.profileImage} alt="profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle' }} /></p>
                    )}
                    {user.coverImage && (
                      <p><strong>Cover:</strong> <img src={user.coverImage} alt="cover" style={{ width: '72px', height: '36px', objectFit: 'cover', borderRadius: '4px', verticalAlign: 'middle' }} /></p>
                    )}
                    {user.bio && (
                      <p><strong>Bio:</strong> {user.bio}</p>
                    )}
                    <p><strong>Password:</strong> {user.password ? '••••••••' : 'No password set'}</p>
                    <p><strong>Level:</strong> {user.level}</p>
                    <p><strong>XP:</strong> {user.xp}</p>
                    <p><strong>Status:</strong> <span className={`status-${user.status}`}>{user.status}</span></p>
                    <p><strong>Roles:</strong> 
                      {user.roles && user.roles.length > 0 ? (
                        <span className="user-roles">
                          {user.roles.map(role => (
                            <span key={role} className={`role-badge role-${role}`}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="no-roles">No roles assigned</span>
                      )}
                    </p>
                    {user.roles && user.roles.includes('student') && user.instructor && (
                      <p><strong>Instructor:</strong> 
                        <span className="instructor-info">
                          {user.instructor.name || user.instructor.username || 'Unknown Instructor'}
                        </span>
                      </p>
                    )}
                    {user.roles && user.roles.includes('instructor') && (
                      <p><strong>Students:</strong> 
                        <span className="students-count">
                          {user.students ? user.students.length : 0} assigned
                        </span>
                      </p>
                    )}
                    <p><strong>Mastered Moves:</strong> {user.masteredMoves && user.masteredMoves.length > 0 ? user.masteredMoves.length + ' moves' : 'None'}</p>
                    <p><strong>Pending Moves:</strong> {user.pendingMoves && user.pendingMoves.length > 0 ? user.pendingMoves.length + ' moves' : 'None'}</p>
                    <p><strong>Battle Videos:</strong> {user.battleVideos && user.battleVideos.length > 0 ? user.battleVideos.length + ' videos' : 'None'}</p>
                    <p><strong>Badges:</strong> {user.badges && user.badges.length > 0 ? user.badges.length + ' badges' : 'None'}</p>
                    
                    {/* Battle Statistics */}
                    <div className="battle-stats-section">
                      <h4>Battle Statistics</h4>
                      <div className="battle-stats-grid">
                        <div className="battle-stat">
                          <span className="stat-label">Battle Level:</span>
                          <span className="stat-value">{user.battleLevel || 1}</span>
                        </div>
                        <div className="battle-stat">
                          <span className="stat-label">Battle XP:</span>
                          <span className="stat-value">{user.battleXP || 0}</span>
                        </div>
                        <div className="battle-stat">
                          <span className="stat-label">Battles Won:</span>
                          <span className="stat-value won">{user.battleWins || 0}</span>
                        </div>
                        <div className="battle-stat">
                          <span className="stat-label">Battles Lost:</span>
                          <span className="stat-value lost">{user.battleLosses || 0}</span>
                        </div>
                        <div className="battle-stat">
                          <span className="stat-label">Battles Participated:</span>
                          <span className="stat-value">{user.battlesParticipated || 0}</span>
                        </div>
                        <div className="battle-stat">
                          <span className="stat-label">Win Rate:</span>
                          <span className="stat-value">
                            {user.battlesParticipated > 0 
                              ? `${Math.round((user.battleWins || 0) / user.battlesParticipated * 100)}%`
                              : '0%'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApprovalsTab = () => {
    if (bulkSubmissionsLoading) {
      return (
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading approval requests...</p>
          </div>
        </div>
      );
    }

    if (bulkSubmissionsError) {
      return (
        <div className="admin-content">
          <div className="error-container">
            <p>Error loading approval requests: {bulkSubmissionsError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      );
    }

    console.log('Bulk submissions data:', bulkSubmissions);
    console.log('Bulk submissions length:', bulkSubmissions?.length);

    // Convert bulk submissions to approval requests format
    const allBulkApprovals = (bulkSubmissions || []).map((submission) => ({
      id: submission._id,
      type: 'bulk',
      userId: submission.userId._id,
      userName: submission.userId.name || submission.userId.username,
      userLevel: submission.userId.level,
      moves: submission.moves,
      requestDate: new Date(submission.submittedAt).toLocaleDateString(),
      status: submission.status,
      videoUrl: submission.videoUrl,
      description: `Bulk submission for ${submission.moves.length} move(s): ${submission.moves.map(m => m.name).join(', ')}`,
      totalXP: submission.moves.reduce((sum, move) => sum + move.xp, 0),
      reviewedAt: submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleDateString() : null,
      adminNotes: submission.adminNotes || null
    }));

    // Filter based on sub-tab selection
    const bulkApprovals = approvalsSubTab === 'pending' 
      ? allBulkApprovals.filter(submission => submission.status === 'pending')
      : allBulkApprovals;

    console.log('Bulk approvals after filtering:', bulkApprovals);
    console.log('Bulk approvals length:', bulkApprovals.length);

    const filteredApprovals = bulkApprovals.filter(request =>
      request.userName.toLowerCase().includes(searchTerms.approvals.toLowerCase()) ||
      request.moves.some(move => move.name.toLowerCase().includes(searchTerms.approvals.toLowerCase()))
    );
    
    console.log('Filtered approvals:', filteredApprovals);
    console.log('Filtered approvals length:', filteredApprovals.length);
    
    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Approval Requests</h2>
          <div className="header-actions">
            <div className="approvals-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerms.approvals}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, approvals: e.target.value }))}
                className="admin-approvals-search-input"
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaTh />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>
            <button className="header-action-btn refresh-btn" onClick={() => {
              // Refresh bulk submissions
              window.location.reload();
            }}>
              <FaSync />
            </button>
          </div>
        </div>

        {/* Sub-tabs for approvals */}
        <div className="sub-tabs">
          <button 
            className={`sub-tab ${approvalsSubTab === 'pending' ? 'active' : ''}`}
            onClick={() => setApprovalsSubTab('pending')}
          >
            Pending Requests ({allBulkApprovals.filter(s => s.status === 'pending').length})
          </button>
          <button 
            className={`sub-tab ${approvalsSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setApprovalsSubTab('all')}
          >
            All Submissions ({allBulkApprovals.length})
          </button>
        </div>
        
        {filteredApprovals.length === 0 ? (
          <div className="no-requests">
            <p>
              {approvalsSubTab === 'pending' 
                ? 'No pending approval requests.' 
                : 'No submissions found.'
              }
            </p>
            <p>Debug info: {bulkSubmissions?.length || 0} total submissions, {bulkApprovals.length} {approvalsSubTab === 'pending' ? 'pending' : 'displayed'}</p>
          </div>
        ) : (
          <div className={`data-grid ${viewMode === 'list' ? 'list-view' : ''}`} data-container="approvals">
            {filteredApprovals.map((request) => (
              <div key={request.id} className="data-card" data-card="approval">
                <div className="card-header">
                  <h3>
                    {request.type === 'individual' ? request.moveName : `Bulk Submission (${request.moves.length} moves)`}
                  </h3>
                  <div className="card-actions">
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApproval(request.id, 'approved', request.type)} 
                          className="approve-btn"
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </button>
                        <button 
                          onClick={() => handleApproval(request.id, 'rejected', request.type)} 
                          className="reject-btn"
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}
                    {request.status !== 'pending' && (
                      <span className={`status-badge status-${request.status}`}>
                        {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-content">
                  <p><strong>User:</strong> {request.userName} (Level {request.userLevel})</p>
                  {request.type === 'individual' ? (
                    <>
                      <p><strong>Move:</strong> {request.moveName} - {request.moveCategory} ({request.moveLevel})</p>
                      <p><strong>XP:</strong> {request.moveXP}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Moves:</strong> {request.moves.map(m => `${m.name} (${m.level})`).join(', ')}</p>
                      <p><strong>Total XP:</strong> {request.totalXP}</p>
                    </>
                  )}
                  <p><strong>Request Date:</strong> {request.requestDate}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-${request.status}`}>
                      {request.status === 'pending' ? 'Pending' : 
                       request.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </p>
                  {request.reviewedAt && (
                    <p><strong>Reviewed:</strong> {request.reviewedAt}</p>
                  )}
                  {request.adminNotes && (
                    <p><strong>Admin Notes:</strong> {request.adminNotes}</p>
                  )}
                  <p><strong>Description:</strong> {request.description}</p>
                  {request.videoUrl && request.status === 'pending' && (
                    <p><strong>Video:</strong> <a href={request.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">Watch Video</a></p>
                  )}
                  {request.videoUrl && request.status !== 'pending' && (
                    <p><strong>Video:</strong> <span className="video-deleted">Deleted after {request.status}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCurrentUserTab = () => {
    const { masteredMoves } = useProfile();
    
    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Current User - Mastered Moves Management</h2>
          <div className="header-actions">
            <div className="mastered-moves-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search mastered moves..."
                value={searchTerms.moves}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, moves: e.target.value }))}
                className="admin-mastered-moves-search-input"
              />
            </div>
            <button className="header-action-btn refresh-btn" onClick={() => window.location.reload()}>
              <FaSync />
            </button>
          </div>
        </div>
        
        {masteredMoves.length === 0 ? (
          <div className="no-requests">
            <p>No mastered moves found.</p>
          </div>
        ) : (
          <div className="data-grid">
            {masteredMoves
              .filter(move => 
                move.name.toLowerCase().includes(searchTerms.moves.toLowerCase()) ||
                move.category.toLowerCase().includes(searchTerms.moves.toLowerCase())
              )
              .map((move) => (
                <div key={move.name} className="data-card">
                  <div className="card-header">
                    <h3>{move.name}</h3>
                    <div className="card-actions">
                      <button 
                        onClick={() => handleRemoveMasteredMove(move.name)} 
                        className="delete-btn"
                        title="Remove from mastered moves"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <p><strong>Category:</strong> {move.category}</p>
                    <p><strong>Level:</strong> {move.level}</p>
                    <p><strong>XP:</strong> {move.xp}</p>
                    <p><strong>Description:</strong> {move.description || 'No description available'}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  const renderBattlesTab = () => {
    if (battlesLoading) {
      return (
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading battles...</p>
          </div>
        </div>
      );
    }

    if (battlesError) {
      return (
        <div className="admin-content">
          <div className="error-container">
            <p>Error loading battles: {battlesError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      );
    }

    // Filter battles based on sub-tab and search term
    const filteredBattles = battlesData.filter(battle => {
      const searchMatch = 
        (battle.challenger?.name || '').toLowerCase().includes(searchTerms.battles.toLowerCase()) ||
        (battle.opponent?.name || '').toLowerCase().includes(searchTerms.battles.toLowerCase()) ||
        (battle.category || '').toLowerCase().includes(searchTerms.battles.toLowerCase()) ||
        (battle.description || '').toLowerCase().includes(searchTerms.battles.toLowerCase());

      if (battlesSubTab === 'all') {
        return searchMatch;
      } else {
        return searchMatch && battle.status === battlesSubTab;
      }
    });

    // Count battles by status
    const battleCounts = {
      all: battlesData.length,
      pending: battlesData.filter(b => b.status === 'pending').length,
      'in progress': battlesData.filter(b => b.status === 'in progress').length,
      completed: battlesData.filter(b => b.status === 'completed').length,
      judged: battlesData.filter(b => b.status === 'judged').length
    };

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Battles Management</h2>
          <div className="header-actions">
            <div className="battles-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search battles..."
                value={searchTerms.battles}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, battles: e.target.value }))}
                className="admin-battles-search-input"
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card View"
              >
                <FaTh />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>
            <button className="header-action-btn refresh-btn" onClick={() => refreshBattles()}>
              <FaSync />
            </button>
          </div>
        </div>

        {/* Battles Sub-tabs */}
        <div className="battles-sub-tabs">
          <button 
            className={`sub-tab-btn ${battlesSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setBattlesSubTab('all')}
          >
            <FaEye /> All Battles ({battleCounts.all})
          </button>
          <button 
            className={`sub-tab-btn ${battlesSubTab === 'pending' ? 'active' : ''}`}
            onClick={() => setBattlesSubTab('pending')}
          >
            <FaClock /> Pending ({battleCounts.pending})
          </button>

          <button 
                            className={`sub-tab-btn ${battlesSubTab === 'in progress' ? 'active' : ''}`}
                onClick={() => setBattlesSubTab('in progress')}
          >
                          <FaVideo /> In Progress ({battleCounts['in progress']})
          </button>
          <button 
            className={`sub-tab-btn ${battlesSubTab === 'completed' ? 'active' : ''}`}
            onClick={() => setBattlesSubTab('completed')}
          >
            <FaUpload /> Completed ({battleCounts.completed})
          </button>
          <button 
            className={`sub-tab-btn ${battlesSubTab === 'judged' ? 'active' : ''}`}
            onClick={() => setBattlesSubTab('judged')}
          >
            <FaTrophy /> Judged ({battleCounts.judged})
          </button>
        </div>

        <div className={`data-container ${viewMode === 'list' ? 'data-list' : 'data-grid'}`}>
          {filteredBattles.map((battle) => (
            <div key={battle._id} className={`data-card battle-card ${viewMode === 'list' ? 'data-list-item' : ''} ${editingItem && editingItem._id === battle._id && editingItem.type === 'battles' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>Battle #{battle._id.slice(-6)}</h3>
                <div className="card-actions">
                  {editingItem && editingItem._id === battle._id && editingItem.type === 'battles' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={() => handleSave(editingItem)} className="save-btn">
                        <FaSave />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(battle, 'battles')} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(battle._id, 'battles')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                <div className="battle-participants">
                  <div className="participant challenger">
                    <strong>{battle.challenger?.name || 'Unknown'}</strong>
                    <span className="participant-level">Level {battle.challenger?.level || 'N/A'}</span>
                  </div>
                  <div className="vs-divider">VS</div>
                  <div className="participant opponent">
                    <strong>{battle.opponent?.name || 'Unknown'}</strong>
                    <span className="participant-level">Level {battle.opponent?.level || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="battle-details">
                  <p><strong>Category:</strong> {battle.category || 'Breaking Battle'}</p>
                  <p><strong>Status:</strong> 
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(battle.status) }}
                    >
                      {getStatusText(battle.status)}
                    </span>
                  </p>
                  <p><strong>Visibility:</strong> <span className={`visibility-badge visibility-${(battle.visibility || 'public').toLowerCase()}`}>{(battle.visibility || 'public').charAt(0).toUpperCase() + (battle.visibility || 'public').slice(1)}</span></p>
                  {battle.description && (
                    <p><strong>Description:</strong> {battle.description}</p>
                  )}
                  {battle.stakes && (
                    <p><strong>Stakes:</strong> {battle.stakes}</p>
                  )}
                  <p><strong>Created:</strong> {new Date(battle.createdAt || Date.now()).toLocaleDateString()}</p>
                  
                  {/* Video Status */}
                  <div className="video-status">
                    <p><strong>Videos:</strong></p>
                    <div className="video-status-grid">
                      <div className="video-status-item">
                        <span className="video-label">Challenger:</span>
                        <span className={`video-status ${battle.videos?.challenger ? 'uploaded' : 'pending'}`}>
                          {battle.videos?.challenger ? '✓ Uploaded' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="video-status-item">
                        <span className="video-label">Opponent:</span>
                        <span className={`video-status ${battle.videos?.opponent ? 'uploaded' : 'pending'}`}>
                          {battle.videos?.opponent ? '✓ Uploaded' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Judge Votes Debug Info */}
                  {battle.status === 'completed' && (
                    <div className="battle-votes-debug">
                      <p><strong>Judge Votes:</strong></p>
                      <div className="votes-info">
                        <p>Total Votes: {battle.votes?.length || 0}</p>
                        {battle.votes && battle.votes.length > 0 && (
                          <div className="votes-list">
                            {battle.votes.map((vote, index) => (
                              <div key={index} className="vote-item">
                                <span>Category: {vote.category}</span>
                                <span>Judge: {vote.judgeId}</span>
                                <span>Scores: {vote.scoreA} vs {vote.scoreB}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p>Required Categories: Foundation, Originality, Execution, Dynamics, Battle</p>
                        <p>Voted Categories: {battle.votes?.map(v => v.category).join(', ') || 'None'}</p>
                      </div>
                    </div>
                  )}

                  {/* Battle Result */}
                  {battle.status === 'judged' && battle.adminReview && (
                    <div className="battle-result">
                      <p><strong>Winner:</strong> {battle.adminReview.winner}</p>
                      {battle.adminReview.score && (
                        <p><strong>Score:</strong> {battle.adminReview.score}</p>
                      )}
                      {battle.adminReview.comments && (
                        <p><strong>Comments:</strong> {battle.adminReview.comments}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBattles.length === 0 && (
          <div className="no-battles">
            <p>No battles found for the selected criteria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`admin-page ${editingItem ? 'editing-mode' : ''}`}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'moves' ? 'active' : ''}`}
            onClick={() => handleTabChange('moves')}
          >
            <FaDumbbell /> Moves
          </button>
          <button 
            className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => handleTabChange('badges')}
          >
            <FaTrophy /> Badges
          </button>
          <button 
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => handleTabChange('events')}
          >
            <FaCalendar /> Events
          </button>

          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <FaUserEdit /> Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'battles' ? 'active' : ''}`}
            onClick={() => handleTabChange('battles')}
          >
            <FaCrosshairs /> Battles
          </button>
          <button 
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => handleTabChange('approvals')}
          >
            <FaClipboardCheck /> Approvals
          </button>

          <button 
            className={`nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => handleTabChange('newsletter')}
          >
            <FaEnvelopeOpenText /> Newsletter
          </button>

        </nav>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${editingItem ? 'editing-mode' : ''}`}>
        {activeTab === 'moves' && renderMovesTab()}
        {activeTab === 'badges' && renderBadgesTab()}
        {activeTab === 'events' && renderEventsTab()}

        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'battles' && renderBattlesTab()}
        {activeTab === 'approvals' && renderApprovalsTab()}
        {activeTab === 'newsletter' && renderNewsletterTab()}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={hideToast} 
        />
      )}
    </div>
  );
}