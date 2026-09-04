import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  FileText,
  ArrowRight,
  Shield,
  Users,
  RefreshCw,
} from 'lucide-react';
import { reportsApi, teamsApi, assignmentsApi } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DisasterCard from '../../components/disaster/DisasterCard';
import AdminReportModal from '../../components/admin/AdminReportModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, color, icon: Icon, sub }) => (
  <Card className={`p-5 border-t-4 ${color}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 font-medium mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [teamsSummary, setTeamsSummary] = useState({ totalTeams: 0, totalAvailable: 0 });
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes, teamsRes, asgStatsRes] = await Promise.all([
        reportsApi.getStats(),
        reportsApi.getAll({ verificationStatus: 'pending', limit: 6 }),
        teamsApi.getAll().catch(() => ({ data: { data: [] } })),
        assignmentsApi.getStats().catch(() => ({ data: { data: {} } })),
      ]);

      setStats(statsRes.data.data);
      setPending(pendingRes.data.data);

      if (teamsRes.data?.data) {
        const teamsList = teamsRes.data.data;
        const totalAvail = teamsList.reduce((acc, t) => acc + (t.activeMembers || 0), 0);
        setTeamsSummary({ totalTeams: teamsList.length, totalAvailable: totalAvail });
      }

      if (asgStatsRes.data?.data) {
        setAssignmentStats(asgStatsRes.data.data);
      }
    } catch (err) {
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

  const activeEmergencies = (stats?.critical || 0) + (stats?.investigating || 0);
  const completedRescues = assignmentStats?.completed || stats?.resolved || 0;

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Command Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-bold text-slate-700">{admin?.name || 'Administrator'}</span>.
              Real-time monitoring across all 25 districts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchDashboardData}
            >
              Refresh
            </Button>
            <Link to="/admin/reports">
              <Button variant="primary" size="sm" iconRight={ArrowRight}>
                Manage Reports
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Aggregating operational intelligence..." />
        ) : (
          <>
            {/* Core Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Incidents"
                value={stats?.total ?? 0}
                color="border-t-blue-600"
                icon={Activity}
                sub="Cumulative database logs"
              />
              <StatCard
                label="Active Emergencies"
                value={activeEmergencies}
                color="border-t-amber-500"
                icon={AlertTriangle}
                sub={`${stats?.critical ?? 0} critical priority`}
              />
              <StatCard
                label="Completed Rescues"
                value={completedRescues}
                color="border-t-emerald-600"
                icon={CheckCircle}
                sub="Secured & resolved"
              />
              <StatCard
                label="Available Help Teams"
                value={teamsSummary.totalTeams}
                color="border-t-indigo-600"
                icon={Shield}
                sub={`${teamsSummary.totalAvailable} responders ready`}
              />
            </div>

            {/* Middle Grid: Category Breakdown + District Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* By Type Breakdown */}
              <Card>
                <Card.Header>
                  <Card.Title>Incidents by Category</Card.Title>
                  <Card.Description>Distribution of hazards reported by citizens</Card.Description>
                </Card.Header>
                <Card.Content>
                  {stats?.byType?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.byType.map((item) => {
                        const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                        return (
                          <div key={item._id} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>{item._id}</span>
                              <span className="text-slate-500 font-semibold">{item.count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(pct, 4)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-4">No categories recorded yet.</p>
                  )}
                </Card.Content>
              </Card>

              {/* Quick Actions & Deployment Console */}
              <Card>
                <Card.Header>
                  <Card.Title>Quick Dispatch & Operations</Card.Title>
                  <Card.Description>Manage field resources and incident dispatches</Card.Description>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <Link
                    to="/admin/teams"
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Help Team Hierarchy & Matching</p>
                        <p className="text-[11px] text-slate-500">Auto-match incidents to nearest town sub groups</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/reports"
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Pending Report Verification</p>
                        <p className="text-[11px] text-slate-500">
                          {stats?.pending ?? 0} citizen reports require verification
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    to="/admin/map"
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Live Spatial Hazard Map</p>
                        <p className="text-[11px] text-slate-500">Visual mapping of all active emergency clusters</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </Card.Content>
              </Card>
            </div>

            {/* Pending Verification Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Pending Citizen Reports Awaiting Action ({pending.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify incoming incident reports before publishing to public feeds.
                  </p>
                </div>

                <Link to="/admin/reports" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                  View All Reports →
                </Link>
              </div>

              {pending.length === 0 ? (
                <Card className="p-8 text-center bg-white border border-dashed border-slate-300">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-800 text-sm">All Reports Verified</h3>
                  <p className="text-xs text-slate-500">
                    No pending unverified citizen reports in queue.
                  </p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pending.map((report) => (
                    <DisasterCard
                      key={report._id}
                      report={report}
                      onClick={() => setSelectedReport(report)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Verification Modal */}
        {selectedReport && (
          <AdminReportModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onUpdate={handleReportUpdate}
            onDelete={handleReportDelete}
          />
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminDashboard;
