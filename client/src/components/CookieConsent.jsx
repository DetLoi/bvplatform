import { useEffect, useState } from 'react';
import { FaCookieBite } from 'react-icons/fa';

const STORAGE_KEY = 'breakverse_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const setChoice = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-content">
        <div className="cookie-icon"><FaCookieBite /></div>
        <div className="cookie-text">
          <strong>Cookies</strong> help us improve Breakverse. We use them for essential features and analytics.
          See our <a href="/policy">Privacy Policy</a> for details.
        </div>
      </div>
      <div className="cookie-actions">
        <button className="cookie-btn secondary" onClick={() => setChoice('rejected')}>
          Reject
        </button>
        <button className="cookie-btn primary" onClick={() => setChoice('accepted')}>
          Accept
        </button>
      </div>
    </div>
  );
}


