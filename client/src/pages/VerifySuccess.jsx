import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifySuccess() {
  const navigate = useNavigate();

  useEffect(() => {
             // Redirect directly to moves page for first time users
         const timer = setTimeout(() => {
           navigate('/moves');
         }, 2000); // 2 second delay to show success message

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src="/assets/logo-white.png" alt="Breakverse" className="register-logo" />
          <h2>Account verified!</h2>
        </div>
        <div className="register-form">
          <p>Your account has been verified successfully! Redirecting you to Breakverse...</p>
          <div className="loading-spinner" style={{ margin: '20px auto', width: '40px', height: '40px' }}></div>
        </div>
      </div>
    </div>
  );
}


