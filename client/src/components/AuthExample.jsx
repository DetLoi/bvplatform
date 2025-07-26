import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Example component demonstrating proper authentication usage
 * This is for reference only - not used in the actual app
 */
export default function AuthExample() {
  const { currentUser, login, logout, isAdmin, loading } = useAuth();

  // Always check loading state first
  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Loading Authentication...</h2>
        <LoadingSpinner />
      </div>
    );
  }

  // Handle logged out state
  if (!currentUser) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Not Logged In</h2>
        <p className="mb-4">You need to log in to access this content.</p>
        <button 
          onClick={() => login('demo', 'password')}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Demo Login
        </button>
      </div>
    );
  }

  // Handle logged in state
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Welcome, {currentUser.username}!</h2>
      
      <div className="mb-4">
        <p><strong>User ID:</strong> {currentUser.id}</p>
        <p><strong>Status:</strong> {currentUser.status}</p>
        <p><strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}</p>
      </div>

      {/* Show admin-specific content */}
      {isAdmin() && (
        <div className="mb-4 p-4 bg-yellow-900 rounded">
          <h3 className="font-bold mb-2">Admin Panel</h3>
          <p>This content is only visible to admin users.</p>
        </div>
      )}

      <button 
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

/**
 * Example of a component that requires authentication
 */
export function ProtectedComponent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <div className="p-4 bg-red-900 rounded">
        <p>This component requires authentication.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-900 rounded">
      <p>Welcome, {currentUser.username}! This is protected content.</p>
    </div>
  );
}

/**
 * Example of a component that requires admin privileges
 */
export function AdminComponent() {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <div className="p-4 bg-red-900 rounded">
        <p>This component requires authentication.</p>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="p-4 bg-yellow-900 rounded">
        <p>This component requires admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-purple-900 rounded">
      <p>Welcome, Admin {currentUser.username}! This is admin-only content.</p>
    </div>
  );
} 