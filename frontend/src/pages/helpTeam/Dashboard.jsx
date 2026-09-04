import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHelpTeamAuth } from '../../context/HelpTeamAuthContext';
import { helpTeamTasksApi, teamsApi } from '../../services/api';
import HelpTeamNavbar from '../../components/helpTeam/HelpTeamNavbar';
import TaskCard from '../../components/team/TaskCard';
import TeamCard from '../../components/team/TeamCard';
import AvailabilityToggle from '../../components/helpTeam/AvailabilityToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import {
  Shield,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Users,
} from 'lucide-react';

const Dashboard = () => {
  const { member } = useHelpTeamAuth();
  const [tasks, setTasks] = useState([]);
  const [teamDetails, setTeamDetails] = useState(null);
  const [subGroupMembers, setSubGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, teamsRes] = await Promise.all([
        helpTeamTasksApi.getMyTasks(),
        teamsApi.getAll(),
      ]);

      if (tasksRes.data.success) {
        setTasks(tasksRes.data.data);
      }

      if (teamsRes.data.success && member?.district) {
        const myTeam = teamsRes.data.data.find(
          (t) => t.district?.toLowerCase() === member.district?.toLowerCase()
        );
        if (myTeam) {
          setTeamDetails(myTeam);
          const mySubGroup = myTeam.subGroups?.find(
            (sg) => sg.town?.toLowerCase() === member.town?.toLowerCase()
          );
          if (mySubGroup) {
            setSubGroupMembers(mySubGroup.members || []);
          }
        }
      }
    } catch (err) {
      console.error('Error loading help team dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [member?.district, member?.town]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const activeTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <HelpTeamNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Operations Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Responder Operations Hub
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {member?.town}, {member?.district}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Assigned to{' '}
              <strong className="text-slate-800">
                {member?.team?.teamName || `${member?.district} Helping Team`}
              </strong>{' '}
              ·{' '}
              <strong className="text-slate-800">
                {member?.subGroup?.name || `${member?.town} Helping Sub Team`}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
              loading={refreshing}
            >
              Refresh
            </Button>
            <Link to="/help-team/tasks">
              <Button variant="primary" size="sm" iconRight={ArrowRight}>
                View Task Roster
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Connecting to emergency responder network..." />
        ) : (
          <>
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 border-t-4 border-t-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tasks</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{activeTasks.length}</p>
                    <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Emergency dispatches</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-t-4 border-t-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{completedTasks.length}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Rescues fulfilled</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-t-4 border-t-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Local Sub-Team</p>
                    <p className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[130px]">
                      {member?.town} Unit
                    </p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                      {subGroupMembers.length} Colleagues
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-t-4 border-t-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duty Readiness</p>
                    <p className="text-sm font-bold text-slate-900 mt-1 capitalize">
                      {member?.status || 'Active'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {member?.availability ? 'Available for dispatch' : 'Currently off duty'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Operational Split */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Active Dispatched Tasks */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Assigned Incident Queue
                    {activeTasks.length > 0 && (
                      <Badge variant="warning" size="sm" pulse>
                        {activeTasks.length} Pending
                      </Badge>
                    )}
                  </h2>
                  <Link to="/help-team/tasks" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                    Task Archive →
                  </Link>
                </div>

                {activeTasks.length === 0 ? (
                  <EmptyState
                    title="No Open Incidents in Your Area"
                    message="There are currently no active disaster tasks assigned to your sub-group. Keep your duty status set to Active to receive incoming dispatches!"
                    icon={CheckCircle}
                  />
                ) : (
                  <div className="space-y-4">
                    {activeTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onTaskUpdated={handleTaskUpdated} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col: Duty Status Switcher & Team Roster */}
              <div className="space-y-6">
                <AvailabilityToggle />

                <TeamCard
                  team={teamDetails || member?.team}
                  subGroup={member?.subGroup || { district: member?.district, town: member?.town }}
                  members={subGroupMembers.length > 0 ? subGroupMembers : [member]}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
