import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';
import { DISASTER_ICONS, timeAgo } from '../../utils/constants';

const severityBorders = {
  critical: 'border-l-4 border-l-red-600',
  high: 'border-l-4 border-l-orange-500',
  medium: 'border-l-4 border-l-amber-500',
  low: 'border-l-4 border-l-emerald-500',
};

const DisasterCard = ({ report, onClick }) => {
  const icon = DISASTER_ICONS[report.type] || '⚠️';
  const borderClass = severityBorders[report.severity] || severityBorders.medium;

  const content = (
    <div className="p-5 flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xl flex-shrink-0 shadow-2xs">
              {icon}
            </div>
            <div className="truncate">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate">
                {report.type}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700">{report.district}</span>
                {report.area && <span className="truncate">· {report.area}</span>}
              </p>
            </div>
          </div>

          <Badge severity={report.severity} size="sm" />
        </div>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {report.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
            <Clock className="w-3 h-3" />
            {timeAgo(report.createdAt)}
          </span>
          <Badge status={report.status} size="sm" />
        </div>

        <span className="text-blue-600 font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );

  const baseClasses = `card card-hover group cursor-pointer bg-white ${borderClass}`;

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(report)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick(report);
        }}
        className={baseClasses}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <Link to={`/disasters/${report._id}`} className="block h-full">
        {content}
      </Link>
    </div>
  );
};

export default DisasterCard;
