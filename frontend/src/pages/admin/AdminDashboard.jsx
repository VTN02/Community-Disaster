import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, Clock, CheckCircle, TrendingUp, FileText, ArrowRight } from 'lucide-react';
import { reportsApi } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DisasterCard from '../../components/disaster/DisasterCard';
import AdminReportModal from '../../components/admin/AdminReportModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, color, icon: Icon, sub }) => (
  <div className={`card p-6 border-t-4 ${color}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        reportsApi.getStats(),
        reportsApi.getAll({ verificationStatus: 'pending', limit: 6 }),
      ]);
      setStats(statsRes.data.data);
      setPending(pendingRes.data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReportUpdate = (updatedReport) => {
    setPending((prev) =>
      prev.map((r) => (r._id === updatedReport._id ? updatedReport : r))
        .filter((r) => r.verificationStatus === 'pending')
    );
    setSelectedReport(updatedReport);
    fetchDashboardData();
  };

  const handleReportDelete = (deletedId) => {
    setPending((prev) => prev.filter((r) => r._id !== deletedId));
    setSelectedReport(null);
    fetchDashboardData();
  };

  return (
    <AdminSidebar>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {admin?.name}. Here's the current situation.</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading dashboard data..." />
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <StatCard label="Total Reports" value={stats.total} color="border-t-blue-500" icon={Activity} />
                <StatCard label="Pending Review" value={stats.pending} color="border-t-yellow-500" icon={Clock} sub="Needs attention" />
                <StatCard label="Critical" value={stats.critical} color="border-t-red-500" icon={AlertTriangle} />
                <StatCard label="Investigating" value={stats.investigating} color="border-t-orange-500" icon={TrendingUp} />
                <StatCard label="Resolved" value={stats.resolved} color="border-t-green-500" icon={CheckCircle} />
              </div>
            )}

            {/* By Type breakdown */}
            {stats?.byType?.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card p-5">
                  <h2 className="font-bold text-slate-900 mb-4">Reports by Type</h2>
                  <div className="space-y-2.5">
                    {stats.byType.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-28 flex-shrink-0">{item._id}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${Math.min((item.count / stats.total) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-6 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <h2 className="font-bold text-slate-900 mb-4">Top Affected Districts</h2>
                  <div className="space-y-2.5">
                    {stats.byDistrict?.slice(0, 6).map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-28 flex-shrink-0">{item._id}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-orange-400 h-full rounded-full"
                            style={{ width: `${Math.min((item.count / stats.total) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-6 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Reports */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  Pending Verification ({pending.length})
                </h2>
                <Link to="/admin/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {pending.length === 0 ? (
                <div className="card p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700">All reports reviewed!</p>
                  <p className="text-slate-400 text-sm mt-1">No pending reports at this time.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pending.map((report) => (
                    <DisasterCard
                      key={report._id}
                      report={report}
                      onClick={(rep) => setSelectedReport(rep)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Admin Report Detail Modal */}
            {selectedReport && (
              <AdminReportModal
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onUpdate={handleReportUpdate}
                onDelete={handleReportDelete}
              />
            )}
          </>
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminDashboard;
