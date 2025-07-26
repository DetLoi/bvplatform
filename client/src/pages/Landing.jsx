import { useNavigate } from 'react-router-dom';
import { FaPlay, FaUsers, FaTrophy, FaDumbbell, FaArrowRight } from 'react-icons/fa';
import '../styles/pages/landing.css';

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Velkommen til <span className="highlight">Breakverse</span></h1>
            <p className="hero-subtitle">
              Den ultimative platform for danske breakdancere til at lære, konkurrere og vokse sammen. 
              Mester moves, tjen badges og bliv en del af den danske breaking scene.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleGetStarted}>
                <FaPlay className="btn-icon" />
                Kom i Gang
              </button>
              <button className="btn-secondary" onClick={handleLearnMore}>
                Lær Mere
                <FaArrowRight className="btn-icon" />
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-visual">
              <div className="breaker-silhouette"></div>
              <div className="floating-elements">
                <div className="floating-badge badge-1">
                  <img src="/src/assets/badges/Advanced.png" alt="Advanced Badge" />
                </div>
                <div className="floating-badge badge-2">
                  <img src="/src/assets/badges/Powermoves.png" alt="Power Moves Badge" />
                </div>
                <div className="floating-badge badge-3">
                  <img src="/src/assets/badges/Tricks.png" alt="Tricks Badge" />
                </div>
                <div className="floating-badge badge-4">
                  <img src="/src/assets/badges/footwork.png" alt="Footwork Badge" />
                </div>
                <div className="floating-badge badge-5">
                  <img src="/src/assets/badges/freezes.png" alt="Freezes Badge" />
                </div>
                <div className="floating-badge badge-6">
                  <img src="/src/assets/badges/ground.png" alt="Ground Badge" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Hvorfor Vælge Breakverse?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaDumbbell />
              </div>
              <h3>Lær Moves</h3>
              <p>Mester over 100 autentiske breakdance moves med trin-for-trin tutorials og progress tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTrophy />
              </div>
              <h3>Tjen Badges</h3>
              <p>Lås op for achievements og badges mens du udvikler dig gennem forskellige skill levels og kategorier.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Bliv Del af Fællesskabet</h3>
              <p>Forbind med danske breakers, tilslut dig crews og deltag i battles og events.</p>
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
              <div className="stat-label">Moves at Mestre</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Badges at Tjene</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Danske Breakers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Dansk Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Klar til at Starte Din Breaking Rejse?</h2>
            <p>Tilslut dig hundredvis af danske breakers der allerede udvikler deres game på Breakverse.</p>
            <button className="btn-primary btn-large" onClick={handleGetStarted}>
              <FaPlay className="btn-icon" />
              Start Breaking Nu
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Breakverse</h4>
              <p>Den ultimative platform for danske breakdancere til at lære, konkurrere og vokse sammen.</p>
            </div>
            <div className="footer-section">
            
            </div>
            <div className="footer-section">
             
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Breakverse. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 