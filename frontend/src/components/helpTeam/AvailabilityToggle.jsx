import { useState } from 'react';
import { useHelpTeamAuth } from '../../context/HelpTeamAuthContext';
import { showToast } from '../common/Toast';
import { CheckCircle2, Moon, Clock, Loader2 } from 'lucide-react';

const AvailabilityToggle = ({ compact = false }) => {
  const { member, updateAvailability } = useHelpTeamAuth();
  const [updating, setUpdating] = useState(false);

  const currentStatus = member?.status || 'active';

  const handleStatusChange = async (newStatus) => {
    if (updating || newStatus === currentStatus) return;
    setUpdating(true);
    const isAvail = newStatus === 'active';
    const res = await updateAvailability(isAvail, newStatus);
    setUpdating(false);

    if (res?.success) {
      showToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
    } else {
      showToast(res?.message || 'Failed to update status', 'error');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {updating && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 ml-1" />}
        <button
          type="button"
          onClick={() => handleStatusChange('active')}
          disabled={updating}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            currentStatus === 'active'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="Ready for deployment"
        >
          ● Active
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('busy')}
          disabled={updating}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            currentStatus === 'busy'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="Currently on an active task"
        >
          ● Busy
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('offline')}
          disabled={updating}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            currentStatus === 'offline'
              ? 'bg-slate-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="Off duty"
        >
          ● Offline
        </button>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Your Duty Status</h4>
          <p className="text-xs text-slate-500">Let dispatch know if you are available for incidents</p>
        </div>
        {updating && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleStatusChange('active')}
          disabled={updating}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
            currentStatus === 'active'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold">Active</span>
          <span className="text-[10px] text-slate-500">Ready to respond</span>
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('busy')}
          disabled={updating}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
            currentStatus === 'busy'
              ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold">Busy</span>
          <span className="text-[10px] text-slate-500">On mission</span>
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('offline')}
          disabled={updating}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
            currentStatus === 'offline'
              ? 'bg-slate-100 border-slate-400 text-slate-800 ring-2 ring-slate-400/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Moon className="w-5 h-5 text-slate-500" />
          <span className="text-xs font-bold">Offline</span>
          <span className="text-[10px] text-slate-500">Off duty</span>
        </button>
      </div>
    </div>
  );
};

export default AvailabilityToggle;
