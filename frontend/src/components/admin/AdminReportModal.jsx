import { useState } from 'react';
import { X, MapPin, Calendar, Phone, User, ExternalLink, CheckCircle, XCircle, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import StatusBadge from '../common/StatusBadge';
import { DISASTER_ICONS, VERIFICATION_CONFIG, timeAgo, SEVERITY_CONFIG, STATUS_CONFIG } from '../../utils/constants';
import { reportsApi } from '../../services/api';
import { showToast } from '../common/Toast';

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = ['pending', 'investigating', 'resolved', 'rejected'];

const AdminReportModal = ({ report, onClose, onUpdate, onDelete }) => {
  const [currentReport, setCurrentReport] = useState(report);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!currentReport) return null;

  const icon = DISASTER_ICONS[currentReport.type] || '⚠️';

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await reportsApi.updateStatus(currentReport._id, { status: newStatus });
      const updated = res.data.data;
      setCurrentReport(updated);
      showToast(`Status updated to ${newStatus}.`, 'success');
      if (onUpdate) onUpdate(updated);
    } catch {
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSeverityChange = async (newSeverity) => {
    setUpdating(true);
    try {
      const res = await reportsApi.update(currentReport._id, { severity: newSeverity });
      const updated = res.data.data;
      setCurrentReport(updated);
      showToast(`Severity changed to ${newSeverity}.`, 'success');
      if (onUpdate) onUpdate(updated);
    } catch {
      showToast('Failed to update severity.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerify = async (status) => {
    setUpdating(true);
    try {
      const res = await reportsApi.verify(currentReport._id, { verificationStatus: status });
      const updated = res.data.data;
      setCurrentReport(updated);
      showToast(status === 'verified' ? 'Report verified successfully!' : 'Report rejected.', status === 'verified' ? 'success' : 'info');
      if (onUpdate) onUpdate(updated);
    } catch {
      showToast('Failed to update verification status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setUpdating(true);
    try {
      await reportsApi.delete(currentReport._id);
      showToast('Report deleted successfully.', 'success');
      if (onDelete) onDelete(currentReport._id);
      onClose();
    } catch {
      showToast('Failed to delete report.', 'error');
      setUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full my-3 sm:my-8 overflow-hidden border border-slate-100 animate-scale-in">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-slate-300 hover:text-white"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3 sm:gap-4 pr-7 sm:pr-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-[11px] sm:text-xs text-blue-300 truncate max-w-[140px] sm:max-w-none">ID: {currentReport._id}</span>
                <span className={`badge text-[10px] sm:text-xs border ${VERIFICATION_CONFIG[currentReport.verificationStatus]?.color || 'bg-slate-800 text-slate-300'}`}>
                  {currentReport.verificationStatus}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                {currentReport.type} in {currentReport.district}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span className="truncate">{currentReport.area ? `${currentReport.area}, ` : ''}{currentReport.district}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(88vh-140px)] overflow-y-auto">
          {/* Quick Badges Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity:</span>
              <SeverityBadge severity={currentReport.severity} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
              <StatusBadge status={currentReport.status} />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeAgo(currentReport.createdAt)}</span>
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-sm whitespace-pre-line">
              {currentReport.description}
            </p>
          </div>

          {/* Photo if uploaded */}
          {currentReport.imageUrl && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Photo</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
                <img
                  src={currentReport.imageUrl}
                  alt={currentReport.type}
                  className="w-full h-full object-cover max-h-64"
                />
              </div>
            </div>
          )}

          {/* Location & Coordinates */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">District & Area</h4>
              <p className="font-semibold text-slate-800">{currentReport.district}</p>
              <p className="text-sm text-slate-500">{currentReport.area || 'General District Area'}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Coordinates</h4>
              {currentReport.location?.coordinates?.length === 2 ? (
                <div>
                  <p className="font-mono text-sm text-slate-800">
                    {currentReport.location.coordinates[1].toFixed(5)}° N, {currentReport.location.coordinates[0].toFixed(5)}° E
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${currentReport.location.coordinates[1]},${currentReport.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 font-medium"
                  >
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Not specified</p>
              )}
            </div>
          </div>

          {/* Reporter Details (Admin Access Only) */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Reporter Contact Information (Admin Only)
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-500">Name:</span>
                <p className="font-semibold text-slate-800">{currentReport.reporterName || 'Anonymous'}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Phone / Contact:</span>
                {currentReport.reporterContact ? (
                  <p className="font-semibold text-blue-700">
                    <a href={`tel:${currentReport.reporterContact}`} className="hover:underline flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {currentReport.reporterContact}
                    </a>
                  </p>
                ) : (
                  <p className="text-slate-400 italic">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Admin Fast-Action Controls */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-4">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Admin Controls
            </h4>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Incident Status</label>
                <select
                  disabled={updating}
                  value={currentReport.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Severity Level</label>
                <select
                  disabled={updating}
                  value={currentReport.severity}
                  onChange={(e) => handleSeverityChange(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {SEVERITY_OPTIONS.map((sev) => (
                    <option key={sev} value={sev}>
                      {sev.charAt(0).toUpperCase() + sev.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Verification Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
              <button
                type="button"
                disabled={updating || currentReport.verificationStatus === 'verified'}
                onClick={() => handleVerify('verified')}
                className={`btn text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg transition-colors ${
                  currentReport.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {currentReport.verificationStatus === 'verified' ? 'Verified' : 'Verify Report'}
              </button>

              <button
                type="button"
                disabled={updating || currentReport.verificationStatus === 'rejected'}
                onClick={() => handleVerify('rejected')}
                className={`btn text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg transition-colors ${
                  currentReport.verificationStatus === 'rejected'
                    ? 'bg-orange-100 text-orange-700 cursor-not-allowed border border-orange-200'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                {currentReport.verificationStatus === 'rejected' ? 'Rejected' : 'Reject Report'}
              </button>

              <div className="ml-auto">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Reported on {new Date(currentReport.createdAt).toLocaleString()}
          </span>
          <button
            onClick={onClose}
            className="btn-ghost border border-slate-200 text-sm py-2 px-4 rounded-xl hover:bg-slate-100 text-slate-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Nested Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-center text-lg mb-1">Delete Report?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              Are you sure you want to permanently delete this disaster report? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-ghost border border-slate-200 flex-1 justify-center py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={updating}
                className="btn-danger flex-1 justify-center py-2.5 rounded-xl text-sm"
              >
                {updating ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportModal;
