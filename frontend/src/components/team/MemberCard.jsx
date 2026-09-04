import { Phone, Mail, Award, CheckCircle, Clock, Moon } from 'lucide-react';
import Badge from '../common/Badge';

const MemberCard = ({ member, showActions = false, onAction, actionLabel = 'Assign' }) => {
  const isAvailable = member?.availability && member?.status !== 'offline';

  return (
    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{member.name}</h4>
            <p className="text-[11px] text-slate-500 truncate">{member.town}, {member.district}</p>
          </div>
          <Badge status={member.status || 'active'} size="sm" />
        </div>

        <div className="space-y-1 my-2">
          {member.phone && (
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                {member.phone}
              </a>
            </p>
          )}
          {member.email && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{member.email}</span>
            </p>
          )}
        </div>

        {/* Skills pills */}
        {member.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {member.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="text-[9px] font-bold text-slate-400">
                +{member.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {showActions && onAction && (
        <div className="pt-2.5 mt-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onAction(member)}
            disabled={!isAvailable}
            className="w-full btn-primary btn-sm text-xs py-1"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberCard;
