import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle, Camera } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { DISASTER_ICONS, timeAgo } from '../../utils/constants';

const SEVERITY_THEMES = {
  critical: {
    topBar: 'bg-red-600',
    border: 'border-red-300 hover:border-red-500',
    shadow: 'hover:shadow-red-500/10',
    iconBg: 'bg-red-50 border-red-200 text-red-700',
    badge: 'bg-red-500 text-white font-bold',
    dot: 'bg-red-500',
    ping: true,
    label: 'CRITICAL',
    glow: 'from-red-50/40 via-white to-white',
  },
  high: {
    topBar: 'bg-orange-500',
    border: 'border-orange-300 hover:border-orange-500',
    shadow: 'hover:shadow-orange-500/10',
    iconBg: 'bg-orange-50 border-orange-200 text-orange-700',
    badge: 'bg-orange-500 text-white font-bold',
    dot: 'bg-orange-500',
    ping: true,
    label: 'HIGH ALERT',
    glow: 'from-orange-50/40 via-white to-white',
  },
  medium: {
    topBar: 'bg-amber-400',
    border: 'border-amber-200 hover:border-amber-400',
    shadow: 'hover:shadow-amber-500/10',
    iconBg: 'bg-amber-50 border-amber-200 text-amber-800',
    badge: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    dot: 'bg-amber-500',
    ping: false,
    label: 'MEDIUM',
    glow: 'from-amber-50/30 via-white to-white',
  },
  low: {
    topBar: 'bg-blue-400',
    border: 'border-slate-200 hover:border-blue-300',
    shadow: 'hover:shadow-blue-500/10',
    iconBg: 'bg-blue-50 border-blue-200 text-blue-700',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200 font-medium',
    dot: 'bg-blue-500',
    ping: false,
    label: 'ADVISORY',
    glow: 'from-blue-50/20 via-white to-white',
  },
};

const DisasterCard = ({ report, onClick }) => {
  const icon = DISASTER_ICONS[report.type] || '⚠️';
  const theme = SEVERITY_THEMES[report.severity] || SEVERITY_THEMES.medium;
  const isVerified = report.verificationStatus === 'verified';

  const cardContent = (
    <div className={`relative flex flex-col h-full bg-gradient-to-b ${theme.glow} rounded-2xl overflow-hidden border ${theme.border} shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${theme.shadow}`}>
      {/* Top Hazard Accent Line */}
      <div className={`h-1.5 w-full ${theme.topBar}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: Hazard Icon, Type & Severity Alert Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-sm flex-shrink-0 transition-transform group-hover:scale-105 ${theme.iconBg}`}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-slate-900 text-base tracking-tight leading-snug">
                  {report.type}
                </h3>
                {isVerified && (
                  <span title="Verified Incident" className="inline-flex text-blue-600">
                    <ShieldCheck className="w-4 h-4 fill-blue-100" />
                  </span>
                )}
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1 mt-0.5 text-xs font-medium text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span className="truncate">
                  {report.area && report.area !== 'Please Select' ? `${report.area}, ` : ''}
                  <span className="font-bold text-slate-800">{report.district}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Severity Alert Pill with Pulsing Dot */}
          <div className="flex items-center flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] tracking-wide uppercase shadow-sm ${theme.badge}`}>
              <span className="relative flex h-2 w-2">
                {theme.ping && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.dot}`} />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.dot}`} />
              </span>
              {theme.label}
            </span>
          </div>
        </div>

        {/* Description & Optional Photo Preview */}
        <div className="flex gap-3 mb-4 flex-1">
          <div className="flex-1 bg-white/80 rounded-xl p-3 border border-slate-200/60 shadow-2xs">
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-2 font-normal">
              {report.description || 'No detailed incident description provided.'}
            </p>
          </div>

          {report.imageUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100 relative group/img shadow-2xs">
              <img
                src={report.imageUrl}
                alt={report.type}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white drop-shadow" />
              </div>
            </div>
          )}
        </div>

        {/* Footer: Time, Status and Emergency CTA */}
        <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2.5 flex-wrap">
            <StatusBadge status={report.status} />
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Clock className="w-3 h-3 text-slate-400" />
              {timeAgo(report.createdAt)}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
            View Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(report)}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(report); }}
        className="group cursor-pointer block h-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={`/disasters/${report._id}`}
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
    >
      {cardContent}
    </Link>
  );
};

export default DisasterCard;
