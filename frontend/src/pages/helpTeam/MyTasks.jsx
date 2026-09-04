import { useState, useEffect } from 'react';
import { ListTodo, Search, RefreshCw, CheckCircle2, Navigation, AlertTriangle } from 'lucide-react';
import { helpTeamTasksApi } from '../../services/api';
import HelpTeamNavbar from '../../components/helpTeam/HelpTeamNavbar';
import TaskCard from '../../components/team/TaskCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';

const tabs = [
  { id: 'all', label: 'All Tasks' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in_progress', label: 'On The Way' },
  { id: 'arrived', label: 'Reached Location' },
  { id: 'completed', label: 'Completed' },
];

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await helpTeamTasksApi.getMyTasks();
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const incident = task.incidentId || {};
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      incident.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCount = (st) => (st === 'all' ? tasks.length : tasks.filter((t) => t.status === st).length);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <HelpTeamNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5" />
              Field Deployment Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Assigned Emergency Tasks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Execute incident response: Assigned $\rightarrow$ Accepted $\rightarrow$ On The Way $\rightarrow$ Reached Location $\rightarrow$ Completed.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh Tasks
          </Button>
        </div>

        {/* Filter Bar & Search */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* 5-Step Status Flow Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {tabs.map((tab) => {
                const count = getCount(tab.id);
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, incident type..."
                className="input-field text-xs pl-9 py-2 w-full"
              />
            </div>
          </div>
        </Card>

        {/* Task Cards Grid */}
        {loading ? (
          <LoadingSpinner message="Retrieving operations queue..." />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No Incidents Match Filter"
            message={
              searchQuery || statusFilter !== 'all'
                ? 'No assigned incidents match your selected tab or search query.'
                : 'There are currently no active emergency tasks assigned to your team.'
            }
            icon={CheckCircle2}
            actionLabel={statusFilter !== 'all' || searchQuery ? 'Show All Tasks' : undefined}
            onAction={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onTaskUpdated={handleTaskUpdated} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTasks;
