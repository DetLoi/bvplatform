import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { FaPlay, FaUsers, FaTrophy, FaDumbbell, FaArrowRight, FaCalendar, FaMapMarkerAlt, FaTwitch, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import UsersCarousel3D from '../components/UsersCarousel3D';
import ctaBadge from '../assets/badge white.png';
import { useEvents } from '../hooks/useEvents';
import '../styles/pages/landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { events } = useEvents();

  // Scroll to top when landing page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLearnMore = () => {
    navigate('/learnmore');
  };

  const isDanishEvent = (event) => {
    const danishKeywords = ['denmark', 'danmark', 'danish', 'dansk', 'copenhagen', 'aarhus', 'odense', 'aalborg'];
    const organizer = (event?.organizer || '').toLowerCase();
    const location = (event?.location || '').toLowerCase();
    return danishKeywords.some(k => organizer.includes(k) || location.includes(k));
  };

  const upcomingDanishEvents = useMemo(() => {
    const list = (Array.isArray(events) ? events : []).filter(isDanishEvent);
    return list
      .slice()
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
      .slice(0, 6);
  }, [events]);

  

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background 3D carousel */}
        <div className="hero-bg-carousel" aria-hidden="true">
          <UsersCarousel3D images={[
                    '/assets/badges/beginner.png',
        '/assets/badges/novice.png',
        '/assets/badges/intermediate.png',
        '/assets/badges/Advanced.png',
        '/assets/badges/skilled.png',
        '/assets/badges/master.png',
        '/assets/badges/grandmaster.png',
          ]} />
        </div>
        <div className="hero-content">
          <div className="hero-intro">
            <div className="welcome-block">
              <img
                src="/assets/Logo.png"
                alt="Breakverse"
                className="hero-logo-lg"
              />
              <div className="hero-buttons">
                <button className="btn-primary hero-btn hero-btn-primary" onClick={handleGetStarted}>
                  <FaPlay className="btn-icon" />
                  SIGN UP | Get Started Free
                </button>
                <button className="btn-secondary hero-btn hero-btn-secondary" onClick={handleLearnMore}>
                  Learn More
                  <FaArrowRight className="btn-icon" />
                </button>
                
              </div>
              
            </div>

            <div className="events-stack">
              <div className="events-stack-header">
                Upcoming events in Denmark
              </div>
              <div className="events-stack-list">
                {upcomingDanishEvents.map((ev) => (
                  <a
                    key={ev.id}
                    className="event-row"
                    href={ev.website || '#'}
                    target={ev.website ? '_blank' : undefined}
                    rel={ev.website ? 'noreferrer' : undefined}
                  >
                    <div className="event-row-title">{ev.title}</div>
                    <div className="event-row-meta">
                      <span className="event-row-item"><FaCalendar /> {ev.date ? new Date(ev.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBA'}</span>
                      <span className="event-row-item"><FaMapMarkerAlt /> {ev.location || 'Denmark'}</span>
                    </div>
                  </a>
                ))}
                {upcomingDanishEvents.length === 0 && (
                  <div className="event-row placeholder">
                    <div className="event-row-title">No Danish events yet</div>
                    <div className="event-row-meta"><span className="event-row-item">Check back soon</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaDumbbell />
              </div>
              <h3>Learn Moves</h3>
              <p>Master 100+ authentic breakdance moves with step-by-step tutorials and progress tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTrophy />
              </div>
              <h3>Earn Badges</h3>
              <p>Unlock achievements and badges as you progress through skill levels and categories.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Join the Community</h3>
              <p>Connect with breakers and join battles and events.</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Moves to Master</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Badges to Earn</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">80+</div>
              <div className="stat-label">Breaking Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <img src={ctaBadge} alt="Badge" className="cta-badge" />
            <h2>Ready to Start Your Breaking Journey?</h2>
            <p>Join hundreds of breakers already leveling up on Breakverse.</p>
            <button className="btn-primary btn-large" onClick={handleGetStarted}>
              <FaPlay className="btn-icon" />
              Start Breaking Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/assets/logo-white.png" alt="Breakverse" className="footer-logo" />
              <p className="footer-tagline">Learn. Battle. Grow. Together.</p>
              <div className="footer-contact">
                <a href="mailto:support@breakverse.app" className="footer-mail">support@breakverse.app</a>
              </div>
            </div>
            <div className="footer-columns">
              <div className="footer-col">
                <h5>Platform</h5>
                <ul className="footer-links">
                  <li><a href="/moves">Moves</a></li>
                  <li><a href="/badges">Badges</a></li>
                  <li><a href="/events">Events</a></li>
                  <li><a href="/battles">Battles</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Community</h5>
                <ul className="footer-links">
                  <li><a href="/breakers">Breakers</a></li>
                  <li><a href="#">Challenges</a></li>
                  <li><a href="#">News</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Legal</h5>
                <ul className="footer-links">
                  <li><a href="/policy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="#">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>&copy; 2025 Breakverse</span>
            </div>
            <div className="footer-bottom-right">
              <div className="social-links">
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
                <a href="https://www.twitch.tv" target="_blank" rel="noreferrer" aria-label="Twitch"><FaTwitch /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 