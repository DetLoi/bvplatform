import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/pages/add-form.css';

export default function AddCrew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'crews';
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    founded: '',
    members: [],
    achievements: '',
    image: '',
    website: ''
  });

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
    const newCrew = {
      id: Date.now(),
      ...formData,
      members: formData.members.length > 0 ? formData.members : []
    };

    // Here you would typically save to your data store
    console.log('New crew:', newCrew);
    
    // Navigate back to admin with success message
    navigate(`/admin?tab=${currentTab}&message=Crew added successfully!`);
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
          <h1>Add New Crew</h1>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label htmlFor="name">Crew Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter crew name"
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
              placeholder="Enter crew description"
              rows="4"
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter crew location"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="founded">Founded Year</label>
              <input
                type="number"
                id="founded"
                name="founded"
                value={formData.founded}
                onChange={handleChange}
                min="1970"
                max="2030"
                placeholder="e.g., 1995"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="achievements">Achievements</label>
            <textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="Enter crew achievements and awards"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website URL</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Crew Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/crew-image.jpg"
              className="form-input"
            />
            <small className="form-help">Optional: Enter image URL for crew logo/banner</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-btn">
              <FaSave /> Save Crew
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 