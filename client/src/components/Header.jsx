import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import logo from '../assets/logo-white.png';
import logoColor from '../assets/Logo.png';
import { FaSignOutAlt, FaBell, FaEnvelope, FaUser, FaQuestionCircle, FaBook, FaExternalLinkAlt } from 'react-icons/fa';

// User Avatar Dropdown Component
function UserAvatarDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const handleSupportClick = () => {
    // For now, just close the dropdown
    // You can add navigation to support page later
    setIsOpen(false);
  };

  return (
    <div className="user-avatar-container" ref={dropdownRef}>
      <button
        className="user-avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <img 
          src={user.profileImage || '/assets/User.jpg'} 
          alt={`${user.username}'s profile`}
          className="user-avatar-img"
          onError={(e) => { e.target.src = '/assets/User.jpg'; }}
        />
      </button>
      
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <span className="user-dropdown-username">{user.username}</span>
          </div>
          <div className="user-dropdown-items">
            <button 
              className="user-dropdown-item"
              onClick={handleSupportClick}
            >
              <FaQuestionCircle size={16} />
              <span>Support</span>
            </button>
            <button 
              className="user-dropdown-item logout-item"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Social Links Dropdown Component
function SocialLinksDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="social-links-container" ref={dropdownRef}>
      <button
        className="social-links-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Portals link"
      >
        <img 
          src="/assets/portals.png" 
          alt="Portals" 
          className="portals-icon"
          onError={(e) => {
            console.error('Failed to load portals icon:', e);
            e.target.style.display = 'none';
            // Add fallback icon
            const fallbackIcon = document.createElement('div');
            fallbackIcon.innerHTML = '🌀';
            fallbackIcon.style.fontSize = '24px';
            fallbackIcon.style.color = '#fff';
            fallbackIcon.style.marginLeft = '8px';
            e.target.parentNode.appendChild(fallbackIcon);
          }}
        />
      </button>
      
      {isOpen && (
        <div className="social-links-dropdown">
          <div className="social-links-header">
            <h3>Breakverse Crew Hall</h3>
          </div>
          
          <div className="social-links-list">
            <a
              href="https://theportal.to/?room=83ab543d-59e0-4425-9b10-d9e5ab29212d"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-item portals-item"
              onClick={() => setIsOpen(false)}
            >
              <div className="social-link-icon">
                <img 
                  src="/assets/portals.png" 
                  alt="Portals" 
                  className="portals-icon-small"
                  onError={(e) => {
                    console.error('Failed to load portals icon in dropdown:', e);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="social-link-content">
                <h4>Enter metaverse</h4>
              </div>
              <FaExternalLinkAlt size={14} className="external-link-icon" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({ menuOpen, setMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, loading } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const docsRef = useRef(null);
  const isDocsVisible = !currentUser && (location.pathname === '/' || location.pathname.startsWith('/learnmore'));
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '');
  const docTitles = {
    summary: 'Summary',
    users: 'Users',
    moves: 'Moves',
    badges: 'Badges',
    battles: 'Battles',
    events: 'Events',
    notifications: 'Notifications',
    bulk: 'Bulk Submissions',
    api: 'API',
    client: 'Client',
    rules: 'System Rules',
    cta: 'Get Started',
  };
  const currentDocKey = (currentHash || '').replace('#', '') || 'summary';
  const currentDocTitle = docTitles[currentDocKey] || 'Summary';
  
  
  // Use real notifications hook
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(currentUser?._id);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  // Close Docs dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (docsRef.current && !docsRef.current.contains(e.target)) {
        setDocsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setDocsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Auto-close docs dropdown when navigating to another page
  useEffect(() => {
    setDocsOpen(false);
    setCurrentHash(window.location.hash || '');
  }, [location.pathname]);

  // Track hash changes (from LearnMore scroll syncing)
  useEffect(() => {
    const onHash = () => setCurrentHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      // Close dropdown immediately
      setNotificationsOpen(false);
      // Mark as read
      await markAsRead(notification._id);

      // Smooth-scroll to UB component (DashboardBadges) if message is about a battle
      const isBattleMsg = /battle/i.test(notification?.message || '') || /judg|video|opponent/i.test(notification?.message || '');
      if (isBattleMsg) {
        const goToUB = () => {
          // Delay to allow page render
          requestAnimationFrame(() => {
            const ubEl = document.querySelector('.mt-6'); // first UB block on Home
            if (ubEl && typeof ubEl.scrollIntoView === 'function') {
              ubEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
        };
        if (location.pathname !== '/dashboard') {
          navigate('/dashboard');
          setTimeout(goToUB, 350);
        } else {
          goToUB();
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  // Don't render header content while loading to prevent flash of wrong state
  if (loading) {
    return (
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <img src={logo} alt="Breakverse Logo" className="h-10 w-auto" width="120" height="30" decoding="async" />
          </div>
        </div>
      </nav>
    );
  }

  const handleLogoClick = (e) => {
    const targetPath = currentUser ? '/dashboard' : '/';
    setMenuOpen(false);
    if (location.pathname === targetPath) {
      e.preventDefault();
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <nav className={`nav ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-container">
        <Link to={currentUser ? "/dashboard" : "/"} className="logo" onClick={handleLogoClick}>
          <img src={logo} alt="Breakverse Logo" className="logo-img logo-white h-10 w-auto" width="120" height="30" decoding="async" />
          <img src={logoColor} alt="Breakverse Logo Colored" className="logo-img logo-color h-10 w-auto" width="120" height="30" decoding="async" />
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

              {isAdmin() && (
                <li><Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>Admin</Link></li>
              )}
            </ul>
          ) : (
            <ul className={`nav-links ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}>
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/learnmore" className={location.pathname.startsWith('/learnmore') ? 'active' : ''}>About</Link></li>
              <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Log In</Link></li>
              <li><Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Sign Up</Link></li>
            </ul>
          )}
        </div>

        {/* Mobile Docs dropdown - show on landing and learnmore when logged out */}
        {isDocsVisible && (
          <div className={`docs-menu-container ${docsOpen ? 'open' : ''}`} ref={docsRef}>
            <button
              className="docs-menu-btn"
              onClick={() => setDocsOpen((o) => !o)}
              aria-label="Docs menu"
            >
              <FaBook size={20} />
            </button>
            {/* Removed current section title next to the book icon on Learn More */}
            {docsOpen && (
              <div className="docs-dropdown">
                <div className="docs-dropdown-list">
                  <Link to="/learnmore#summary" onClick={() => setDocsOpen(false)}>Summary</Link>
                  <Link to="/learnmore#users" onClick={() => setDocsOpen(false)}>Users</Link>
                  <Link to="/learnmore#moves" onClick={() => setDocsOpen(false)}>Moves</Link>
                  <Link to="/learnmore#badges" onClick={() => setDocsOpen(false)}>Badges</Link>
                  <Link to="/learnmore#battles" onClick={() => setDocsOpen(false)}>Battles</Link>
                  <Link to="/learnmore#events" onClick={() => setDocsOpen(false)}>Events</Link>
                                  <Link to="/learnmore#notifications" onClick={() => setDocsOpen(false)}>Notifications</Link>
                <Link to="/learnmore#rules" onClick={() => setDocsOpen(false)}>System Rules</Link>
                  <Link to="/learnmore#cta" onClick={() => setDocsOpen(false)}>Get Started</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right-side icons container */}
        <div className="nav-right-container">
          {currentUser && (
            <div className="notification-container">
              <button
                className="notification-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <FaBell size={24} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <FaEnvelope size={20} />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification._id}
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-content">
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">
                              {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          {!notification.read && <div className="unread-indicator"></div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <SocialLinksDropdown />

          {currentUser && (
            <UserAvatarDropdown 
              user={currentUser} 
              onLogout={handleLogout}
            />
          )}
        </div>
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
