import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import '../styles/pages/forgot-password.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be an actual API call
      // const response = await authAPI.forgotPassword(email);
      
      // For now, just simulate success
      setSuccess(true);
      
      // Navigate to verification page with email
      setTimeout(() => {
        navigate('/verify-password', { state: { email } });
      }, 1500);
      
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="forgot-password-page">
      <Link to="/login" className="back-link">
        <FaArrowLeft />
        Back to Login
      </Link>
      
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <img src="/src/assets/logo-white.png" alt="Breakverse" className="forgot-password-logo" />
          <h1>Forgot Password</h1>
          <p>Enter your email address and we'll send you a verification code to reset your password.</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon-container">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Email Sent!</h3>
            <p>We've sent a verification code to <strong>{email}</strong></p>
            <p>Redirecting to verification page...</p>
          </div>
        )}

        <div className="forgot-password-footer">
          <p>Remember your password? <Link to="/login">Log in</Link></p>
        </div>
      </div>

      <div className="forgot-password-background">
        <div className="background-elements">
          <div className="floating-element element-1">🔐</div>
          <div className="floating-element element-2">📧</div>
          <div className="floating-element element-3">🔑</div>
          <div className="floating-element element-4">✨</div>
        </div>
      </div>
    </div>
  );
}
