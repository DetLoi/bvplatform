import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaTrophy, FaDumbbell, FaCalendar, FaUserEdit, FaTrash, FaPlus, FaEdit, FaSave, FaTimes, FaSearch, FaCheckCircle, FaTimesCircle, FaClipboardCheck, FaSync } from 'react-icons/fa';
import { useMoves } from '../hooks/useMoves';
import { useUsers } from '../hooks/useUsers';
import { useBadges } from '../hooks/useBadges';
import { useEvents } from '../hooks/useEvents';
import { useCrews } from '../hooks/useCrews';
import { usePendingMoves } from '../hooks/usePendingMoves';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { FaMinus } from 'react-icons/fa';
import Toast from '../components/Toast';

import '../styles/pages/admin.css';

// Edit Form Components
const EditMoveForm = ({ move, onSave, onCancel, formRef }) => {
  const [formData, setFormData] = useState({
    name: move.name,
    category: move.category,
    level: move.level,
    xp: move.xp,
    description: move.description || '',
    recommendations: move.recommendations ? move.recommendations.join(', ') : '',
    videoUrl: move.videoUrl || ''
  });

  const categories = ['Toprock', 'Footwork', 'Freezes', 'Power', 'Tricks', 'GoDowns'];
  const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recommendationsArray = formData.recommendations 
      ? formData.recommendations.split(',').map(item => item.trim()).filter(item => item)
      : [];
    onSave({ 
      ...move, 
      ...formData, 
      recommendations: recommendationsArray 
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-content">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="edit-input"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="edit-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="edit-select"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>XP</label>
            <input
              type="number"
              name="xp"
              value={formData.xp}
              onChange={handleChange}
              required
              min="10"
              max="100"
              className="edit-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="edit-textarea"
          />
        </div>
        <div className="form-group">
          <label>Recommendations (comma-separated)</label>
          <input
            type="text"
            name="recommendations"
            value={formData.recommendations}
            onChange={handleChange}
            placeholder="e.g., Knee drop, Salsa step, CC"
            className="edit-input"
          />
        </div>
        <div className="form-group">
          <label>YouTube URL</label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="edit-input"
          />
        </div>
      </div>
    </form>
  );
};

const EditBadgeForm = ({ badge, onSave, onCancel, formRef }) => {
  const [formData, setFormData] = useState({
    name: badge.name,
    description: badge.description || '',
    category: badge.category,
    requirement: badge.requirement || '',
    image: badge.image || ''
  });

  const [imagePreview, setImagePreview] = useState(badge.image || '');

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
    onSave({
      ...badge,
      ...formData,
      image: imagePreview
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-content">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="edit-textarea"
            rows="3"
            required
          />
        </div>
        <div className="form-group">
          <label>Requirement</label>
          <textarea
            name="requirement"
            value={formData.requirement}
            onChange={handleChange}
            className="edit-textarea"
            rows="2"
            placeholder="e.g., Complete all moves in Toprock category"
          />
        </div>
        <div className="form-group">
          <label>Badge Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
              id={`image-upload-${badge.id}`}
            />
            <label htmlFor={`image-upload-${badge.id}`} className="image-upload-label">
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Badge preview" />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

const EditEventForm = ({ event, onSave, onCancel, formRef }) => {
  const [formData, setFormData] = useState({
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    category: event.category,
    description: event.description || '',
    status: event.status || 'upcoming',
    featured: event.featured || false,
    registrationOpen: event.registrationOpen || true,
    maxParticipants: event.maxParticipants || 0,
    currentParticipants: event.currentParticipants || 0,
    entryFee: event.entryFee || '',
    prizes: event.prizes || '',
    organizer: event.organizer || '',
    contactEmail: event.contactEmail || '',
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
    onSave({
      ...event,
      ...formData,
      image: imagePreview
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-content">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="edit-select"
              required
            >
              <option value="Competition">Competition</option>
              <option value="Workshop">Workshop</option>
              <option value="Cypher">Cypher</option>
              <option value="Battle">Battle</option>
              <option value="Showcase">Showcase</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="edit-input"
              placeholder="e.g., March 15, 2025"
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="edit-input"
              placeholder="e.g., 18:00 - 22:00"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="edit-select"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="edit-input"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Current Participants</label>
            <input
              type="number"
              name="currentParticipants"
              value={formData.currentParticipants}
              onChange={handleChange}
              className="edit-input"
              min="0"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Entry Fee</label>
            <input
              type="text"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleChange}
              className="edit-input"
              placeholder="e.g., Free, 150 DKK"
            />
          </div>
          <div className="form-group">
            <label>Organizer</label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="edit-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="edit-textarea"
            rows="4"
            placeholder="Event description..."
          />
        </div>
        <div className="form-group">
          <label>Prizes</label>
          <input
            type="text"
            name="prizes"
            value={formData.prizes}
            onChange={handleChange}
            className="edit-input"
            placeholder="e.g., Cash prizes and trophies"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="edit-input"
              placeholder="info@event.com"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="edit-input"
              placeholder="https://event.com"
            />
          </div>
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
        <div className="form-group">
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="edit-checkbox"
              />
              Featured Event
            </label>
            <label>
              <input
                type="checkbox"
                name="registrationOpen"
                checked={formData.registrationOpen}
                onChange={handleChange}
                className="edit-checkbox"
              />
              Registration Open
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

const EditCrewForm = ({ crew, onSave, onCancel, formRef }) => {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  
  const [formData, setFormData] = useState({
    name: crew.name,
    description: crew.description || '',
    color: crew.color || '#e6c77b',
    logo: crew.logo || '',
    members: crew.members || []
  });

  const [logoPreview, setLogoPreview] = useState(crew.logo || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setLogoPreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          logo: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addMember = (user) => {
    if (!formData.members.find(member => member._id === user._id)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, user]
      }));
    }
  };

  const removeMember = (memberId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(member => member._id !== memberId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...crew,
      ...formData,
      logo: logoPreview,
      memberCount: formData.members.length
    });
  };

  // Filter out users who are already members
  const availableUsersForCrew = users.filter(user => 
    !formData.members.find(member => member._id === user._id)
  );

  if (usersLoading) {
    return <div className="loading">Loading users...</div>;
  }

  if (usersError) {
    return <div className="error">Error loading users: {usersError}</div>;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-content">
        <div className="form-row">
          <div className="form-group">
            <label>Crew Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="edit-input color-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="edit-textarea"
            rows="3"
            placeholder="Crew description..."
          />
        </div>
        <div className="form-group">
          <label>Crew Logo</label>
          <div className="image-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="image-upload-input"
              id={`logo-upload-${crew._id}`}
            />
            <label htmlFor={`logo-upload-${crew._id}`} className="image-upload-label">
              {logoPreview ? 'Change Logo' : 'Upload Logo'}
            </label>
            {logoPreview && (
              <div className="image-preview">
                <img src={logoPreview} alt="Crew logo preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>Members ({formData.members.length})</label>
          <div className="members-section">
            <div className="current-members">
              <h4>Current Members</h4>
              {formData.members.length === 0 ? (
                <p className="no-members">No members yet</p>
              ) : (
                <div className="members-grid">
                  {formData.members.map(member => (
                    <div key={member._id} className="member-card">
                      <img src={member.profileImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"} alt={member.name} />
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-level">Level {member.level}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member._id)}
                        className="remove-member-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="add-members">
              <h4>Add Members</h4>
              {availableUsersForCrew.length === 0 ? (
                <p className="no-available">No available users</p>
              ) : (
                <div className="available-users">
                  {availableUsersForCrew.map(user => (
                    <div key={user._id} className="user-card">
                      <img src={user.profileImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"} alt={user.name} />
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-level">Level {user.level}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addMember(user)}
                        className="add-user-btn"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
    masteredMoves: masteredMoveNames,
    battleVideos: user.battleVideos || [],
    level: user.level || 1,
    status: user.status || 'active'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [moveSearchTerm, setMoveSearchTerm] = useState('');

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
    
    // Debug: Log the moves array to see its structure
    console.log('🔍 moves array structure:', moves.slice(0, 3));
    console.log('🔍 moves array length:', moves.length);
    console.log('🔍 formData.masteredMoves:', formData.masteredMoves);
    
    // Convert move names back to move IDs for the API
    const masteredMoveIds = formData.masteredMoves
      .map(moveName => {
        const move = moves.find(m => m.name === moveName);
        console.log(`🔍 Looking for move "${moveName}":`, move ? `Found: ${move._id}` : 'Not found');
        return move ? move._id : null; // Return null if move not found
      })
      .filter(id => id !== null); // Filter out null values
    
    // Debug: Log the data being processed
    console.log('🔍 masteredMoveIds:', masteredMoveIds);
    
    // Only include password if it's been changed (not empty)
    const updateData = {
      ...user,
      ...formData,
      masteredMoves: masteredMoveIds // Use the converted IDs
    };
    
    // Debug: Log the final updateData
    console.log('🔍 updateData:', updateData);
    console.log('🔍 updateData.masteredMoves:', updateData.masteredMoves);
    console.log('🔍 updateData.masteredMoves type:', typeof updateData.masteredMoves);
    console.log('🔍 updateData.masteredMoves is array:', Array.isArray(updateData.masteredMoves));
    
    // Remove password if it's empty (not changed)
    if (!formData.password || formData.password.trim() === '') {
      delete updateData.password;
    }
    
    onSave(updateData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-content">
        <div className="form-row">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="edit-input"
              placeholder="Enter full name"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Level (Auto-calculated)</label>
            <input
              type="number"
              name="level"
              value={formData.level}
              className="edit-input"
              readOnly
              disabled
              style={{ backgroundColor: '#2a2a2a', color: '#888' }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="edit-input"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="edit-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="admin">Admin</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Mastered Moves</label>
          <div className="moves-management">
            <div className="moves-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search moves to add..."
                value={moveSearchTerm}
                onChange={(e) => setMoveSearchTerm(e.target.value)}
                className="edit-input"
              />
            </div>
            
            <div className="moves-lists">
              <div className="available-moves">
                <h4>Available Moves</h4>
                <div className="moves-grid">
                  {moves
                    .filter(move => 
                      !formData.masteredMoves.includes(move.name) &&
                      move.name.toLowerCase().includes(moveSearchTerm.toLowerCase())
                    )
                    .map((move, index) => (
                      <div key={`${move.name}-${index}`} className="move-item">
                        <span className={`move-name level-${move.level?.toLowerCase()}`}>
                          {move.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => addMove(move.name)}
                          className="add-move-btn"
                          title="Add move"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="mastered-moves">
                <h4>Mastered Moves ({formData.masteredMoves.length})</h4>
                <div className="moves-grid">
                  {formData.masteredMoves.map((moveName, index) => {
                    const move = moves.find(m => m.name === moveName);
                    return (
                      <div key={`${moveName}-${index}`} className="move-item mastered">
                        <span className={`move-name level-${move?.level?.toLowerCase() || 'beginner'}`}>
                          {moveName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMove(moveName)}
                          className="remove-move-btn"
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
        <div className="form-group">
          <label>Battle Videos (comma-separated URLs)</label>
          <textarea
            name="battleVideos"
            value={formData.battleVideos.join(', ')}
            onChange={(e) => handleArrayChange('battleVideos', e.target.value)}
            className="edit-textarea"
            rows="3"
            placeholder="e.g., https://youtube.com/watch?v=..., https://vimeo.com/..."
          />
        </div>
      </div>
    </form>
  );
};

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, isAdmin } = useAuth();
  
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
  
  // Use API hooks
  const { moves: apiMoves, loading: movesLoading, error: movesError, createMove, updateMove, deleteMove, refetch: refetchMoves } = useMoves();
  const { users: apiUsers, loading: usersLoading, error: usersError, createUser, updateUser, deleteUser, addMasteredMove, removeMasteredMove, approvePendingMove, rejectPendingMove, fetchUsersWithPasswords, refetch: refetchUsers } = useUsers();
  const { crews: apiCrews, loading: crewsLoading, error: crewsError, refetch: refetchCrews } = useCrews();
  const { badges: apiBadges, loading: badgesLoading, error: badgesError, createBadge, updateBadge, deleteBadge, refetch: refetchBadges } = useBadges();
  const { events: apiEvents, loading: eventsLoading, error: eventsError, createEvent, updateEvent, deleteEvent, refetch: refetchEvents } = useEvents();
  const { pendingRequests, loading: pendingLoading, error: pendingError, approveRequest, rejectRequest, refetch: refetchPendingMoves } = usePendingMoves();
  
  // Get refreshUserData from ProfileContext
  const { refreshUserData } = useProfile();
  
  // Auto-refresh data when user profile changes
  useAutoRefresh(() => {
    // Refresh all data when user profile changes
    refetchMoves();
    refetchUsers();
    refetchCrews();
    refetchBadges();
    refetchEvents();
    refetchPendingMoves();
  });
  
  // Initialize activeTab based on URL parameters
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    return (tab && ['moves', 'badges', 'events', 'crews', 'users', 'approvals'].includes(tab)) ? tab : 'moves';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showPasswords, setShowPasswords] = useState(false);

  // Update tab when URL parameters change and check for success messages
  useEffect(() => {
    const tab = searchParams.get('tab');
    const message = searchParams.get('message');
    
    if (tab && ['moves', 'badges', 'events', 'crews', 'users', 'approvals'].includes(tab)) {
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
  };

  // Use real API data
  const users = apiUsers || [];
  const movesData = apiMoves || [];
  const badgesData = apiBadges || [];
  const eventsData = apiEvents || [];
  const crewsData = apiCrews || [];



  // Convert pending requests to approval requests format
  const moveApprovals = pendingRequests.map((request) => ({
    id: request.id,
    userId: request.userId,
    userName: request.userName,
    userLevel: request.userLevel,
    moveId: request.moveId,
    moveName: request.moveName,
    moveCategory: request.moveCategory,
    moveLevel: request.moveLevel,
    moveXP: request.moveXP,
    requestDate: new Date(request.requestDate).toLocaleDateString(),
    status: request.status,
    videoUrl: request.videoUrl,
    description: request.description || `User has requested approval for ${request.moveName} move.`,
    moveData: { _id: request.moveId, name: request.moveName, category: request.moveCategory, level: request.moveLevel, xp: request.moveXP }
  }));

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    
    // Auto-scroll to the editing panel after a short delay to allow DOM update
    setTimeout(() => {
      const editingCard = document.querySelector('.data-card.editing');
      if (editingCard) {
        editingCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
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
          await updateBadge(itemData._id, itemData);
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
          // Show badge notification if new badges were earned
          if (response && response.newBadges && response.newBadges.length > 0) {
            const badgeNames = response.newBadges.map(badge => badge.name).join(', ');
            showToast(`🎉 ${itemName} earned new badges: ${badgeNames}!`);
          }
          break;
        case 'crews':
          itemName = itemData.name || 'Crew';
          // TODO: Add crew update API call when available
          showToast(`${itemName} updated successfully!`);
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
            const moveToDelete = apiMoves.find(item => item._id === id);
            itemName = moveToDelete?.name || 'Move';
            await deleteMove(id);
            break;
          case 'badges':
            const badgeToDelete = apiBadges.find(item => item._id === id);
            itemName = badgeToDelete?.name || 'Badge';
            await deleteBadge(id);
            break;
          case 'events':
            const eventToDelete = apiEvents.find(item => item._id === id);
            itemName = eventToDelete?.title || 'Event';
            await deleteEvent(id);
            break;
          case 'users':
            const userToDelete = apiUsers.find(item => item._id === id);
            itemName = userToDelete?.username || 'User';
            await deleteUser(id);
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

  const handleApproval = async (id, status) => {
    const request = moveApprovals.find(req => req.id === id);
    if (request) {
      try {
        if (status === 'approved') {
          const response = await approveRequest(request.userId, request.moveId);
          showToast(`Move request approved successfully`);
          // Show badge notification if new badges were earned
          if (response && response.newBadges && response.newBadges.length > 0) {
            const badgeNames = response.newBadges.map(badge => badge.name).join(', ');
            showToast(`🎉 User earned new badges: ${badgeNames}!`);
          }
          // Trigger global update to refresh all components
          refreshUserData();
        } else if (status === 'rejected') {
          await rejectRequest(request.userId, request.moveId);
          showToast(`Move request rejected`);
          // Trigger global update to refresh all components
          refreshUserData();
        }
      } catch (error) {
        showToast(`Error ${status === 'approved' ? 'approving' : 'rejecting'} move request: ${error.message}`);
      }
    }
  };

  const handleRemoveMasteredMove = (moveName) => {
    removeMasteredMove(moveName);
    showToast(`Removed ${moveName} from mastered moves`);
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
    const filteredMoves = apiMoves.filter(move =>
      move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      move.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      move.level.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Moves Management</h2>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search moves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-btn" onClick={() => navigate(`/admin/add-move?tab=${activeTab}`)}>
              <FaPlus /> Add Move
            </button>
            <button className="refresh-btn" onClick={() => refetchMoves()}>
              <FaSync /> Refresh
            </button>
          </div>
        </div>
                  <div className="data-grid">
            {filteredMoves.map((move) => (
            <div key={move.id} className={`data-card ${editingItem && editingItem.id === move.id && editingItem.type === 'moves' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>{move.name}</h3>
                <div className="card-actions">
                  {editingItem && editingItem.id === move.id && editingItem.type === 'moves' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[move.id]) {
                          // Manually trigger the form submission
                          const form = formRefs[move.id];
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
                      <button onClick={() => handleDelete(move.id, 'moves')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem.id === move.id && editingItem.type === 'moves' ? (
                  <EditMoveForm 
                    move={editingItem} 
                    onSave={handleSave} 
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => formRefs[move.id] = ref}
                  />
                ) : (
                  <>
                    <p><strong>Category:</strong> {move.category}</p>
                    <p><strong>Level:</strong> {move.level}</p>
                    <p><strong>XP:</strong> {move.xp}</p>
                    <p><strong>Recommendations:</strong> {move.recommendations ? move.recommendations.join(', ') : 'None'}</p>
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
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Badges Management</h2>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-btn" onClick={() => navigate(`/admin/add-badge?tab=${activeTab}`)}>
              <FaPlus /> Add Badge
            </button>
            <button className="refresh-btn" onClick={() => refetchBadges()}>
              <FaSync /> Refresh
            </button>
          </div>
        </div>
        <div className="data-grid">
          {filteredBadges.map((badge) => (
            <div key={badge.id} className={`data-card ${editingItem && editingItem.id === badge.id && editingItem.type === 'badges' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>{badge.name}</h3>
                <div className="card-actions">
                  {editingItem && editingItem.id === badge.id && editingItem.type === 'badges' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[badge.id]) {
                          const form = formRefs[badge.id];
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
                      <button onClick={() => handleDelete(badge.id, 'badges')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem.id === badge.id && editingItem.type === 'badges' ? (
                  <EditBadgeForm
                    badge={editingItem}
                    onSave={handleSave}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => formRefs[badge.id] = ref}
                  />
                ) : (
                  <>
                    <p><strong>Category:</strong> {badge.category}</p>
                    <p><strong>Description:</strong> {badge.description}</p>
                    <p><strong>Requirement:</strong> {badge.requirement || 'None'}</p>
                    {badge.image && (
                      <div className="badge-image-preview">
                        <img src={badge.image} alt={badge.name} />
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
    // Filter events based on search term
    const filteredEvents = eventsData.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Events Management</h2>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-btn" onClick={() => navigate(`/admin/add-event?tab=${activeTab}`)}>
              <FaPlus /> Add Event
            </button>
            <button className="refresh-btn" onClick={() => refetchEvents()}>
              <FaSync /> Refresh
            </button>
          </div>
        </div>
        <div className="data-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`data-card ${editingItem && editingItem.id === event.id && editingItem.type === 'events' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>{event.title}</h3>
                <div className="card-actions">
                  {editingItem && editingItem.id === event.id && editingItem.type === 'events' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[event.id]) {
                          const form = formRefs[event.id];
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
                      <button onClick={() => handleDelete(event.id, 'events')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem.id === event.id && editingItem.type === 'events' ? (
                  <EditEventForm
                    event={editingItem}
                    onSave={handleSave}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => formRefs[event.id] = ref}
                  />
                ) : (
                  <>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Category:</strong> {event.category}</p>
                    <p><strong>Status:</strong> {event.status}</p>
                    <p><strong>Participants:</strong> {event.currentParticipants || 0}/{event.maxParticipants}</p>
                    <p><strong>Entry Fee:</strong> {event.entryFee}</p>
                    <p><strong>Organizer:</strong> {event.organizer}</p>
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
    );
  };

  const renderCrewsTab = () => {
    const formRefs = {};
    
    if (crewsLoading) {
      return (
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading crews...</p>
          </div>
        </div>
      );
    }

    if (crewsError) {
      return (
        <div className="admin-content">
          <div className="error-container">
            <p>Error loading crews: {crewsError}</p>
          </div>
        </div>
      );
    }
    
    // Filter crews based on search term
    const filteredCrews = crewsData.filter(crew =>
      crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Crews Management</h2>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search crews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-btn" onClick={() => navigate(`/admin/add-crew?tab=${activeTab}`)}>
              <FaPlus /> Add Crew
            </button>
            <button className="refresh-btn" onClick={() => refetchCrews()}>
              <FaSync /> Refresh
            </button>
          </div>
        </div>
        <div className="data-grid">
          {filteredCrews.map((crew) => (
            <div key={crew._id} className={`data-card ${editingItem && editingItem._id === crew._id && editingItem.type === 'crews' ? 'editing' : ''}`}>
              <div className="card-header">
                <h3>{crew.name}</h3>
                <div className="card-actions">
                  {editingItem && editingItem._id === crew._id && editingItem.type === 'crews' ? (
                    <>
                      <button onClick={() => setEditingItem(null)} className="cancel-btn">
                        <FaTimes />
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        if (formRefs[crew._id]) {
                          const form = formRefs[crew._id];
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
                      <button onClick={() => handleEdit(crew, 'crews')} className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(crew._id, 'crews')} className="delete-btn">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                {editingItem && editingItem.id === crew.id && editingItem.type === 'crews' ? (
                  <EditCrewForm
                    crew={editingItem}
                    onSave={handleSave}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => formRefs[crew._id] = ref}
                  />
                ) : (
                  <>
                    <p><strong>Description:</strong> {crew.description}</p>
                    <p><strong>Members:</strong> {crew.memberCount || crew.members?.length || 0}</p>
                    {crew.logo && (
                      <div className="crew-logo-preview">
                        <img src={crew.logo} alt={crew.name} />
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
    
    // Filter users based on search term
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Users Management</h2>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-btn" onClick={() => navigate(`/admin/add-user?tab=${activeTab}`)}>
              <FaPlus /> Add User
            </button>
            <button className="refresh-btn" onClick={() => refetchUsers()}>
              <FaSync /> Refresh
            </button>
            <button className="add-btn" onClick={() => {
              if (showPasswords) {
                refetchUsers();
                setShowPasswords(false);
              } else {
                fetchUsersWithPasswords();
                setShowPasswords(true);
              }
            }}>
              <FaUsers /> {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
            </button>
          </div>
        </div>
        <div className="data-grid">
          {filteredUsers.map((user) => (
            <div key={user._id} className={`data-card ${editingItem && editingItem._id === user._id && editingItem.type === 'users' ? 'editing' : ''}`}>
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
                    user={editingItem}
                    onSave={handleSave}
                    onCancel={() => setEditingItem(null)}
                    formRef={(ref) => formRefs[user._id] = ref}
                    moves={movesData}
                  />
                ) : (
                  <>
                    <p><strong>Name:</strong> {user.name || 'Not specified'}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Password:</strong> {user.password ? (showPasswords ? user.password : '••••••••') : 'No password set'}</p>
                    <p><strong>Level:</strong> {user.level}</p>
                    <p><strong>XP:</strong> {user.xp}</p>
                    <p><strong>Status:</strong> <span className={`status-${user.status}`}>{user.status}</span></p>
                    <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
                    <p><strong>Mastered Moves:</strong> {user.masteredMoves && user.masteredMoves.length > 0 ? user.masteredMoves.length + ' moves' : 'None'}</p>
                    <p><strong>Pending Moves:</strong> {user.pendingMoves && user.pendingMoves.length > 0 ? user.pendingMoves.length + ' moves' : 'None'}</p>
                    <p><strong>Battle Videos:</strong> {user.battleVideos && user.battleVideos.length > 0 ? user.battleVideos.length + ' videos' : 'None'}</p>
                    <p><strong>Badges:</strong> {user.badges && user.badges.length > 0 ? user.badges.length + ' badges' : 'None'}</p>
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
    if (pendingLoading) {
      return (
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading pending move requests...</p>
          </div>
        </div>
      );
    }

    if (pendingError) {
      return (
        <div className="admin-content">
          <div className="error-container">
            <p>Error loading pending move requests: {pendingError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      );
    }

    const filteredApprovals = moveApprovals.filter(request =>
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.moveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.moveCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div className="admin-content">
        <div className="content-header">
          <h2>Move Approval Requests</h2>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="refresh-btn" onClick={() => refetchPendingMoves()}>
              <FaSync /> Refresh
            </button>
          </div>
        </div>
        
        {filteredApprovals.length === 0 ? (
          <div className="no-requests">
            <p>No pending move approval requests.</p>
          </div>
        ) : (
          <div className="data-grid">
            {filteredApprovals.map((request) => (
              <div key={request.id} className="data-card">
                <div className="card-header">
                  <h3>{request.moveName}</h3>
                  <div className="card-actions">
                    <button 
                      onClick={() => handleApproval(request.id, 'approved')} 
                      className="approve-btn"
                      title="Approve"
                    >
                      <FaCheckCircle />
                    </button>
                    <button 
                      onClick={() => handleApproval(request.id, 'rejected')} 
                      className="reject-btn"
                      title="Reject"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <p><strong>User:</strong> {request.userName} (Level {request.userLevel})</p>
                  <p><strong>Move:</strong> {request.moveName} - {request.moveCategory} ({request.moveLevel})</p>
                  <p><strong>XP:</strong> {request.moveXP}</p>
                  <p><strong>Request Date:</strong> {request.requestDate}</p>
                  <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                  <p><strong>Description:</strong> {request.description}</p>
                  {request.videoUrl && (
                    <p><strong>Video:</strong> <a href={request.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">Watch Video</a></p>
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
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search mastered moves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="refresh-btn" onClick={() => window.location.reload()}>
              <FaSync /> Refresh
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
                move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                move.category.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate('/')} className="back-btn">
            <FaArrowLeft /> Back
          </button>
          <h1>Admin Panel</h1>
        </div>
        
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
            className={`nav-item ${activeTab === 'crews' ? 'active' : ''}`}
            onClick={() => handleTabChange('crews')}
          >
            <FaUsers /> Crews
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <FaUserEdit /> Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => handleTabChange('approvals')}
          >
            <FaClipboardCheck /> Approvals
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {activeTab === 'moves' && renderMovesTab()}
        {activeTab === 'badges' && renderBadgesTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'crews' && renderCrewsTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'approvals' && renderApprovalsTab()}
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