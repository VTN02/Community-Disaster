import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { teamsApi, assignmentsApi, reportsApi } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import {
  Shield,
  Users,
  MapPin,
  ChevronDown,
  ChevronRight,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  AlertTriangle,
  RefreshCw,
  Send,
  Navigation,
} from 'lucide-react';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('hierarchy'); // 'hierarchy' | 'assignments' | 'dispatch'
  const [expandedTeams, setExpandedTeams] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  // Manual dispatch panel states
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [dispatchPriority, setDispatchPriority] = useState('medium');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [teamsRes, assignmentsRes, reportsRes, statsRes] = await Promise.all([
        teamsApi.getAll(),
        assignmentsApi.getAll(),
        reportsApi.getAll({ limit: 100 }),
        assignmentsApi.getStats(),
      ]);

      if (teamsRes.data.success) {
        setTeams(teamsRes.data.data);
        const initExpanded = {};
        teamsRes.data.data.slice(0, 3).forEach((t) => {
          initExpanded[t._id] = true;
        });
        setExpandedTeams(initExpanded);
      }

      if (assignmentsRes.data.success) {
        setAssignments(assignmentsRes.data.data);
      }

      if (reportsRes.data.success) {
        setReports(reportsRes.data.data);
        if (reportsRes.data.data.length > 0 && !selectedIncidentId) {
          setSelectedIncidentId(reportsRes.data.data[0]._id);
        }
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin teams data:', err);
      showToast('Error loading team data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleTeam = (teamId) => {
    setExpandedTeams((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const handleAutoMatch = async (incidentId) => {
    setActionLoading((prev) => ({ ...prev, [incidentId]: true }));
    try {
      const res = await assignmentsApi.autoMatch(incidentId);
      if (res.data.success) {
        showToast(
          `Dispatched to ${res.data.data.subGroupId?.name || res.data.data.teamId?.teamName || 'Help Team'} (${res.data.data.assignmentType})!`,
          'success'
        );
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to auto-match incident', 'error');
    } finally {
      setActionLoading((prev) => ({ ...prev, [incidentId]: false }));
    }
  };

  const handleManualDispatch = async (e) => {
    e.preventDefault();
    if (!selectedIncidentId) {
      showToast('Please select a disaster incident to dispatch.', 'error');
      return;
    }

    setManualSubmitting(true);
    try {
      const res = await assignmentsApi.manualAssign({
        incidentId: selectedIncidentId,
        teamId: selectedTeamId || undefined,
        priority: dispatchPriority,
        notes: dispatchNotes || undefined,
      });

      if (res.data.success) {
        showToast('Incident assigned successfully!', 'success');
        setDispatchNotes('');
        fetchData();
        setActiveTab('assignments');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign incident', 'error');
    } finally {
      setManualSubmitting(false);
    }
  };

  // Selected incident details
  const currentSelectedReport = reports.find((r) => r._id === selectedIncidentId);

  // Totals
  const totalTeams = teams.length;
  const totalSubGroups = teams.reduce((acc, t) => acc + (t.subGroups?.length || 0), 0);
  const totalMembers = teams.reduce((acc, t) => acc + (t.totalMembers || 0), 0);
  const totalActive = teams.reduce((acc, t) => acc + (t.activeMembers || 0), 0);

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Shield className="w-3.5 h-3.5" />
              Field Unit Coordination
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Help Teams & Incident Assignment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Command structure: District Teams $\rightarrow$ Town Sub-Groups $\rightarrow$ Field Responders.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh System
          </Button>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 border-t-4 border-t-blue-600">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">District Teams</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalTeams}</p>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">Primary District Units</p>
          </Card>

          <Card className="p-5 border-t-4 border-t-indigo-600">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Town Sub Groups</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalSubGroups}</p>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5">Local town squads</p>
          </Card>

          <Card className="p-5 border-t-4 border-t-emerald-600">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Responders</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalActive}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Ready for deployment</p>
          </Card>

          <Card className="p-5 border-t-4 border-t-amber-500">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Operations</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {(stats?.assigned || 0) + (stats?.inProgress || 0) + (stats?.accepted || 0) + (stats?.arrived || 0)}
            </p>
            <p className="text-xs text-amber-600 font-semibold mt-0.5">{stats?.completed || 0} rescues completed</p>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'hierarchy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Team Hierarchy & Responders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'dispatch'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Incident Dispatch Console
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            Active Operations Dispatches ({assignments.length})
          </button>
        </div>

        {/* TAB 1: TEAM HIERARCHY TREE */}
        {loading ? (
          <LoadingSpinner message="Loading team command hierarchy..." />
        ) : activeTab === 'hierarchy' ? (
          <div className="space-y-4">
            {teams.length === 0 ? (
              <EmptyState
                title="No Help Teams Registered"
                message="Help Teams are created automatically as responders register with their district and town."
              />
            ) : (
              teams.map((team) => {
                const isExpanded = !!expandedTeams[team._id];
                return (
                  <Card key={team._id} className="overflow-hidden">
                    {/* District Team Row */}
                    <div
                      onClick={() => toggleTeam(team._id)}
                      className="p-4 bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button type="button" className="text-slate-400 hover:text-slate-700">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-2xs">
                          🏛️
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                              {team.teamName}
                            </h3>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              District: {team.district}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {team.subGroups?.length || 0} Sub Groups · {team.totalMembers} Members (
                            <span className="text-emerald-600 font-bold">{team.activeMembers} Available</span>)
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                        {isExpanded ? 'Collapse' : 'Expand Town Sub-Teams'}
                      </span>
                    </div>

                    {/* Sub Groups Container */}
                    {isExpanded && (
                      <div className="p-4 bg-white space-y-3 border-t border-slate-200">
                        {team.subGroups?.length === 0 ? (
                          <p className="text-xs text-slate-400 italic pl-8">
                            No town sub-groups registered under this district yet.
                          </p>
                        ) : (
                          team.subGroups.map((sg) => (
                            <div
                              key={sg._id}
                              className="ml-2 sm:ml-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🏘️</span>
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{sg.name}</h4>
                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                                    Town: {sg.town}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-slate-500">
                                  {sg.members?.length || 0} Responders
                                </span>
                              </div>

                              {/* Members Grid in Sub-Group */}
                              {sg.members?.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No members assigned yet.</p>
                              ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                  {sg.members.map((mem) => (
                                    <div
                                      key={mem._id}
                                      className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                          <p className="text-xs font-bold text-slate-900 truncate">{mem.name}</p>
                                          <Badge status={mem.status || 'active'} size="sm" />
                                        </div>
                                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                          <Phone className="w-3 h-3 text-slate-400" />
                                          {mem.phone || 'No phone'}
                                        </p>
                                      </div>

                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {mem.skills?.map((s, i) => (
                                          <span
                                            key={i}
                                            className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                                          >
                                            {s}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        ) : activeTab === 'dispatch' ? (
          /* TAB 2: INCIDENT DISPATCH CONSOLE */
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Incident Selection & Info Panel */}
            <div className="lg:col-span-6 space-y-4">
              <Card>
                <Card.Header>
                  <Card.Title>1. Select Disaster Incident</Card.Title>
                  <Card.Description>Choose an active citizen report to analyze location matching</Card.Description>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <div>
                    <label className="label">Active Incident Reports</label>
                    <select
                      value={selectedIncidentId}
                      onChange={(e) => setSelectedIncidentId(e.target.value)}
                      className="input-field text-xs"
                    >
                      {reports.map((r) => (
                        <option key={r._id} value={r._id}>
                          [{r.type}] {r.district} {r.area ? `· ${r.area}` : ''} ({r.severity})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentSelectedReport ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900">{currentSelectedReport.type}</span>
                        <Badge severity={currentSelectedReport.severity} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{currentSelectedReport.description}</p>
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        District: {currentSelectedReport.district} | Area: {currentSelectedReport.area || 'General Area'}
                      </p>
                      {currentSelectedReport.location?.latitude && (
                        <p className="text-[11px] font-mono text-slate-500">
                          Coordinates: {currentSelectedReport.location.latitude.toFixed(4)}, {currentSelectedReport.location.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No incident selected.</p>
                  )}

                  {/* 1-Click Auto Match Button */}
                  {currentSelectedReport && (
                    <Button
                      type="button"
                      variant="primary"
                      fullWidth
                      icon={Sparkles}
                      loading={actionLoading[currentSelectedReport._id]}
                      onClick={() => handleAutoMatch(currentSelectedReport._id)}
                    >
                      Auto-Match & Dispatch Nearest Team
                    </Button>
                  )}
                </Card.Content>
              </Card>
            </div>

            {/* Right: Manual Assignment & Available Teams Panel */}
            <div className="lg:col-span-6 space-y-4">
              <Card>
                <Card.Header>
                  <Card.Title>2. Manual Assignment & Override</Card.Title>
                  <Card.Description>Select specific District Team or configure priority instructions</Card.Description>
                </Card.Header>
                <Card.Content>
                  <form onSubmit={handleManualDispatch} className="space-y-4">
                    <div>
                      <label className="label">Assign to District Team</label>
                      <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="input-field text-xs"
                      >
                        <option value="">Choose District Team...</option>
                        {teams.map((t) => (
                          <option key={t._id} value={t._id}>
                            🏛️ {t.teamName} ({t.activeMembers} available members)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Operation Priority</label>
                      <select
                        value={dispatchPriority}
                        onChange={(e) => setDispatchPriority(e.target.value)}
                        className="input-field text-xs"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Emergency</option>
                        <option value="critical">Critical Rescue</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Operational Notes / Special Directives</label>
                      <textarea
                        rows={3}
                        value={dispatchNotes}
                        onChange={(e) => setDispatchNotes(e.target.value)}
                        placeholder="e.g. Deploy 2 inflatable rescue boats with life vests to Chavakachcheri market road..."
                        className="input-field text-xs resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="danger"
                      fullWidth
                      icon={Send}
                      loading={manualSubmitting}
                    >
                      Assign Incident to Team
                    </Button>
                  </form>
                </Card.Content>
              </Card>
            </div>
          </div>
        ) : (
          /* TAB 3: ACTIVE OPERATIONS DISPATCHES */
          <div className="space-y-3">
            {assignments.length === 0 ? (
              <EmptyState
                title="No Active Dispatches Recorded"
                message="Incidents auto-matched or manually assigned will appear here in real-time."
              />
            ) : (
              assignments.map((asg) => {
                const inc = asg.incidentId || {};
                return (
                  <Card key={asg._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-base">{inc.type || 'Disaster Incident'}</span>
                        <Badge severity={asg.priority || inc.severity || 'medium'} size="sm" />
                        <Badge status={asg.status} size="sm" />
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {asg.assignmentType === 'subgroup' ? 'Town Sub-Group' : 'District Fallback'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                        {inc.description || 'No description logged.'}
                      </p>

                      <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap pt-1">
                        <span>
                          <strong>Unit:</strong> {asg.subGroupId?.name || asg.teamId?.teamName || 'Unassigned'}
                        </span>
                        <span>
                          <strong>Responders:</strong> {asg.assignedMembers?.length || 0} active
                        </span>
                        {asg.notes && <span className="text-slate-400 italic truncate max-w-xs">"{asg.notes}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Sparkles}
                        loading={actionLoading[inc._id]}
                        onClick={() => handleAutoMatch(inc._id)}
                      >
                        Re-Match Team
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminTeams;
