import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid } from 'lucide-react';
import { reportsApi } from '../../services/api';
import DisasterCard from '../../components/disaster/DisasterCard';
import FilterPanel from '../../components/disaster/FilterPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const INITIAL_FILTERS = { search: '', type: '', severity: '', status: '', district: '' };

const DisastersPage = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const res = await reportsApi.getAll({ ...params, limit: 50 });
      setReports(res.data.data);
      setTotal(res.data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(fetchReports, 300);
    return () => clearTimeout(debounce);
  }, [fetchReports]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => setFilters(INITIAL_FILTERS);

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Disaster Reports</h1>
          </div>
          <p className="text-slate-500">
            Browse and search reported incidents across Sri Lanka.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Reports Grid */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  {hasFilters ? (
                    <><strong className="text-slate-700">{total}</strong> results found</>
                  ) : (
                    <><strong className="text-slate-700">{total}</strong> total reports</>
                  )}
                </p>
                {hasFilters && (
                  <button onClick={handleClearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <LoadingSpinner message="Loading disaster reports..." />
            ) : error ? (
              <ErrorMessage
                message="We couldn't load the disaster reports. Please try again."
                onRetry={fetchReports}
              />
            ) : reports.length === 0 ? (
              <EmptyState
                title="No disaster reports found"
                message={hasFilters ? 'Try changing your filters or search term.' : 'No reports have been submitted yet.'}
              />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <DisasterCard key={report._id} report={report} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisastersPage;
