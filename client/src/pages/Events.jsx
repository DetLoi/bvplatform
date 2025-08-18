import { useState, useRef, useEffect, useMemo } from 'react';
import useIntersectionReveal from '../hooks/useIntersectionReveal';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaClock, FaTh, FaList, FaFilter, FaGlobe, FaFlag } from 'react-icons/fa';
import { useEvents } from '../hooks/useEvents';
import { getCountryFlag } from '../utils/countryFlags';

// Helper function to identify Danish events
const isDanishEvent = (event) => {
  const danishKeywords = ['denmark', 'danmark', 'danish', 'dansk'];
  const nonDanishOrganizers = ['sweden', 'norway', 'finland', 'iceland', 'germany', 'france', 'spain', 'italy', 'poland', 'czech', 'austria', 'switzerland', 'belgium', 'netherlands', 'portugal', 'greece', 'hungary', 'romania', 'bulgaria', 'croatia', 'serbia', 'slovenia', 'slovakia', 'lithuania', 'latvia', 'estonia'];
  
  const organizer = (event.organizer || '').toLowerCase();
  const location = (event.location || '').toLowerCase();
  
  // First check if organizer is clearly non-Danish
  if (nonDanishOrganizers.some(country => organizer.includes(country))) {
    return false;
  }
  
  // Then check for Danish keywords in organizer or location
  return danishKeywords.some(keyword => 
    organizer.includes(keyword) || location.includes(keyword)
  );
};

// Component for Danish events
const DanishEventCard = ({ event, viewMode, isSelected, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`event-list-item danish-event ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
      >
        
        <div className="event-content">
          <div className="event-header">
            <h3 className="event-title">{event.title}</h3>
          </div>
          
          <div className="event-details">
            <div className="event-info">
              <FaCalendar className="event-icon" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="event-info">
              <FaMapMarkerAlt className="event-icon" />
              <span>{event.location || 'Location TBA'}</span>
            </div>
            <div className="event-info">
              {getCountryFlag(event.organizer) ? (
                <img 
                  src={getCountryFlag(event.organizer)} 
                  alt={`${event.organizer} flag`}
                  className="event-icon flag-icon"
                  style={{ width: '18px', height: '12px' }}
                />
              ) : (
                <FaFlag className="event-icon" />
              )}
              <span>{event.organizer || 'Organizer TBA'}</span>
            </div>
          </div>

          {isSelected && (
            <div className="event-description">
              <div className="event-actions">
                <a 
                  href={event.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Visit Official Site
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`event-card danish-event ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      
      <div className="event-content">
        <div className="event-header">
          <h3 className="event-title">{event.title}</h3>
        </div>
        
        <div className="event-details">
          <div className="event-info">
            <FaCalendar className="event-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-info">
            <FaMapMarkerAlt className="event-icon" />
            <span>{event.location || 'Location TBA'}</span>
          </div>
          <div className="event-info">
            {getCountryFlag(event.organizer) ? (
              <img 
                src={getCountryFlag(event.organizer)} 
                alt={`${event.organizer} flag`}
                className="event-icon flag-icon"
                style={{ width: '18px', height: 'auto' }}
              />
            ) : (
              <FaFlag className="event-icon" />
            )}
            <span>{event.organizer || 'Organizer TBA'}</span>
          </div>
        </div>

        {isSelected && (
          <div className="event-description">
            <div className="event-actions">
              <a 
                href={event.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit Official Site
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for international events (scraped, limited info)
const InternationalEventCard = ({ event, viewMode, isSelected, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time TBA';
    const date = new Date(dateString);
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    // Remove "12:00 AM" time display for international events
    return timeString === '12:00 AM' ? '' : timeString;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`event-list-item international-event ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
      >
        
        <div className="event-content">
          <div className="event-header">
            <h3 className="event-title">{event.title}</h3>
          </div>
          
          <div className="event-details">
            <div className="event-info">
              <FaCalendar className="event-icon" />
              <span>{formatDate(event.date)}</span>
            </div>
            {formatTime(event.date) && (
              <div className="event-info">
                <FaClock className="event-icon" />
                <span>{formatTime(event.date)}</span>
              </div>
            )}
            <div className="event-info">
              <FaMapMarkerAlt className="event-icon" />
              <span>{event.location || 'Location TBA'}</span>
            </div>
            <div className="event-info">
              {getCountryFlag(event.organizer) ? (
                <img 
                  src={getCountryFlag(event.organizer)} 
                  alt={`${event.organizer} flag`}
                  className="event-icon flag-icon"
                  style={{ width: '18px', height: '12px' }}
                />
              ) : (
                <FaFlag className="event-icon" />
              )}
              <span>{event.organizer || 'Organizer TBA'}</span>
            </div>
          </div>

          {isSelected && (
            <div className="event-description">
              <div className="event-actions">
                <a 
                  href={event.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Visit Official Site
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`event-card international-event ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      
      <div className="event-content">
        <div className="event-header">
          <h3 className="event-title">{event.title}</h3>
        </div>
        
        <div className="event-details">
          <div className="event-info">
            <FaCalendar className="event-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
          {formatTime(event.date) && (
            <div className="event-info">
              <FaClock className="event-icon" />
              <span>{formatTime(event.date)}</span>
            </div>
          )}
          <div className="event-info">
            <FaMapMarkerAlt className="event-icon" />
            <span>{event.location || 'Location TBA'}</span>
          </div>
          <div className="event-info">
            {getCountryFlag(event.organizer) ? (
              <img 
                src={getCountryFlag(event.organizer)} 
                alt={`${event.organizer} flag`}
                className="event-icon flag-icon"
                style={{ width: '18px', height: 'auto' }}
              />
            ) : (
              <FaFlag className="event-icon" />
            )}
            <span>{event.organizer || 'Organizer TBA'}</span>
          </div>
        </div>

        {isSelected && (
          <div className="event-description">
            <div className="event-actions">
              <a 
                href={event.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit Official Site
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const selectedEventRef = useRef(null);
  const [viewMode, setViewMode] = useState('list');
  const [filterType, setFilterType] = useState('all'); // 'all', 'national', 'international'
  const [filterCategory, setFilterCategory] = useState('all');
  
  const { events, loading, error } = useEvents();
  // Ensure this hook runs every render before early returns
  const observe = useIntersectionReveal({ threshold: 0.15 });

  // Ensure events is always an array
  const eventsArray = Array.isArray(events) ? events : [];

  // Danish events should always be visible regardless of selected country filter
  const danishEvents = useMemo(() => eventsArray.filter(event => isDanishEvent(event)), [eventsArray]);

  // International events are filtered by selected country (but countries list should not shrink)
  const internationalEvents = useMemo(() => {
    const internationals = eventsArray.filter(event => !isDanishEvent(event));
    return internationals.filter(event => (
      (filterType === 'all' || event.eventType === filterType) &&
      (filterCategory === 'all' || event.organizer === filterCategory)
    ));
  }, [eventsArray, filterType, filterCategory]);

  // Determine if any events are visible under current settings
  const hasAnyVisibleEvents = (danishEvents.length > 0) || (internationalEvents.length > 0);
  
  // Get unique countries from international events
  const availableCountries = useMemo(() => {
    const countries = new Set();
    const danishRegex = /(denmark|danmark|danish|dansk)/i;
    eventsArray.forEach(event => {
      const org = event.organizer || '';
      if (org && !danishRegex.test(org)) {
        countries.add(org);
      }
    });
    return Array.from(countries).sort();
  }, [eventsArray]);

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
      <div className="main-content fullpage-loading">
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
      <div className="main-content fullpage-loading">
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
        

                 {/* Danish Events Section */}
         {danishEvents.length > 0 && (
           <div className="events-section">
             <div className="section-header">
               <div>
                 <h2 className="section-title">
                   Danish Events
                 </h2>
               </div>
               <div className="header-actions" />
             </div>
             <div className={`events-container events-list`}>
               {danishEvents.map((event) => (
                 <div key={event.id} className="reveal-on-scroll" ref={observe}>
                   <DanishEventCard
                     event={event}
                     viewMode={viewMode}
                     isSelected={selectedEvent?.id === event.id}
                     onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                   />
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* International Events Section */}
         {internationalEvents.length > 0 && (
           <div className="events-section">
             <div className="section-header">
               <div>
                 <h2 className="section-title">
                   <FaGlobe /> International Events ({internationalEvents.length})
                 </h2>
               </div>
               <div className="header-actions">
                 <div className="filter-controls">
                    <div className="filter-group events-select-wrap">
                      <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="events-filter-select"
                      >
                        <option value="all">All Countries</option>
                        {availableCountries.map(country => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <span className="events-select-arrow" aria-hidden="true"></span>
                    </div>
                    {filterCategory !== 'all' && (
                      <button
                        type="button"
                        className="events-filter-reset"
                        onClick={() => setFilterCategory('all')}
                        aria-label="Reset to All Countries"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  
                </div>
              </div>
              <div className={`events-container events-list`}>
                {internationalEvents.map((event) => (
                  <div key={event.id} className="reveal-on-scroll" ref={observe}>
                    <InternationalEventCard
                      event={event}
                      viewMode={viewMode}
                      isSelected={selectedEvent?.id === event.id}
                      onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* No Events Message */}
        {!hasAnyVisibleEvents && (
          <div className="no-events">
            <p>No events found matching your filters.</p>
            <button 
              onClick={() => {
                setFilterType('all');
                setFilterCategory('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
} 