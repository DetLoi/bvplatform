import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If route requires authentication and user is not logged in
  if (requireAuth && !currentUser) {
    // Redirect to login page, but save the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is for non-authenticated users and user is logged in
  if (!requireAuth && currentUser) {
    // Redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and can access the route
  return children;
} 