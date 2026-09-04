import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CheckCircle, XCircle, Eye, ChevronDown, Filter, RefreshCw } from 'lucide-react';
import { reportsApi } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminReportModal from '../../components/admin/AdminReportModal';
import SeverityBadge from '../../components/common/SeverityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { showToast } from '../../components/common/Toast';
import { DISASTER_ICONS, VERIFICATION_CONFIG, timeAgo, DISASTER_TYPES, SRI_LANKA_DISTRICTS } from '../../utils/constants';

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = ['pending', 'investigating', 'resolved', 'rejected'];
const VERIFICATION_OPTIONS = ['pending', 'verified', 'rejected'];

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
      <h3 className="font-bold text-slate-900 mb-2">Confirm Action</h3>
      <p className="text-slate-600 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-ghost border border-slate-200 flex-1 justify-center">Cancel</button>
        <button onClick={onConfirm} className="btn-danger flex-1 justify-center">Confirm</button>
      </div>
    </div>
  </div>
);

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', severity: '', status: '', verificationStatus: '', district: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

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
      showToast('Report deleted.', 'success');
      setDeleteConfirm(null);
      fetchReports();
    } catch {
      showToast('Failed to delete report.', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await reportsApi.updateStatus(id, { status });
      showToast('Status updated.', 'success');
      fetchReports();
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleSeverityChange = async (id, severity) => {
    try {
      await reportsApi.update(id, { severity });
      showToast('Severity updated.', 'success');
      fetchReports();
    } catch {
      showToast('Failed to update severity.', 'error');
    }
  };

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val }));

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Report Management</h1>
            <p className="text-slate-500 text-sm mt-1">{total} total reports</p>
          </div>
          <button onClick={fetchReports} className="btn-ghost border border-slate-200">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="input-field py-2 text-sm col-span-2 md:col-span-1"
            />
            <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Types</option>
              {DISASTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filters.severity} onChange={(e) => setFilter('severity', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Severity</option>
              {SEVERITY_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <select value={filters.verificationStatus} onChange={(e) => setFilter('verificationStatus', e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Verification</option>
              {VERIFICATION_OPTIONS.map((v) => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
            <button onClick={() => setFilters({ search: '', type: '', severity: '', status: '', verificationStatus: '', district: '' })}
              className="btn-ghost text-sm border border-slate-200 justify-center">
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner message="Loading reports..." />
        ) : reports.length === 0 ? (
          <EmptyState title="No reports found" message="Try changing your filters." />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Location</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Severity</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Verification</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Reported</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className="flex items-center gap-2 text-left group"
                          title="Click to view details in popup"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">{DISASTER_ICONS[report.type] || '⚠️'}</span>
                          <span className="font-semibold text-slate-800 group-hover:text-blue-600 underline-offset-2 group-hover:underline">
                            {report.type}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p className="font-medium">{report.district}</p>
                        {report.area && <p className="text-xs text-slate-400">{report.area}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={report.severity}
                          onChange={(e) => handleSeverityChange(report._id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {SEVERITY_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report._id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge border ${VERIFICATION_CONFIG[report.verificationStatus]?.color || 'bg-slate-100 text-slate-600'}`}>
                          {report.verificationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{timeAgo(report.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View report details in popup"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {report.verificationStatus === 'pending' && (
                            <>
                              <button onClick={() => handleVerify(report._id)} className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg" title="Verify">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(report._id)} className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => setDeleteConfirm(report._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this report? This action cannot be undone."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* Admin Report Detail Modal */}
      {selectedReport && (
        <AdminReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={(updated) => {
            setSelectedReport(updated);
            fetchReports();
          }}
          onDelete={(id) => {
            setSelectedReport(null);
            fetchReports();
          }}
        />
      )}
    </AdminSidebar>
  );
};

export default AdminReports;
