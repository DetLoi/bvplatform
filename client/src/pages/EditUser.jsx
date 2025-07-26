import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useUsers } from '../hooks/useUsers';
import { useMoves } from '../hooks/useMoves';
import Toast from '../components/Toast';
import '../styles/pages/add-form.css';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTab = searchParams.get('tab') || 'users';
  
  const { fetchUserById, updateUser } = useUsers();
  const { moves: movesData } = useMoves();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    level: '',
    xp: '',
    status: '',
    isAdmin: false,
    masteredMoves: [],
    pendingMoves: [],
    battleVideos: [],
    badges: []
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master', 'Grandmaster'];
  const statuses = ['Active', 'Inactive', 'Suspended'];

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserById(id);
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          name: userData.name || '',
          password: '', // Don't pre-fill password
          level: userData.level,
          xp: userData.xp,
          status: userData.status,
          isAdmin: userData.isAdmin || false,
          masteredMoves: userData.masteredMoves || [],
          pendingMoves: userData.pendingMoves || [],
          battleVideos: userData.battleVideos || [],
          badges: userData.badges || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id, fetchUserById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMove = (moveName) => {
    if (moveName && !formData.masteredMoves.includes(moveName)) {
      handleArrayChange('masteredMoves', [...formData.masteredMoves, moveName]);
    }
  };

  const removeMove = (moveName) => {
    handleArrayChange('masteredMoves', formData.masteredMoves.filter(move => move !== moveName));
  };

  const addPendingMove = (moveName) => {
    if (moveName && !formData.pendingMoves.includes(moveName)) {
      handleArrayChange('pendingMoves', [...formData.pendingMoves, moveName]);
    }
  };

  const removePendingMove = (moveName) => {
    handleArrayChange('pendingMoves', formData.pendingMoves.filter(move => move !== moveName));
  };

  const addBattleVideo = (videoUrl) => {
    if (videoUrl && !formData.battleVideos.includes(videoUrl)) {
      handleArrayChange('battleVideos', [...formData.battleVideos, videoUrl]);
    }
  };

  const removeBattleVideo = (videoUrl) => {
    handleArrayChange('battleVideos', formData.battleVideos.filter(video => video !== videoUrl));
  };

  const addBadge = (badgeName) => {
    if (badgeName && !formData.badges.includes(badgeName)) {
      handleArrayChange('badges', [...formData.badges, badgeName]);
    }
  };

  const removeBadge = (badgeName) => {
    handleArrayChange('badges', formData.badges.filter(badge => badge !== badgeName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = { ...formData };
      
      // Only include password if it's been changed
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateUser(id, updateData);
      
      showToast('User updated successfully!');
      setTimeout(() => {
        navigate(`/admin?tab=${returnTab}`);
      }, 1500);
    } catch (error) {
      showToast(`Error updating user: ${error.message}`);
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
          <p>Loading user...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-form-container">
        <div className="error-container">
          <p>Error loading user: {error}</p>
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
        <h1>Edit User: {user?.username}</h1>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Leave blank to keep current password"
            />
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

        <div className="form-row">
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
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                className="form-checkbox"
              />
              Admin User
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Mastered Moves</label>
          <div className="array-input-container">
            <div className="array-input">
              <input
                type="text"
                placeholder="Add mastered move..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMove(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="form-input"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  addMove(input.value);
                  input.value = '';
                }}
                className="btn-icon"
              >
                <FaPlus />
              </button>
            </div>
            <div className="array-list">
              {formData.masteredMoves.map((move, index) => (
                <div key={index} className="array-item">
                  <span>{move}</span>
                  <button
                    type="button"
                    onClick={() => removeMove(move)}
                    className="btn-icon-small"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Pending Moves</label>
          <div className="array-input-container">
            <div className="array-input">
              <input
                type="text"
                placeholder="Add pending move..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPendingMove(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="form-input"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  addPendingMove(input.value);
                  input.value = '';
                }}
                className="btn-icon"
              >
                <FaPlus />
              </button>
            </div>
            <div className="array-list">
              {formData.pendingMoves.map((move, index) => (
                <div key={index} className="array-item">
                  <span>{move}</span>
                  <button
                    type="button"
                    onClick={() => removePendingMove(move)}
                    className="btn-icon-small"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Battle Videos</label>
          <div className="array-input-container">
            <div className="array-input">
              <input
                type="url"
                placeholder="Add battle video URL..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBattleVideo(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="form-input"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  addBattleVideo(input.value);
                  input.value = '';
                }}
                className="btn-icon"
              >
                <FaPlus />
              </button>
            </div>
            <div className="array-list">
              {formData.battleVideos.map((video, index) => (
                <div key={index} className="array-item">
                  <span>{video}</span>
                  <button
                    type="button"
                    onClick={() => removeBattleVideo(video)}
                    className="btn-icon-small"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Badges</label>
          <div className="array-input-container">
            <div className="array-input">
              <input
                type="text"
                placeholder="Add badge..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBadge(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="form-input"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  addBadge(input.value);
                  input.value = '';
                }}
                className="btn-icon"
              >
                <FaPlus />
              </button>
            </div>
            <div className="array-list">
              {formData.badges.map((badge, index) => (
                <div key={index} className="array-item">
                  <span>{badge}</span>
                  <button
                    type="button"
                    onClick={() => removeBadge(badge)}
                    className="btn-icon-small"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>
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