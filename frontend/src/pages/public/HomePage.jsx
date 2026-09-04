import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Map,
  Phone,
  Shield,
  Activity,
  CheckCircle2,
  Users,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  Droplets,
  Flame,
  CloudRain,
  Navigation,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { reportsApi } from '../../services/api';
import DisasterCard from '../../components/disaster/DisasterCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { DISASTER_TYPES } from '../../utils/constants';

const emergencyHotlines = [
  {
    name: 'Disaster Management Centre',
    shortName: 'DMC Hotline',
    number: '117',
    desc: 'National early warning, flood & landslide coordination',
    bg: 'border-red-200 bg-red-50/50 hover:bg-red-50',
    btnBg: 'bg-red-600 hover:bg-red-700 text-white',
    badge: 'National 24/7',
  },
  {
    name: 'Suwa Seriya Free Ambulance',
    shortName: 'Ambulance Service',
    number: '1990',
    desc: 'Island-wide free pre-hospital medical emergency response',
    bg: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    badge: 'Medical',
  },
  {
    name: 'Sri Lanka Police Emergency',
    shortName: 'Police Emergency',
    number: '119',
    desc: 'Immediate crime response, rescue access, public security',
    bg: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    badge: 'Police',
  },
  {
    name: 'Fire & Rescue Service',
    shortName: 'Fire Department',
    number: '110',
    desc: 'Fire suppression, flood boat rescues, trapped victims',
    bg: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50',
    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    badge: 'Fire & Rescue',
  },
];

const safetyGuidelines = [
  {
    type: 'Flood Preparedness',
    icon: Droplets,
    color: 'text-blue-600 bg-blue-50',
    tips: [
      'Move immediately to designated high ground or community shelters.',
      'Turn off all main electricity and gas connections before evacuating.',
      'Never drive, walk, or swim through moving floodwaters.',
    ],
  },
  {
    type: 'Landslide Caution',
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-50',
    tips: [
      'Watch for sudden ground cracks, tilted trees, or muddy spring water.',
      'Evacuate immediately if NBRO issues an Amber or Red warning.',
      'Do not shelter in lower levels or against cut-slope earth embankments.',
    ],
  },
  {
    type: 'Severe Storms & Rain',
    icon: CloudRain,
    color: 'text-indigo-600 bg-indigo-50',
    tips: [
      'Stay indoors away from windows, tin sheets, and unstable trees.',
      'Keep emergency battery torches, power banks, and clean water ready.',
      'Report downed powerlines to CEB (1987) or local emergency police.',
    ],
  },
];

const HomePage = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, statsRes] = await Promise.all([
          reportsApi.getAll({ limit: 6 }),
          reportsApi.getStats(),
        ]);
        setRecentReports(reportsRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        // silent fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReports = useMemo(() => {
    if (selectedType === 'All') return recentReports;
    return recentReports.filter((r) => r.type === selectedType);
  }, [recentReports, selectedType]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full">
                <span className="text-sm">🇱🇰</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-200">
                  National Disaster Management Platform
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Protecting Lives.{' '}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                  Rapid Disaster Response
                </span>{' '}
                <br />
                Across Sri Lanka.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
                Connecting citizens, district response units, and emergency teams in real time with
                GPS-accurate reporting, early warnings, and coordinated rescue operations.
              </p>

              {/* Emergency CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/report">
                  <Button
                    variant="danger"
                    size="lg"
                    icon={AlertTriangle}
                    className="shadow-lg shadow-red-600/30 pulse-emergency"
                  >
                    Report Disaster Incident
                  </Button>
                </Link>

                <Link to="/map">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={Map}
                    className="glass-card hover:bg-white/15 text-white border-white/20 hover:border-white/40"
                  >
                    Live Disaster Map
                  </Button>
                </Link>

                <Link to="/help-team/dashboard">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={Shield}
                    className="bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50"
                  >
                    Help Team Portal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Quick Emergency Dial Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Emergency Dispatch Hub</h3>
                      <p className="text-[11px] text-slate-400">Toll-free 24/7 National Hotlines</p>
                    </div>
                  </div>
                  <Badge variant="danger" size="sm" pulse>
                    Live
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {emergencyHotlines.map((hl) => (
                    <div
                      key={hl.number}
                      className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">{hl.shortName}</p>
                          <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                            {hl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{hl.desc}</p>
                      </div>

                      <a
                        href={`tel:${hl.number}`}
                        className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {hl.number}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                  <Link
                    to="/emergency"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    View Complete Emergency Directory →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DISASTER STATISTICS */}
      <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5 border-t-4 border-t-blue-600 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stats?.total ?? 0}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Recorded island-wide</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="card p-5 border-t-4 border-t-amber-500 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Operations</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stats?.investigating ?? 0}</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Teams dispatched</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="card p-5 border-t-4 border-t-emerald-500 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Incidents</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stats?.resolved ?? 0}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Rescued / Secured</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="card p-5 border-t-4 border-t-red-500 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Alerts</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stats?.critical ?? 0}</p>
                <p className="text-[11px] text-red-600 font-semibold mt-0.5">High emergency priority</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACTIVE DISASTER INCIDENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Activity className="w-3.5 h-3.5" />
              Situational Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Active Disaster Reports
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Verified community reports updated in real time from across the 25 districts.
            </p>
          </div>

          <Link to="/disasters" className="self-start md:self-auto">
            <Button variant="outline" size="sm" iconRight={ArrowRight}>
              View All Incident Reports
            </Button>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {['All', ...DISASTER_TYPES].map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Incidents Grid */}
        {loading ? (
          <LoadingSpinner message="Scanning active reports..." />
        ) : filteredReports.length === 0 ? (
          <div className="card p-12 text-center bg-white border border-dashed border-slate-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-1">No Active Incidents for Category</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              There are currently no reported incidents matching this filter.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <DisasterCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </section>

      {/* 4. SAFETY GUIDANCE */}
      <section className="bg-slate-100/80 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Emergency Preparedness
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Safety Information & Protocols
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Crucial actions to take before, during, and after disasters strike in Sri Lanka.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {safetyGuidelines.map((item) => {
              const IconComp = item.icon;
              return (
                <Card key={item.type} className="bg-white">
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-2xs`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">{item.type}</h3>
                    <ul className="space-y-2.5">
                      {item.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/safety">
              <Button variant="outline" size="sm" iconRight={ChevronRight}>
                Read Full Safety Guide & Evacuation Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. VOLUNTEER & HELP TEAM CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-200 border border-white/20">
              <Shield className="w-3.5 h-3.5 text-white" />
              Community Response Units
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Join Your District & Town Help Team
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Are you trained in first aid, search and rescue, boat navigation, or logistics?
              Register to receive local incident task dispatches and help protect your community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <Link to="/help-team/register" className="w-full sm:w-auto">
              <Button variant="success" size="lg" className="w-full shadow-lg shadow-emerald-900/30">
                Join as Responder
              </Button>
            </Link>
            <Link to="/help-team/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20">
                Responder Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
