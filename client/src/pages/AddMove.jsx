import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/pages/add-form.css';

export default function AddMove() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'moves';
  const [formData, setFormData] = useState({
    name: '',
    category: 'Toprock',
    level: 'Beginner',
    xp: 25,
    description: ''
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
    
    // Generate a unique ID (in a real app, this would come from the backend)
    const newMove = {
      id: Date.now(),
      ...formData
    };

    // Here you would typically save to your data store
    console.log('New move:', newMove);
    
    // Navigate back to admin with success message
    navigate(`/admin?tab=${currentTab}&message=Move added successfully!`);
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
          <h1>Add New Move</h1>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
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
            <label htmlFor="level">Level *</label>
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
              max="100"
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

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="save-btn">
              <FaSave /> Save Move
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 