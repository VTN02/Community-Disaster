import { Search } from 'lucide-react';

const EmptyState = ({ title = 'No results found', message = 'Try changing your search or filters.', icon: Icon = Search }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm">{message}</p>
  </div>
);

export default EmptyState;
