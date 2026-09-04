import { Search } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title = 'No results found',
  message = 'Try adjusting your search criteria or filters.',
  icon: Icon = Search,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200/80 shadow-inner">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">{title}</h3>
    <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{message}</p>
    {actionLabel && onAction && (
      <Button variant="primary" size="sm" icon={actionIcon} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
