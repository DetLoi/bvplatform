import { useState, useRef, useEffect } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';
import { useEvents } from '../hooks/useEvents';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const selectedEventRef = useRef(null);
  
  // Use the API hook
  const { events, loading, error } = useEvents();

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#00ffc3';
      case 'ongoing': return '#ffd54f';
      case 'completed': return '#999';
      default: return '#00ffc3';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Competition': return '#ff6b6b';
      case 'Workshop': return '#4ecdc4';
      case 'Cypher': return '#45b7d1';
      default: return '#e6c77b';
    }
  };

  // Scroll to selected event when it changes
  useEffect(() => {
    if (selectedEvent && selectedEventRef.current) {
      selectedEventRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedEvent]);

  // Show loading state
  if (loading) {
    return (
      <div className="main-content">
        <section className="events-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </section>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="main-content">
        <section className="events-page">
          <div className="error-container">
            <p>Error loading events: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="main-content">
      <section className="events-page">
        <div className="events-header">
          <h1 className="page-title">Breakin Events</h1>
          <p className="page-subtitle">Join the community!</p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="event-card"
              ref={selectedEvent?.id === event.id ? selectedEventRef : null}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
            >
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-overlay">
                  <span 
                    className="event-category"
                    style={{ backgroundColor: getCategoryColor(event.category) }}
                  >
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="event-content">
                <div className="event-header">
                  <h3 className="event-title">{event.title}</h3>
                </div>
                
                <div className="event-details">
                  <div className="event-info">
                    <FaCalendar className="event-icon" />
                    <span>{event.date}</span>
                  </div>
                  <div className="event-info">
                    <FaClock className="event-icon" />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-info">
                    <FaMapMarkerAlt className="event-icon" />
                    <span>{event.location}</span>
                  </div>
                  <div className="event-info">
                    <FaUsers className="event-icon" />
                    <span>{event.battleFormat || `${event.participants}/${event.maxParticipants} participants`}</span>
                  </div>
                </div>

                {selectedEvent?.id === event.id && (
                  <div className="event-description">
                    <p>{event.description}</p>
                    <div className="event-actions">
                      <a 
                        href={event.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Join Event
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 