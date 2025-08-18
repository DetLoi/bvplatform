import { useState } from 'react';
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import './NewsletterToggle.css';

export default function NewsletterToggle({ 
  isChecked = false, 
  onChange, 
  label = "Subscribe to our newsletter",
  description = "Stay updated with the latest breaking news, events, and tips"
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    onChange(!isChecked);
  };

  return (
    <div 
      className={`newsletter-toggle-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="newsletter-content">
        <div className="newsletter-icon">
          {isChecked ? <FaEnvelopeOpen /> : <FaEnvelope />}
        </div>
        <div className="newsletter-text">
          <label className="newsletter-label">{label}</label>
          <p className="newsletter-description">{description}</p>
        </div>
      </div>
      
      <button 
        className={`newsletter-toggle ${isChecked ? 'checked' : ''}`}
        onClick={handleToggle}
        type="button"
        aria-label={isChecked ? 'Unsubscribe from newsletter' : 'Subscribe to newsletter'}
      >
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
      </button>
    </div>
  );
}
