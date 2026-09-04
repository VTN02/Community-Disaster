import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { reportsApi, assignmentsApi } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminReportModal from '../../components/admin/AdminReportModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { showToast } from '../../components/common/Toast';
import { DISASTER_TYPES, SRI_LANKA_DISTRICTS, timeAgo } from '../../utils/constants';

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = ['pending', 'investigating', 'resolved', 'rejected'];
const VERIFICATION_OPTIONS = ['pending', 'verified', 'rejected'];

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
      <h3 className="font-bold text-slate-900 text-base mb-2">Confirm Action</h3>
      <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-2.5">
        <Button variant="outline" size="sm" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" fullWidth onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  </div>
);

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    severity: '',
    status: '',
    verificationStatus: '',
    district: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dispatchLoading, setDispatchLoading] = useState({});

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const res = await reportsApi.getAll({ ...params, limit: 100 });
      setReports(res.data.data);
      setTotal(res.data.total);
    } catch {
      showToast('Failed to load reports.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchReports, 300);
    return () => clearTimeout(t);
  }, [fetchReports]);

  const handleVerify = async (id) => {
    try {
      await reportsApi.verify(id, { verificationStatus: 'verified' });
      showToast('Report verified successfully.', 'success');
      fetchReports();
    } catch {
      showToast('Failed to verify report.', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await reportsApi.verify(id, { verificationStatus: 'rejected' });
      showToast('Report rejected.', 'info');
      fetchReports();
    } catch {
      showToast('Failed to reject report.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await reportsApi.delete(id);
      showToast('Report deleted from database.', 'success');
      setDeleteConfirm(null);
      fetchReports();
    } catch {
      showToast('Failed to delete report.', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await reportsApi.updateStatus(id, { status });
      showToast(`Status updated to ${status}.`, 'success');
      fetchReports();
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleSeverityChange = async (id, severity) => {
    try {
      await reportsApi.update(id, { severity });
      showToast(`Severity adjusted to ${severity}.`, 'success');
      fetchReports();
    } catch {
      showToast('Failed to update severity.', 'error');
    }
  };

  const handleAutoDispatch = async (reportId) => {
    setDispatchLoading((prev) => ({ ...prev, [reportId]: true }));
    try {
      const res = await assignmentsApi.autoMatch(reportId);
      if (res.data.success) {
        showToast(
          `Dispatched to ${res.data.data.subGroupId?.name || res.data.data.teamId?.teamName || 'Help Team'} (${res.data.data.assignmentType})!`,
          'success'
        );
        fetchReports();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to dispatch team', 'error');
    } finally {
      setDispatchLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      severity: '',
      status: '',
      verificationStatus: '',
      district: '',
    });
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Disaster Incident Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify, triage, update severities, and dispatch nearest Help Teams to reported incidents.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchReports}
            loading={loading}
          >
            Refresh Database
          </Button>
        </div>

        {/* Filter Controls Bar */}
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search description, district, town..."
                className="input-field text-xs pl-9 py-2"
              />
            </div>

            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input-field text-xs py-2"
            >
              <option value="">All Categories</option>
              {DISASTER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Severity */}
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="input-field text-xs py-2"
            >
              <option value="">All Severities</option>
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field text-xs py-2"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* District */}
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="input-field text-xs py-2"
            >
              <option value="">All Districts</option>
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Filtered view active (<strong>{total}</strong> records)
              </span>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </Card>

        {/* Reports Table / Card Container */}
        <Card>
          {loading ? (
            <LoadingSpinner message="Scanning incident logs..." />
          ) : reports.length === 0 ? (
            <EmptyState
              title="No Disaster Reports Found"
              message="No incident records match the current filter criteria."
              actionLabel={hasFilters ? 'Reset Filters' : undefined}
              onAction={hasFilters ? clearFilters : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <th className="p-3.5">Category & Location</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Reported</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Category & Location */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{report.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-slate-700">{report.district}</span>
                          {report.area && <span>· {report.area}</span>}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 max-w-xs mt-1">
                          {report.description}
                        </p>
                      </td>

                      {/* Severity */}
                      <td className="p-3.5">
                        <select
                          value={report.severity}
                          onChange={(e) => handleSeverityChange(report._id, e.target.value)}
                          className="text-[11px] font-bold rounded-lg border border-slate-200 bg-white px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {SEVERITY_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.toUpperCase()}</option>
                          ))}
                        </select>
                      </td>

                      {/* Verification Status */}
                      <td className="p-3.5">
                        <Badge
                          variant={
                            report.verificationStatus === 'verified'
                              ? 'success'
                              : report.verificationStatus === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {report.verificationStatus || 'pending'}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report._id, e.target.value)}
                          className="text-[11px] font-bold rounded-lg border border-slate-200 bg-white px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Reported Time */}
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        <span className="font-medium">{timeAgo(report.createdAt)}</span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Dispatch Team Button */}
                          <button
                            type="button"
                            onClick={() => handleAutoDispatch(report._id)}
                            disabled={dispatchLoading[report._id]}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Auto-Dispatch Nearest Help Team"
                          >
                            <Sparkles className={`w-4 h-4 ${dispatchLoading[report._id] ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Quick Verify */}
                          {report.verificationStatus !== 'verified' && (
                            <button
                              type="button"
                              onClick={() => handleVerify(report._id)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Verify Report"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {report.verificationStatus !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleReject(report._id)}
                              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Reject Report"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* View Full Dossier */}
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(report._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Incident Detail / Edit Modal */}
        {selectedReport && (
          <AdminReportModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onUpdate={() => {
              setSelectedReport(null);
              fetchReports();
            }}
            onDelete={() => {
              setSelectedReport(null);
              fetchReports();
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <ConfirmModal
            message="Are you sure you want to permanently delete this disaster report? This action cannot be reversed."
            onConfirm={() => handleDelete(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminReports;
