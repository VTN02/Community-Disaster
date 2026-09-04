import { Users, Shield, MapPin, Phone } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const TeamCard = ({ team, subGroup, members = [], className = '' }) => {
  const activeCount = members.filter((m) => m.availability && m.status !== 'offline').length;

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200 block">
              Response Command Unit
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
              {team?.teamName || `${subGroup?.district || 'District'} Helping Team`}
            </h3>
            <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{subGroup?.name || `${subGroup?.town || 'Town'} Sub Team`}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            Unit Responders ({members.length})
          </h4>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            {activeCount} Ready for Action
          </span>
        </div>

        {members.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3 text-center">
            No other responders registered in this unit yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {members.map((m) => (
              <div
                key={m._id || m.id || m.email}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      !m.availability || m.status === 'offline'
                        ? 'bg-slate-400'
                        : m.status === 'busy'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                      <Phone className="w-2.5 h-2.5" />
                      {m.phone || 'No phone'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {m.skills?.slice(0, 2).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-semibold bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {m.skills?.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-bold">
                      +{m.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TeamCard;
