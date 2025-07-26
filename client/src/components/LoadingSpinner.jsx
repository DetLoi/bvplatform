export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-stone-100 ${sizeClasses[size]}`}></div>
    </div>
  );
} 