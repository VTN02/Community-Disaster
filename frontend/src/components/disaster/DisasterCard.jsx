import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import StatusBadge from '../common/StatusBadge';
import { DISASTER_ICONS, SEVERITY_CONFIG, timeAgo } from '../../utils/constants';

const DisasterCard = ({ report, viewMode = 'grid' }) => {
  const icon = DISASTER_ICONS[report.type] || '⚠️';
  const severityConfig = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.medium;
  const isVerified = report.verificationStatus === 'verified';

  const severityBorder =
    report.severity === 'critical' ? 'border-l-red-600' :
    report.severity === 'high' ? 'border-l-orange-500' :
    report.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-emerald-500';

  if (viewMode === 'list') {
    return (
      <div className={`card-hover group cursor-pointer border-l-4 ${severityBorder} transition-all duration-200`}>
        <Link to={`/disasters/${report._id}`} className="block p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Icon, Type, District, Description */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <span className="text-3xl shrink-0 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight uppercase">
                    {report.type}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {report.area ? `${report.area}, ` : ''}{report.district}
                  </span>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <AlertCircle className="w-3 h-3 text-slate-400" /> Community Report
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 leading-relaxed">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Right: Badges, Time & Action */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={report.severity} />
                <StatusBadge status={report.status} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(report.createdAt)}
                </span>
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid View
  return (
    <div className={`card-hover group cursor-pointer border-l-4 ${severityBorder} flex flex-col justify-between transition-all duration-200`}>
      <Link to={`/disasters/${report._id}`} className="block p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-slate-50 rounded-lg border border-slate-100">{icon}</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{report.type}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-500 line-clamp-1">
                    {report.area ? `${report.area}, ` : ''}{report.district}
                  </span>
                </div>
              </div>
            </div>
            <SeverityBadge severity={report.severity} />
          </div>

          {/* Verification Pill */}
          <div className="mb-3">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified by DMC
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3 h-3 text-slate-400" /> Pending Verification
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {report.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} />
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(report.createdAt)}
            </span>
          </div>
          <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default DisasterCard;
