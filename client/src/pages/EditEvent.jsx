import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useEvents } from '../hooks/useEvents';
import Toast from '../components/Toast';
import '../styles/pages/add-form.css';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTab = searchParams.get('tab') || 'events';
  
  const { fetchEventById, updateEvent } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: '',
    status: '',
    entryFee: '',
    organizer: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const categories = ['Battle', 'Workshop', 'Competition', 'Jam Session', 'Other'];
  const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const eventData = await fetchEventById(id);
        setEvent(eventData);
        setFormData({
          title: eventData.title,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          category: eventData.category,
          status: eventData.status,
          entryFee: eventData.entryFee,
          organizer: eventData.organizer,
          description: eventData.description || '',
          image: null
        });
        if (eventData.image) {
          setImagePreview(eventData.image);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id, fetchEventById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);

      formDataToSend.append('entryFee', formData.entryFee);
      formDataToSend.append('organizer', formData.organizer);
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await updateEvent(id, formDataToSend);
      
      showToast('Event updated successfully!');
      setTimeout(() => {
        navigate(`/admin?tab=${returnTab}`);
      }, 1500);
    } catch (error) {
      showToast(`Error updating event: ${error.message}`);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  if (loading) {
    return (
      <div className="add-form-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-form-container">
        <div className="error-container">
          <p>Error loading event: {error}</p>
          <button onClick={() => navigate(`/admin?tab=${returnTab}`)} className="btn-secondary">
            <FaArrowLeft /> Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-form-container">
      <div className="form-header">
        <button onClick={() => navigate(`/admin?tab=${returnTab}`)} className="btn-secondary">
          <FaArrowLeft /> Back to Admin
        </button>
        <h1>Edit Event: {event?.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
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
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
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
            <label htmlFor="time">Time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
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
              className="form-input"
            />
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
              <option value="">Select Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="entryFee">Entry Fee</label>
            <input
              type="text"
              id="entryFee"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Free, $10, etc."
            />
          </div>
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
            rows="4"
            className="form-textarea"
            placeholder="Enter event description..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Event Banner</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
            />
            <label htmlFor="image" className="image-upload-label">
              <FaUpload /> Choose Image
            </label>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Event banner preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/admin?tab=${returnTab}`)} className="btn-secondary">
            <FaTimes /> Cancel
          </button>
          <button type="submit" className="btn-primary">
            <FaSave /> Save Changes
          </button>
        </div>
      </form>

      {toast.show && (
        <Toast message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
} 