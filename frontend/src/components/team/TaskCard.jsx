import { useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flame,
  Droplets,
  CloudRain,
  Navigation,
  Check,
  ChevronRight,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { helpTeamTasksApi } from '../../services/api';
import { showToast } from '../common/Toast';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const statusFlow = [
  { id: 'assigned', label: 'Assigned' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in_progress', label: 'On The Way' },
  { id: 'arrived', label: 'Reached Location' },
  { id: 'completed', label: 'Completed' },
];

const TaskCard = ({ task, onTaskUpdated, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const incident = task.incidentId || {};
  const currentStepIndex = statusFlow.findIndex((s) => s.id === task.status);

  const handleProgress = async (nextStatus) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await helpTeamTasksApi.updateStatus(task._id, {
        status: nextStatus,
        note: note.trim() || undefined,
      });

      if (res.data.success) {
        const nextFlowItem = statusFlow.find((s) => s.id === nextStatus);
        showToast(`Operation updated to ${nextFlowItem?.label || nextStatus}!`, 'success');
        setNote('');
        setShowNoteInput(false);
        if (onTaskUpdated) onTaskUpdated(res.data.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating task status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = () => {
    switch (task.status) {
      case 'assigned':
        return {
          label: 'Accept Task',
          nextStatus: 'accepted',
          variant: 'primary',
          icon: Check,
        };
      case 'accepted':
        return {
          label: 'On The Way',
          nextStatus: 'in_progress',
          variant: 'warning',
          icon: Navigation,
        };
      case 'in_progress':
        return {
          label: 'Reached Location',
          nextStatus: 'arrived',
          variant: 'primary',
          icon: MapPin,
        };
      case 'arrived':
        return {
          label: 'Mark as Completed',
          nextStatus: 'completed',
          variant: 'success',
          icon: CheckCircle,
        };
      default:
        return null;
    }
  };

  const action = getActionConfig();

  const getSeverityBorder = (sev) => {
    switch (sev) {
      case 'critical': return 'border-l-4 border-l-red-600';
      case 'high': return 'border-l-4 border-l-orange-500';
      case 'medium': return 'border-l-4 border-l-amber-500';
      default: return 'border-l-4 border-l-emerald-500';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${getSeverityBorder(incident.severity)} ${className}`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-extrabold text-slate-900 text-base">{incident.type || 'Emergency Incident'}</h3>
              <Badge severity={incident.severity || 'medium'} size="sm" />
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {task.assignmentType === 'subgroup' ? 'Town Sub-Group' : 'District Fallback'}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-800">{incident.district}</span>
              {incident.area && <span>· {incident.area}</span>}
            </p>
          </div>

          <Badge status={task.status} size="md" />
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
          {incident.description || 'No description provided.'}
        </p>

        {/* 5-Step Progress Bar Flow */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-500 mb-2 overflow-x-auto pb-1">
            {statusFlow.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              return (
                <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className={`${
                      isCurrent
                        ? 'text-blue-700 underline font-black'
                        : isPassed
                        ? 'text-emerald-700 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {idx + 1}. {step.label}
                  </span>
                  {idx < statusFlow.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-300 mx-0.5 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress fill */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                task.status === 'completed'
                  ? 'bg-emerald-500 w-full'
                  : task.status === 'arrived'
                  ? 'bg-purple-600 w-4/5'
                  : task.status === 'in_progress'
                  ? 'bg-amber-500 w-3/5'
                  : task.status === 'accepted'
                  ? 'bg-blue-600 w-2/5'
                  : 'bg-blue-400 w-1/5'
              }`}
            />
          </div>
        </div>

        {/* Notes Preview if available */}
        {task.notes && (
          <div className="text-xs bg-amber-50/80 border border-amber-200/80 text-amber-900 p-2.5 rounded-xl mb-4 leading-relaxed">
            <span className="font-bold">Latest Operational Note: </span>
            {task.notes}
          </div>
        )}

        {/* Note input toggle */}
        {showNoteInput && (
          <div className="mb-4 animate-fade-in">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add progress notes (e.g. Arrived on scene with emergency crew, beginning evacuation...)"
              className="input-field text-xs w-full resize-none h-16"
            />
          </div>
        )}

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {incident.location?.latitude && (
              <a
                href={`https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                View Location Map
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {showNoteInput ? 'Cancel note' : '+ Add Note'}
            </button>
          </div>

          <div className="ml-auto">
            {action ? (
              <Button
                size="sm"
                variant={action.variant}
                loading={loading}
                icon={action.icon}
                onClick={() => handleProgress(action.nextStatus)}
              >
                {action.label}
              </Button>
            ) : (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Mission Accomplished
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
