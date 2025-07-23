import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      background: '#111',
      padding: '0.75rem 1.5rem',
      color: '#00ffc3',
      fontWeight: 'bold',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      zIndex: 200,
      animation: 'pulseFeedback 0.4s ease'
    }}>
      {message}
    </div>
  );
}
