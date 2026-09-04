import { Search, Filter, X } from 'lucide-react';
import { DISASTER_TYPES, SRI_LANKA_DISTRICTS } from '../../utils/constants';

const FilterPanel = ({ filters, onChange, onClear }) => {
  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700 text-sm">Filter Reports</span>
        </div>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search incidents..."
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>

        {/* Disaster Type */}
        <select
          value={filters.type}
          onChange={(e) => onChange('type', e.target.value)}
          className="input-field py-2.5 text-sm"
        >
          <option value="">All Disaster Types</option>
          {DISASTER_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Severity */}
        <select
          value={filters.severity}
          onChange={(e) => onChange('severity', e.target.value)}
          className="input-field py-2.5 text-sm"
        >
          <option value="">All Severity Levels</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
          className="input-field py-2.5 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* District */}
        <select
          value={filters.district}
          onChange={(e) => onChange('district', e.target.value)}
          className="input-field py-2.5 text-sm"
        >
          <option value="">All Districts</option>
          {SRI_LANKA_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
