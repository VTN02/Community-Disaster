const severityConfig = {
  low: { label: 'Low', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  medium: { label: 'Medium', bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  high: { label: 'High', bg: 'bg-orange-50 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  critical: { label: 'Critical', bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600', pulse: true },
};

const statusConfig = {
  pending: { label: 'Pending Review', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  investigating: { label: 'Investigating', bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-600', pulse: true },
  resolved: { label: 'Resolved', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  rejected: { label: 'Rejected', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  // Help Team task lifecycle statuses
  assigned: { label: 'Assigned', bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  accepted: { label: 'Accepted', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
  in_progress: { label: 'On The Way', bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500', pulse: true },
  arrived: { label: 'Reached Location', bg: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-600' },
  completed: { label: 'Completed', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  // Duty states
  active: { label: 'Active', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  busy: { label: 'Busy', bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  offline: { label: 'Offline', bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const generalVariants = {
  primary: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-600' },
  secondary: { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
  success: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-600' },
  warning: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  danger: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-600' },
  neutral: { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const Badge = ({
  children,
  severity,
  status,
  variant = 'primary',
  dot = true,
  pulse = false,
  size = 'md',
  className = '',
}) => {
  let config = generalVariants[variant] || generalVariants.primary;
  let text = children;

  if (severity && severityConfig[severity]) {
    config = severityConfig[severity];
    text = text || config.label;
  } else if (status && statusConfig[status]) {
    config = statusConfig[status];
    text = text || config.label;
  }

  const shouldPulse = pulse || config.pulse;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3.5 py-1 font-bold',
  }[size] || 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs ${config.bg} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {shouldPulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
        </span>
      )}
      <span>{text}</span>
    </span>
  );
};

export default Badge;
