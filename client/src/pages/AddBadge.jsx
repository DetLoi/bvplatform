import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/pages/add-form.css';

export default function AddBadge() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'badges';
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Toprock',
    requirement: '',
    image: '🏆'
  });

  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns', 'Level'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a unique ID (in a real app, this would come from the backend)
    const newBadge = {
      id: `badge-${Date.now()}`,
      ...formData,
      unlock: (masteredMoves) => {
        // Default unlock function - would be customized based on badge type
        return masteredMoves.length >= 5;
      }
    };

    // Here you would typically save to your data store
    console.log('New badge:', newBadge);
    
    // Navigate back to admin with success message
    navigate(`/admin?tab=${currentTab}&message=Badge added successfully!`);
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

          <div className="form-group">
            <label htmlFor="requirement">Requirement *</label>
            <textarea
              id="requirement"
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              required
              placeholder="Enter badge requirement (e.g., Complete all Toprock moves)"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Badge Icon/Emoji *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="🏆 or image URL"
              className="form-input"
            />
            <small className="form-help">Enter an emoji (🏆) or image URL</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-btn">
              <FaSave /> Save Badge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 