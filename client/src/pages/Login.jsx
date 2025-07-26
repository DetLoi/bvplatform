import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Redirect based on user status
        if (result.user.status === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Der opstod en fejl under login. Prøv venligst igen.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="back-link">
            <FaArrowLeft />
            Tilbage til Hjem
          </Link>
          <h1>Velkommen</h1>
          <p>Log ind for at fortsætte din breaking rejse</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Brugernavn</label>
            <div className="input-wrapper">
              <div className="input-icon-container">
                <FaUser />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Indtast dit brugernavn"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Adgangskode</label>
            <div className="input-wrapper">
              <div className="input-icon-container">
                <FaLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Indtast din adgangskode"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Logger Ind...' : 'Log Ind'}
          </button>
        </form>

        <div className="login-footer">
          <p>Har du ikke en konto? <Link to="/register">Tilmeld dig</Link></p>
          <p><Link to="/forgot-password">Glemt adgangskode?</Link></p>
        </div>
      </div>

      <div className="login-background">
        <div className="background-elements">
          <div className="floating-element element-1">💪</div>
          <div className="floating-element element-2">🏆</div>
          <div className="floating-element element-3">🎵</div>
          <div className="floating-element element-4">🔥</div>
        </div>
      </div>
    </div>
  );
} 