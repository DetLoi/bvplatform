import { Link } from 'react-router-dom';

export default function VerifySuccess() {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src="/assets/logo-white.png" alt="Breakverse" className="register-logo" />
          <h2>Account verified!</h2>
        </div>
        <div className="register-form">
          <p>Your account has been verified successfully. You can now log in.</p>
          <Link to="/login" className="register-button" style={{ display: 'inline-block', textAlign: 'center' }}>Go to Login</Link>
        </div>
      </div>
    </div>
  );
}


