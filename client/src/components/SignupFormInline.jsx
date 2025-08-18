import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function SignupFormInline() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

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
      await authAPI.register(formData);
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
      special: /[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(pwd),
    };
  }, [formData.password]);

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 16, display: 'grid', gap: 10, position: 'relative' }}>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Create your account</div>
      {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#fee2e2', padding: 8, borderRadius: 8 }}>{error}</div>}
      <input name="name" placeholder="Full name" value={formData.name} onChange={handleChange} style={inputStyle} required />
      <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} style={inputStyle} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} required />
      <div style={{ display: 'grid', gap: 6 }}>
        <input name="password" type="password" placeholder="Password (min 8 chars)" value={formData.password} onChange={handleChange} style={inputStyle} minLength={8} required onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
        <div style={{ display: passwordFocused || formData.password ? 'block' : 'none', background: 'rgba(17,17,17,0.85)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 10 }}>
          <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'none', display: 'grid', gap: 6 }}>
            <li style={reqItemStyle(passwordChecks.length)}>{passwordChecks.length ? <FaCheck size={12} /> : <FaTimes size={12} />} <span style={{ marginLeft: 6 }}>At least 8 characters</span></li>
            <li style={reqItemStyle(passwordChecks.upper)}>{passwordChecks.upper ? <FaCheck size={12} /> : <FaTimes size={12} />} <span style={{ marginLeft: 6 }}>One uppercase letter (A-Z)</span></li>
            <li style={reqItemStyle(passwordChecks.lower)}>{passwordChecks.lower ? <FaCheck size={12} /> : <FaTimes size={12} />} <span style={{ marginLeft: 6 }}>One lowercase letter (a-z)</span></li>
            <li style={reqItemStyle(passwordChecks.number)}>{passwordChecks.number ? <FaCheck size={12} /> : <FaTimes size={12} />} <span style={{ marginLeft: 6 }}>One number (0-9)</span></li>
            <li style={reqItemStyle(passwordChecks.special)}>{passwordChecks.special ? <FaCheck size={12} /> : <FaTimes size={12} />} <span style={{ marginLeft: 6 }}>One special character (!@#$…)</span></li>
          </ul>
        </div>
      </div>
      <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Creating…' : 'Create account'}</button>
      <div style={{ fontSize: 12, opacity: 0.8 }}>By continuing, you agree to our Privacy Policy.</div>
    </form>
  );
}

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#e7ecf5',
  padding: '10px 12px',
  borderRadius: 10,
  outline: 'none'
};

const btnStyle = {
  background: 'linear-gradient(90deg, #ffd700, #ffb347)',
  color: '#0b0b0c',
  fontWeight: 800,
  padding: '12px 14px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 24px rgba(255, 215, 0, 0.2)'
};

const reqItemStyle = (ok) => ({
  display: 'flex', alignItems: 'center', color: ok ? '#d1fae5' : '#fecaca'
});


