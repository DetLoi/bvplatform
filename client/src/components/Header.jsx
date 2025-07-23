import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/breakKidCropped.png';
import { FaTwitch } from 'react-icons/fa';

export default function Header({ menuOpen, setMenuOpen }) {
  const location = useLocation();
  const [mobileTitle, setMobileTitle] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/moves')) setMobileTitle('Moves');
    else if (path.startsWith('/badges')) setMobileTitle('Badges');
    else if (path.startsWith('/profile')) setMobileTitle('Crews');
    else if (path.startsWith('/breakers')) setMobileTitle('Breakers');
    else if (path.startsWith('/events')) setMobileTitle('Events');
    else if (path.startsWith('/battles')) setMobileTitle('Battles');
    else setMobileTitle('Dashboard');
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  return (
    <nav className="nav">
      <span className="nav-mobile-title">{mobileTitle}</span>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Breakverse Logo" className="h-10 w-auto" />
        </Link>
        <div className="nav-center-group">
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link></li>
            <li><Link to="/moves" className={location.pathname.startsWith('/moves') ? 'active' : ''}>Moves</Link></li>
            <li><Link to="/badges" className={location.pathname.startsWith('/badges') ? 'active' : ''}>Badges</Link></li>
            <li><Link to="/events" className={location.pathname.startsWith('/events') ? 'active' : ''}>Events</Link></li>
            <li><Link to="/battles" className={location.pathname.startsWith('/battles') ? 'active' : ''}>Battles</Link></li>
            <li><Link to="/breakers" className={location.pathname.startsWith('/breakers') ? 'active' : ''}>Breakers</Link></li>
            <li><Link to="/profile" className={location.pathname.startsWith('/profile') ? 'active' : ''}>Crews</Link></li>
          </ul>
        </div>
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
