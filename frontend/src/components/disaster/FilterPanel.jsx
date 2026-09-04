import { Search, Filter, X, RotateCcw, MapPin, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { DISASTER_TYPES, SRI_LANKA_DISTRICTS } from '../../utils/constants';

const FilterPanel = ({ filters, onChange, onClear }) => {
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => k !== 'search' && v !== '').length;
  const hasAnyFilter = Object.values(filters).some((v) => v !== '');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Filter Incidents</h3>
            {activeFilterCount > 0 && (
              <p className="text-[11px] font-semibold text-blue-600">
                {activeFilterCount} active criteria
              </p>
            )}
          </div>
        </div>

        {hasAnyFilter && (
          <button
            onClick={onClear}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search by Keywords */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Keyword Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange('search', e.target.value)}
              placeholder="Search area, road, flood..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
            />
            {filters.search && (
              <button
                onClick={() => onChange('search', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Disaster Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Disaster Type</span>
            {filters.type && (
              <button onClick={() => onChange('type', '')} className="text-[11px] text-slate-400 hover:text-slate-600 lowercase font-normal">
                clear
              </button>
            )}
          </label>
          <select
            value={filters.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
          >
            <option value="">All Incident Types</option>
            {DISASTER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Severity Level
            </span>
            {filters.severity && (
              <button onClick={() => onChange('severity', '')} className="text-[11px] text-slate-400 hover:text-slate-600 lowercase font-normal">
                clear
              </button>
            )}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'critical', label: 'Critical', dot: 'bg-red-500' },
              { id: 'high', label: 'High', dot: 'bg-orange-500' },
              { id: 'medium', label: 'Medium', dot: 'bg-yellow-500' },
              { id: 'low', label: 'Low', dot: 'bg-emerald-500' },
            ].map((sev) => {
              const active = filters.severity === sev.id;
              return (
                <button
                  key={sev.id}
                  type="button"
                  onClick={() => onChange('severity', active ? '' : sev.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sev.dot}`}></span>
                  <span>{sev.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              District
            </span>
            {filters.district && (
              <button onClick={() => onChange('district', '')} className="text-[11px] text-slate-400 hover:text-slate-600 lowercase font-normal">
                clear
              </button>
            )}
          </label>
          <select
            value={filters.district}
            onChange={(e) => onChange('district', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
          >
            <option value="">All 25 Districts</option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Operational Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              Action Status
            </span>
            {filters.status && (
              <button onClick={() => onChange('status', '')} className="text-[11px] text-slate-400 hover:text-slate-600 lowercase font-normal">
                clear
              </button>
            )}
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="pending">🕐 Pending Action</option>
            <option value="investigating">🔍 Investigating / Response Active</option>
            <option value="resolved">✅ Resolved / Hazard Cleared</option>
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verification
            </span>
            {filters.verificationStatus && (
              <button onClick={() => onChange('verificationStatus', '')} className="text-[11px] text-slate-400 hover:text-slate-600 lowercase font-normal">
                clear
              </button>
            )}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                onChange(
                  'verificationStatus',
                  filters.verificationStatus === 'verified' ? '' : 'verified'
                )
              }
              className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                filters.verificationStatus === 'verified'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Verified
            </button>
            <button
              type="button"
              onClick={() =>
                onChange(
                  'verificationStatus',
                  filters.verificationStatus === 'pending' ? '' : 'pending'
                )
              }
              className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                filters.verificationStatus === 'pending'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Unverified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
