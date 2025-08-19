import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-stone-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link 
          to="/" 
          className="inline-block bg-stone-700 hover:bg-stone-600 text-stone-100 px-6 py-3 rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
