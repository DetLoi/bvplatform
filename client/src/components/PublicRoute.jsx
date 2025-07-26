import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated, show the public route
  return children;
} 