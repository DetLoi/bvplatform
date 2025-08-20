import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { authAPI, newsletterAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import NewsletterToggle from '../components/NewsletterToggle';
import '../styles/pages/register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleContainerClick = () => {
    setNewsletterSubscribed(!newsletterSubscribed);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    const checks = passwordChecks;
    const allValid = Object.values(checks).every(Boolean);
    if (!allValid) {
      setError('Please meet all password requirements.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // Subscribe to newsletter if user opted in
      if (newsletterSubscribed) {
        try {
          await newsletterAPI.subscribe(formData.email);
        } catch (newsletterErr) {
          console.error('Newsletter subscription failed:', newsletterErr);
          // Don't block registration if newsletter fails
        }
      }
      
      // store email for verification step
      localStorage.setItem('pending_verification_email', formData.email);
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = useMemo(() => {
    const pwd = formData.password || '';
    return {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>_\-\\/\[\];'`~+=]/.test(pwd),
    };
  }, [formData.password]);

  return (
    <div className="register-page">
      <Link to="/" className="back-link">
        <FaArrowLeft />
      </Link>
        {/* 7-dages gratis prøve banner */}
        <div
          style={{
            color: '#ffd700',
            fontWeight: 800,
            textAlign: 'center',
            margin: '2rem 0 20px 0',
            letterSpacing: '0.06em'
          }}
        >
          <span style={{ borderBottom: '2px solid #ffd700', paddingBottom: 2 }}>ALPHA TEST RELEASE FREE</span>
        </div>
      <div className="register-container" onClick={handleContainerClick}>
        <div className="register-header">
          <img src="/assets/logo-white.png" alt="Breakverse" className="register-logo" />
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Bboy/bgirl name</label>
            <div className="input-wrapper">
              <div className="input-icon-container"><FaUser /></div>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Benji Lee"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <div className="input-icon-container"><FaUser /></div>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                placeholder="yourname"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <div className="input-icon-container"><FaEnvelope /></div>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <div className="input-icon-container"><FaLock /></div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={`password-requirements ${passwordFocused || formData.password ? 'show' : ''}`}>
              <ul>
                <li className={passwordChecks.length ? 'ok' : 'bad'}>
                  {passwordChecks.length ? <FaCheck /> : <FaTimes />} At least 8 characters
                </li>
                <li className={passwordChecks.upper ? 'ok' : 'bad'}>
                  {passwordChecks.upper ? <FaCheck /> : <FaTimes />} One uppercase letter (A-Z)
                </li>
                <li className={passwordChecks.lower ? 'ok' : 'bad'}>
                  {passwordChecks.lower ? <FaCheck /> : <FaTimes />} One lowercase letter (a-z)
                </li>
                <li className={passwordChecks.number ? 'ok' : 'bad'}>
                  {passwordChecks.number ? <FaCheck /> : <FaTimes />} One number (0-9)
                </li>
                <li className={passwordChecks.special ? 'ok' : 'bad'}>
                  {passwordChecks.special ? <FaCheck /> : <FaTimes />} One special character (!@#$...)
                </li>
              </ul>
            </div>
          </div>

          <NewsletterToggle
            isChecked={newsletterSubscribed}
            onChange={setNewsletterSubscribed}
            label="Subscribe to our newsletter"
            description="Stay updated with the latest breaking news, events, and tips"
          />

          <div className="terms-text">
            You accept our{' '}
            <Link to="/terms" target="_blank" className="terms-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/policy" target="_blank" className="terms-link">
              Privacy Policy
            </Link>{' '}
            when you create account
          </div>

          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          {/* Pricing information */}
          <p style={{ marginTop: 10, fontSize: 12, color: '#cfcfcf', lineHeight: 1.4 }}>
            After the 7-day free trial, it costs $5/month to have a registered user.
            Participate in battles to earn points and get free access.
          </p>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}


