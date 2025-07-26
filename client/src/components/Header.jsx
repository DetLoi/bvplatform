import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/breakKidCropped.png';
import { FaTwitch, FaSignOutAlt } from 'react-icons/fa';

export default function Header({ menuOpen, setMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const [mobileTitle, setMobileTitle] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setMobileTitle('Breakverse');
    else if (path === '/login') setMobileTitle('Login');
    else if (path === '/dashboard') setMobileTitle('Dashboard');
    else if (path.startsWith('/moves')) setMobileTitle('Moves');
    else if (path.startsWith('/badges')) setMobileTitle('Badges');
    else if (path.startsWith('/profile')) setMobileTitle('Crews');
    else if (path.startsWith('/breakers')) setMobileTitle('Breakers');
    else if (path.startsWith('/events')) setMobileTitle('Events');
    else if (path.startsWith('/battles')) setMobileTitle('Battles');
    else if (path.startsWith('/admin')) setMobileTitle('Admin');
    else setMobileTitle('Breakverse');
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  return (
    <nav className="nav">
      <span className="nav-mobile-title">{mobileTitle}</span>
      <div className="nav-container">
        <Link to={currentUser ? "/dashboard" : "/"} className="logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Breakverse Logo" className="h-10 w-auto" />
        </Link>
        <div className="nav-center-group">
          {currentUser ? (
            <ul className={`nav-links ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}>
              <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
              <li><Link to="/moves" className={location.pathname.startsWith('/moves') ? 'active' : ''}>Moves</Link></li>
              <li><Link to="/badges" className={location.pathname.startsWith('/badges') ? 'active' : ''}>Badges</Link></li>
              <li><Link to="/events" className={location.pathname.startsWith('/events') ? 'active' : ''}>Events</Link></li>
              <li><Link to="/battles" className={location.pathname.startsWith('/battles') ? 'active' : ''}>Battles</Link></li>
              <li><Link to="/breakers" className={location.pathname.startsWith('/breakers') ? 'active' : ''}>Breakers</Link></li>
              <li><Link to="/profile" className={location.pathname.startsWith('/profile') ? 'active' : ''}>Crews</Link></li>
              {isAdmin() && (
                <li><Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>Admin</Link></li>
              )}
            </ul>
          ) : (
            <ul className={`nav-links ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}>
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Hjem</Link></li>
              <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Log Ind</Link></li>
            </ul>
          )}
        </div>
        {currentUser && (
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
              navigate('/');
            }}
            className="logout-btn"
            aria-label="Logout"
          >
            <FaSignOutAlt size={20} />
          </button>
        )}
        <a
          href="https://twitch.tv/ducweb"
          target="_blank"
          rel="noopener noreferrer"
          className="twitch-link"
          aria-label="Twitch"
        >
          <FaTwitch size={28} />
        </a>
        <button
          className={`burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
