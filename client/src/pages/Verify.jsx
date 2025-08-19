import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stateEmail = location.state?.email;
    const saved = localStorage.getItem('pending_verification_email');
    if (stateEmail) setEmail(stateEmail);
    else if (saved) setEmail(saved);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !code || code.length !== 4) {
      setError('Enter your email and 4-digit code.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.verify(email, code);
      localStorage.removeItem('pending_verification_email');
      navigate('/verify-success');
    } catch (err) {
      setError(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src="/assets/logo-white.png" alt="Breakverse" className="register-logo" />
          <h2>Verify your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input id="email" name="email" type="email" className="form-input" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="code">4-digit code</label>
            <div className="input-wrapper">
              <input id="code" name="code" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} className="form-input" placeholder="0000" value={code} onChange={(e)=>setCode(e.target.value.replace(/[^0-9]/g, '').slice(0,4))} required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="register-button">{loading ? 'Verifying…' : 'Verify'}</button>
        </form>
        <div className="register-footer">
          <p>Entered the wrong email? <Link to="/register">Register again</Link></p>
        </div>
      </div>
    </div>
  );
}


