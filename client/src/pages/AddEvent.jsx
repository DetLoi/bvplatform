import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { useEvents } from '../hooks/useEvents';
import '../styles/pages/add-form.css';

export default function AddEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'events';
  const { createEvent } = useEvents();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Competition',
    status: 'upcoming',
    battleFormat: '',
    website: '',
    image: null,
    eventType: 'national', // Default to Danish events
    organizer: 'Danish Organizer' // Default organizer for Danish events
  });

  const categories = ['Competition', 'Workshop', 'Cypher', 'Battle', 'Jam'];
  const statuses = ['upcoming', 'ongoing', 'completed'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare event data for API (excluding the file object)
      const { image, ...eventDataWithoutFile } = formData;
      
      const eventData = {
        ...eventDataWithoutFile,
        eventType: 'national', // Danish events
        participants: []
      };

      // Create the event using the API
      await createEvent(eventData);
      
      // Navigate back to admin with success message
      navigate(`/admin?tab=${currentTab}&message=Event added successfully!`);
    } catch (error) {
      console.error('Error creating event:', error);
      // You could add error handling here (show toast, etc.)
      alert('Error creating event. Please try again.');
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
          <div>
            <h1>Add New Danish Event</h1>
            <p>Create a new local Danish breaking event</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
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
              placeholder="Enter event description"
              rows="4"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter event location"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizer">Organizer *</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              placeholder="Enter event organizer"
              className="form-input"
            />
          </div>

          <div className="form-row">
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
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="form-select"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="battleFormat">Battle Format</label>
              <input
                type="text"
                id="battleFormat"
                name="battleFormat"
                value={formData.battleFormat}
                onChange={handleChange}
                placeholder="e.g., 1v1, 2v2, Crew Battle"
                className="form-input"
              />
            </div>
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
            <label htmlFor="image">Event Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="form-input"
            />
            <small className="form-help">Optional: Upload an image for the event banner (JPG, PNG, GIF)</small>
            {formData.image && (
              <div className="image-preview">
                <p>Selected: {formData.image.name}</p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-btn">
              <FaSave /> Save Danish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 