import { Loader2 } from 'lucide-react';

const Loader = ({
  message = 'Loading...',
  fullScreen = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size] || 'w-8 h-8';

  const content = (
    <div className={`flex flex-col items-center justify-center p-8 text-center animate-fade-in ${className}`}>
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-inner">
          <Loader2 className={`${sizeClasses} text-blue-600 animate-spin`} />
        </div>
      </div>
      {message && <p className="text-xs sm:text-sm font-semibold text-slate-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50/90 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
