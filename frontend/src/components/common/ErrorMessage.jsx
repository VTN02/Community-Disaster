import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = "We couldn't load the data. Please try again.", onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">Something went wrong</h3>
    <p className="text-slate-500 max-w-sm mb-6">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-outline btn-sm">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
