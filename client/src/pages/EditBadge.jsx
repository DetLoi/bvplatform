import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useBadges } from '../hooks/useBadges';
import Toast from '../components/Toast';
import '../styles/pages/add-form.css';

export default function EditBadge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTab = searchParams.get('tab') || 'badges';
  
  const { fetchBadgeById, updateBadge } = useBadges();
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    requirement: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const categories = ['Achievement', 'Skill', 'Participation', 'Special'];

  useEffect(() => {
    const loadBadge = async () => {
      try {
        setLoading(true);
        const badgeData = await fetchBadgeById(id);
        setBadge(badgeData);
        setFormData({
          name: badgeData.name,
          category: badgeData.category,
          description: badgeData.description,
          requirement: badgeData.requirement || '',
          image: null
        });
        if (badgeData.image) {
          setImagePreview(badgeData.image);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBadge();
    }
  }, [id, fetchBadgeById]);

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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('requirement', formData.requirement);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await updateBadge(id, formDataToSend);
      
      showToast('Badge updated successfully!');
      setTimeout(() => {
        navigate(`/admin?tab=${returnTab}`);
      }, 1500);
    } catch (error) {
      showToast(`Error updating badge: ${error.message}`);
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
          <p>Loading badge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-form-container">
        <div className="error-container">
          <p>Error loading badge: {error}</p>
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
        <h1>Edit Badge: {badge?.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="form-textarea"
            placeholder="Enter badge description..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirement">Requirement</label>
          <input
            type="text"
            id="requirement"
            name="requirement"
            value={formData.requirement}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter badge requirement..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Badge Image</label>
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
              <img src={imagePreview} alt="Badge preview" />
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