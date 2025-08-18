import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import '../styles/pages/verify-password.css';

export default function VerifyPassword() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('verify'); // 'verify' or 'reset'
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email, redirect back to forgot password
      navigate('/forgot-password');
    }
  }, [location.state, navigate]);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For development, use hardcoded code 4444
      if (code === '4444') {
        setStep('reset');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be an actual API call
      // const response = await authAPI.resetPassword(email, code, newPassword);
      
      // Simulate success and redirect to login
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successfully! Please log in with your new password.' 
          } 
        });
      }, 1500);
      
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCode(value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (step === 'verify') {
    return (
      <div className="verify-password-page">
        <Link to="/forgot-password" className="back-link">
          <FaArrowLeft />
          Back to Forgot Password
        </Link>
        
        <div className="verify-password-container">
          <div className="verify-password-header">
            <img src="/src/assets/logo-white.png" alt="Breakverse" className="verify-password-logo" />
            <h1>Verify Code</h1>
            <p>Enter the 4-digit verification code sent to <strong>{email}</strong></p>
          </div>

          <form onSubmit={handleCodeSubmit} className="verify-password-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <div className="input-wrapper">
                <div className="input-icon-container">
                  <FaKey />
                </div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  className="form-input"
                  placeholder="0000"
                  value={code}
                  onChange={handleCodeChange}
                  required
                />
              </div>
              <div className="code-hint">
                <small>Development mode: Use code <strong>4444</strong></small>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 4}
              className="submit-button"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="verify-password-footer">
            <p>Didn't receive the code? <Link to="/forgot-password">Resend</Link></p>
            <p><Link to="/login">Back to Login</Link></p>
          </div>
        </div>

        <div className="verify-password-background">
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

  return (
    <div className="verify-password-page">
      <Link to="/forgot-password" className="back-link">
        <FaArrowLeft />
        Back to Forgot Password
      </Link>
      
      <div className="verify-password-container">
        <div className="verify-password-header">
          <img src="/src/assets/logo-white.png" alt="Breakverse" className="verify-password-logo" />
          <h1>Reset Password</h1>
          <p>Create a new password for your account</p>
        </div>

        <form onSubmit={handlePasswordReset} className="verify-password-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <div className="input-icon-container">
                <FaLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <div className="input-icon-container">
                <FaLock />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="password-toggle"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="submit-button"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="verify-password-footer">
          <p><Link to="/login">Back to Login</Link></p>
        </div>
      </div>

      <div className="verify-password-background">
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
