import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import Toast from '../components/Toast';
import '../styles/pages/add-form.css';

export default function EditMove() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTab = searchParams.get('tab') || 'moves';
  
  const { fetchMoveById, updateMove } = useMoves();
  const [move, setMove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: '',
    xp: '',
    description: '',
    recommendations: '',
    videoUrl: ''
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled'];

  useEffect(() => {
    const loadMove = async () => {
      try {
        setLoading(true);
        const moveData = await fetchMoveById(id);
        setMove(moveData);
        setFormData({
          name: moveData.name,
          category: moveData.category,
          level: moveData.level,
          xp: moveData.xp,
          description: moveData.description || '',
          recommendations: moveData.recommendations ? moveData.recommendations.map(rec => rec.name || rec).join(', ') : '',
          videoUrl: moveData.videoUrl || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMove();
    }
  }, [id, fetchMoveById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recommendationsArray = formData.recommendations 
        ? formData.recommendations.split(',').map(item => item.trim()).filter(item => item)
        : [];
      
      await updateMove(id, {
        ...formData,
        recommendations: recommendationsArray
      });
      
      showToast('Move updated successfully!');
      setTimeout(() => {
        navigate(`/admin?tab=${returnTab}`);
      }, 1500);
    } catch (error) {
      showToast(`Error updating move: ${error.message}`);
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
          <p>Loading move...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-form-container">
        <div className="error-container">
          <p>Error loading move: {error}</p>
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
        <h1>Edit Move: {move?.name}</h1>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">Level *</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Level</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="xp">XP *</label>
            <input
              type="number"
              id="xp"
              name="xp"
              value={formData.xp}
              onChange={handleChange}
              required
              min="0"
              className="form-input"
            />
          </div>
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
            placeholder="Enter move description..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="recommendations">Recommendations</label>
          <input
            type="text"
            id="recommendations"
            name="recommendations"
            value={formData.recommendations}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter recommendations separated by commas..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="videoUrl">Video URL</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter video URL..."
          />
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