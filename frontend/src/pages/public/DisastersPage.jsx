import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  AlertTriangle,
  Map,
  RotateCcw,
  SlidersHorizontal,
  X,
  Search,
  CheckCircle2,
  TrendingUp,
  Activity,
  ShieldCheck,
  ChevronDown,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { reportsApi } from '../../services/api';
import DisasterCard from '../../components/disaster/DisasterCard';
import FilterPanel from '../../components/disaster/FilterPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { DISASTER_TYPES } from '../../utils/constants';

const INITIAL_FILTERS = {
  search: '',
  type: '',
  severity: '',
  status: '',
  district: '',
  verificationStatus: '',
};

const SEVERITY_WEIGHT = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const DisastersPage = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'severity' | 'oldest'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const [reportsRes, statsRes] = await Promise.all([
        reportsApi.getAll({ ...params, limit: 100 }),
        reportsApi.getStats(),
      ]);
      setReports(reportsRes.data.data);
      setTotal(reportsRes.data.total);
      setStats(statsRes.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(fetchReports, 250);
    return () => clearTimeout(debounce);
  }, [fetchReports]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchReports();
  };

  // Filter and sort reports
  const sortedReports = useMemo(() => {
    const list = [...reports];
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'severity') {
      list.sort((a, b) => (SEVERITY_WEIGHT[b.severity] || 0) - (SEVERITY_WEIGHT[a.severity] || 0));
    }
    return list;
  }, [reports, sortBy]);

  const activeFilters = Object.entries(filters).filter(([, v]) => v !== '');
  const hasFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Executive Command Header */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white pt-10 pb-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300">
                <span>🇱🇰</span>
                <span>National Emergency Database & Situational Log</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Active Disaster Reports
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                Real-time incident intelligence and verified threat tracking across all 25 districts in Sri Lanka.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/report"
                className="btn-danger py-3 px-5 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-red-600/20 pulse-emergency"
              >
                <AlertTriangle className="w-4 h-4" />
                Report an Incident
              </Link>
              <Link
                to="/map"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Map className="w-4 h-4 text-cyan-400" />
                View Map
              </Link>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all text-xs flex items-center gap-1.5"
                title="Refresh reports"
              >
                <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Strip */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <p className="text-slate-400 font-medium">Total Reports</p>
                <p className="text-xl font-black text-white mt-0.5">{stats.total}</p>
              </div>
              <div className="bg-slate-900/80 border border-red-900/40 p-3.5 rounded-xl">
                <p className="text-red-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Critical Hazards
                </p>
                <p className="text-xl font-black text-white mt-0.5">{stats.critical}</p>
              </div>
              <div className="bg-slate-900/80 border border-amber-900/40 p-3.5 rounded-xl">
                <p className="text-amber-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Investigating
                </p>
                <p className="text-xl font-black text-white mt-0.5">{stats.investigating}</p>
              </div>
              <div className="bg-slate-900/80 border border-emerald-900/40 p-3.5 rounded-xl">
                <p className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Resolved
                </p>
                <p className="text-xl font-black text-white mt-0.5">{stats.resolved}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Quick Filter Presets Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Quick Presets:
          </span>
          <button
            onClick={() => handleClearFilters()}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              !hasFilters
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => handleFilterChange('severity', filters.severity === 'critical' ? '' : 'critical')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filters.severity === 'critical'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Critical Only
          </button>
          <button
            onClick={() => handleFilterChange('type', filters.type === 'Flood' ? '' : 'Flood')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filters.type === 'Flood'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🌊 Floods
          </button>
          <button
            onClick={() => handleFilterChange('type', filters.type === 'Landslide' ? '' : 'Landslide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filters.type === 'Landslide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ⛰️ Landslides
          </button>
          <button
            onClick={() => handleFilterChange('type', filters.type === 'Heavy Rain' ? '' : 'Heavy Rain')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filters.type === 'Heavy Rain'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🌧️ Heavy Rain
          </button>
          <button
            onClick={() => handleFilterChange('type', filters.type === 'Road Blockage' ? '' : 'Road Blockage')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filters.type === 'Road Blockage'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🚧 Road Blocks
          </button>
          <button
            onClick={() =>
              handleFilterChange(
                'verificationStatus',
                filters.verificationStatus === 'verified' ? '' : 'verified'
              )
            }
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              filters.verificationStatus === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified by DMC
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />

              {/* Emergency Hotline Tip Card */}
              <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-1.5 text-red-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" /> Immediate Danger?
                </div>
                <p className="text-xs text-red-900 leading-relaxed mb-3">
                  Do not rely solely on online reports during life-threatening floods or landslides.
                </p>
                <a
                  href="tel:117"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  Call 117 (DMC Dispatch)
                </a>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Display & Control Toolbar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-5 flex flex-wrap items-center justify-between gap-4">
              {/* Left: Count and Active Indicators */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {hasFilters && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </button>

                <p className="text-xs sm:text-sm text-slate-600">
                  Showing <strong className="text-slate-900 font-bold">{sortedReports.length}</strong> {sortedReports.length === 1 ? 'incident' : 'incidents'}
                  {hasFilters && (
                    <span className="text-slate-500 font-normal"> (filtered from {total})</span>
                  )}
                </p>
              </div>

              {/* Right: Sort Dropdown and View Switcher */}
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="severity">Highest Severity</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Detailed List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-slate-500 font-medium">Active criteria:</span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg">
                    Keyword: "{filters.search}"
                    <button onClick={() => handleFilterChange('search', '')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.type && (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg">
                    Type: {filters.type}
                    <button onClick={() => handleFilterChange('type', '')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.severity && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg capitalize">
                    Severity: {filters.severity}
                    <button onClick={() => handleFilterChange('severity', '')} className="hover:text-amber-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.district && (
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-1 rounded-lg">
                    District: {filters.district}
                    <button onClick={() => handleFilterChange('district', '')} className="hover:text-slate-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-1 rounded-lg capitalize">
                    Status: {filters.status}
                    <button onClick={() => handleFilterChange('status', '')} className="hover:text-slate-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.verificationStatus && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg capitalize">
                    Status: {filters.verificationStatus}
                    <button onClick={() => handleFilterChange('verificationStatus', '')} className="hover:text-emerald-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Reports List/Grid */}
            {loading ? (
              <div className="py-20">
                <LoadingSpinner message="Querying live emergency reports database..." />
              </div>
            ) : error ? (
              <ErrorMessage
                message="We encountered an issue connecting to the disaster registry. Please try again."
                onRetry={fetchReports}
              />
            ) : sortedReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Disaster Reports Found</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {hasFilters
                    ? 'No incidents match your selected filters. Try clearing some criteria or searching for another district.'
                    : 'There are currently no incidents recorded in the system.'}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  {hasFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="btn-outline text-xs font-bold py-2.5 px-4 rounded-xl"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <Link
                    to="/report"
                    className="btn-danger text-xs font-bold py-2.5 px-4 rounded-xl"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Report New Incident
                  </Link>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedReports.map((report) => (
                  <DisasterCard key={report._id} report={report} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {sortedReports.map((report) => (
                  <DisasterCard key={report._id} report={report} viewMode="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Filter Reports</h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisastersPage;
