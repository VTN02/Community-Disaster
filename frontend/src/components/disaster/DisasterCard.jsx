import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import StatusBadge from '../common/StatusBadge';
import { DISASTER_ICONS, SEVERITY_CONFIG, timeAgo } from '../../utils/constants';

const DisasterCard = ({ report, onClick }) => {
  const icon = DISASTER_ICONS[report.type] || '⚠️';
  const severityConfig = SEVERITY_CONFIG[report.severity];

  const content = (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{report.type}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-sm text-slate-500">
                {report.area ? `${report.area}, ` : ''}{report.district}
              </span>
            </div>
          </div>
        </div>
        <SeverityBadge severity={report.severity} />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
        {report.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(report.createdAt)}
          </div>
          <StatusBadge status={report.status} />
        </div>
        <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );

  const cardClasses = `card-hover group cursor-pointer border-l-4 ${
    report.severity === 'critical' ? 'border-l-red-600' :
    report.severity === 'high' ? 'border-l-orange-500' :
    report.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
  }`;

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(report)}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(report); }}
        className={cardClasses}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <Link to={`/disasters/${report._id}`} className="block">
        {content}
      </Link>
    </div>
  );
};

export default DisasterCard;
