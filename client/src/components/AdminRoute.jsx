import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and is admin, show the route
  return children;
} 