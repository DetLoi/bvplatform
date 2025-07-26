import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaSearch, FaPlus, FaTimes as FaTimesIcon, FaUpload, FaImage } from 'react-icons/fa';
import { useBadges } from '../hooks/useBadges';
import { useMoves } from '../hooks/useMoves';
import '../styles/pages/add-form.css';

export default function AddBadge() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'badges';
  const { createBadge, loading, error } = useBadges({ skipInitialFetch: true });
  const { moves: existingMoves } = useMoves({ skipInitialFetch: false });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    requirement: '',
    image: null,
    imagePreview: null
  });

  // State for requirements dropdown
  const [showRequirementsDropdown, setShowRequirementsDropdown] = useState(false);
  const [requirementsSearch, setRequirementsSearch] = useState('');
  const [requirementsCategoryFilter, setRequirementsCategoryFilter] = useState('');
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  
  // State for category dropdown
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [customCategories, setCustomCategories] = useState([]);
  
  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Default categories + custom ones
  const defaultCategories = ['Level', 'Element', 'Power'];
  const allCategories = [...defaultCategories, ...customCategories];

  // Filter existing moves for requirements dropdown
  const filteredMoves = existingMoves.filter(move => {
    const matchesName = move.name.toLowerCase().includes(requirementsSearch.toLowerCase());
    const matchesCategory = !requirementsCategoryFilter || 
      move.category.toLowerCase().includes(requirementsCategoryFilter.toLowerCase());
    const notSelected = !selectedRequirements.includes(move.name);
    
    return matchesName && matchesCategory && notSelected;
  });

  // Get unique categories from existing moves for the category filter
  const availableCategories = [...new Set(existingMoves.map(move => move.category))].sort();

  // Filter categories for dropdown
  const filteredCategories = allCategories.filter(category => 
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRequirementsDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showRequirementsDropdown || showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRequirementsDropdown, showCategoryDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategorySearch(value);
    // Only update formData.category if it's a complete match with an existing category
    if (allCategories.includes(value)) {
      setFormData(prev => ({
        ...prev,
        category: value
      }));
    } else {
      // Clear the formData category if it's not a complete match
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newCategory = categorySearch.trim();
      
      if (newCategory && !allCategories.includes(newCategory)) {
        // Add new custom category
        setCustomCategories(prev => [...prev, newCategory]);
        setFormData(prev => ({
          ...prev,
          category: newCategory
        }));
        setCategorySearch(newCategory); // Show the new category in the input
        setShowCategoryDropdown(false);
      } else if (filteredCategories.length > 0) {
        // Select first filtered category
        const selectedCategory = filteredCategories[0];
        setFormData(prev => ({
          ...prev,
          category: selectedCategory
        }));
        setCategorySearch(selectedCategory); // Show the selected category in the input
        setShowCategoryDropdown(false);
      }
    }
  };

  const handleSelectCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category
    }));
    setCategorySearch(category); // Show the selected category in the input
    setShowCategoryDropdown(false);
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

      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('requirements', JSON.stringify(selectedRequirements));
      
      if (formData.image) {
        formDataToSend.append('badgeImage', formData.image);
      }

      // Create the badge using the API
      await createBadge(formDataToSend);
      
      // Navigate back to admin with success message
      navigate(`/admin?tab=${currentTab}&message=Badge added successfully!`);
    } catch (err) {
      console.error('Error creating badge:', err);
      alert('Error creating badge: ' + err.message);
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
          <h1>Add New Badge</h1>
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-form">
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
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="dropdown-toggle"
                >
                  ▼
                </button>
              </div>
              
              {/* Category dropdown */}
              {showCategoryDropdown && (
                <div className="recommendations-dropdown">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category}
                        className="recommendation-option"
                        onClick={() => handleSelectCategory(category)}
                      >
                        <div className="move-info">
                          <span className="move-name">{category}</span>
                          {customCategories.includes(category) && (
                            <span className="move-category">Custom Category</span>
                          )}
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
                <span className="category-tag">
                  {formData.category}
                  {customCategories.includes(formData.category) && (
                    <span className="custom-badge">Custom</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements (Moves to Master) *</label>
            <div className="recommendations-container">
              {/* Selected requirements display */}
              {selectedRequirements.length > 0 && (
                <div className="selected-recommendations">
                  {selectedRequirements.map((moveName, index) => (
                    <span key={index} className="recommendation-tag">
                      {moveName}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(moveName)}
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
                    placeholder="Search for moves to require..."
                    value={requirementsSearch}
                    onChange={(e) => setRequirementsSearch(e.target.value)}
                    onFocus={() => setShowRequirementsDropdown(true)}
                    onKeyDown={handleSearchKeyDown}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRequirementsDropdown(!showRequirementsDropdown)}
                    className="dropdown-toggle"
                  >
                    ▼
                  </button>
                </div>
                
                {/* Category filter */}
                <div className="category-filter-wrapper">
                  <select
                    value={requirementsCategoryFilter}
                    onChange={(e) => setRequirementsCategoryFilter(e.target.value)}
                    className="form-select category-filter"
                    onFocus={() => setShowRequirementsDropdown(true)}
                  >
                    <option value="">All Categories</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {(requirementsSearch || requirementsCategoryFilter) && (
                    <button
                      type="button"
                      onClick={clearRequirementsFilters}
                      className="clear-filters-btn"
                      title="Clear filters"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                
                {/* Dropdown with existing moves */}
                {showRequirementsDropdown && (
                  <div className="recommendations-dropdown">
                    {filteredMoves.length > 0 ? (
                      filteredMoves.map((move) => (
                        <div
                          key={move._id}
                          className="recommendation-option"
                          onClick={() => handleAddRequirement(move.name)}
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
                        {requirementsSearch || requirementsCategoryFilter 
                          ? `No moves found matching "${requirementsSearch}"${requirementsCategoryFilter ? ` in ${requirementsCategoryFilter}` : ''}`
                          : 'Start typing to search moves or select a category'
                        }
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
                  <img 
                    src={formData.imagePreview} 
                    alt="Badge preview" 
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-image-btn"
                  >
                    <FaTimes /> Remove
                  </button>
                </div>
              ) : (
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                  <FaImage className="upload-icon" />
                  <p>Click to upload badge image</p>
                  <small>PNG, JPG up to 5MB</small>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden-file-input"
                required={!formData.imagePreview}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : 'Save Badge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 