import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Map,
  Phone,
  Shield,
  Activity,
  TrendingUp,
  Users,
  ChevronRight,
  Bot,
  Sparkles,
  MapPin,
  CheckCircle2,
  Radio,
  BellRing,
  ExternalLink,
  LifeBuoy,
  Clock,
  Waves,
  MountainSnow,
  CloudRain,
  Flame,
  ArrowRight,
  Check
} from 'lucide-react';
import { reportsApi } from '../../services/api';
import DisasterCard from '../../components/disaster/DisasterCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DISASTER_ICONS, DISASTER_TYPES } from '../../utils/constants';

const StatCard = ({ label, value, color, icon: Icon, description, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value ?? '0'}</p>
      {trend && (
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          {trend}
        </span>
      )}
    </div>
    {description && (
      <p className="text-xs text-slate-500 mt-2 font-medium">{description}</p>
    )}
  </div>
);

const emergencyHotlines = [
  {
    name: 'Disaster Management Centre (DMC)',
    shortName: 'DMC Hotline',
    number: '117',
    desc: 'National early warning, flood & landslide coordination',
    bg: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    btnBg: 'bg-red-600 hover:bg-red-700 text-white',
    badge: 'Primary 24/7'
  },
  {
    name: 'Sri Lanka Police Emergency',
    shortName: 'Police Emergency',
    number: '119',
    desc: 'Law enforcement, rescue access, immediate security',
    bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    badge: 'Emergency'
  },
  {
    name: 'Suwa Seriya Free Ambulance',
    shortName: 'Ambulance Service',
    number: '1990',
    desc: 'Island-wide free pre-hospital medical emergency care',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    badge: 'Medical'
  },
  {
    name: 'Fire & Rescue Service',
    shortName: 'Fire Brigade',
    number: '110',
    desc: 'Urban search & rescue, fire outbreaks, entrapment',
    bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    badge: 'Rescue'
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
          reportsApi.getAll({ limit: 9 }),
          reportsApi.getStats(),
        ]);
        setRecentReports(reportsRes.data.data);
        setStats(statsRes.data.data);
      } catch {
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
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      {/* Top Official Advisory / Emergency Live Bar */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="font-bold tracking-wide uppercase">DMC Sri Lanka Emergency Network</span>
              <span className="hidden sm:inline text-red-200">|</span>
              <span className="hidden md:inline text-red-100">
                24/7 Island-wide Disaster Monitoring & Early Warning
              </span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <span className="font-semibold text-red-100 hidden sm:inline">Emergency Hotlines:</span>
              <a
                href="tel:117"
                className="inline-flex items-center gap-1 font-bold bg-white text-red-700 px-2.5 py-0.5 rounded-full hover:bg-red-50 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" /> 117 (DMC)
              </a>
              <a
                href="tel:1990"
                className="inline-flex items-center gap-1 font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> 1990 (Ambulance)
              </a>
              <Link
                to="/emergency"
                className="hidden lg:flex items-center gap-1 text-red-100 hover:text-white underline font-medium text-xs"
              >
                All Numbers <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Subtle Background Pattern & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2.5 glass-card px-4 py-2 rounded-full shadow-inner">
                <span className="text-base">🇱🇰</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-200">
                  National Disaster Management Network — Sri Lanka
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Protecting Lives.{' '}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                  Real-Time Disaster Response
                </span>{' '}
                <br />
                Across Sri Lanka.
              </h1>

              {/* Mission Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Empowering communities, emergency first responders, and local authorities with instant 
                GPS-accurate reporting, verified situational intelligence, and coordinated relief for floods, 
                landslides, and extreme weather.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/report"
                  id="hero-report-btn"
                  className="btn-danger text-base font-bold py-4 px-8 rounded-xl shadow-lg shadow-red-600/30 pulse-emergency"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Report a Disaster Now
                </Link>

                <Link
                  to="/map"
                  id="hero-map-btn"
                  className="glass-card hover:bg-white/15 text-white font-semibold px-7 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2 border border-white/20 shadow-sm hover:border-white/40"
                >
                  <Map className="w-5 h-5 text-cyan-400" />
                  Interactive Map
                </Link>

                {/* AI Assistant Button */}
                <Link
                  to="/assistant"
                  id="hero-assistant-btn"
                  className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border border-indigo-300/40 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 inline-flex items-center gap-2.5 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white shadow-inner">
                    <Bot className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span>Ask Disaster AI</span>
                  <span className="bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                    AI
                  </span>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                </Link>

                <Link
                  to="/emergency"
                  className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium px-5 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2 border border-slate-700"
                >
                  <Phone className="w-4 h-4 text-red-400" />
                  Hotlines
                </Link>
              </div>

              {/* Feature Verification Chips */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 max-w-lg text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No Login Needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>GPS Auto-Pin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Admin Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase with public/dmc_slider_04.jpg */}
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Ambient Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>

                {/* Primary Card Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl">
                  {/* Featured Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src="/dmc_slider_04.jpg"
                      alt="Disaster Management Centre Sri Lanka Field Operations"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-700 ease-out"
                      loading="eager"
                    />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Live Badge Over Image */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 glass-card-dark px-3 py-1.5 rounded-full border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">Live Surveillance</span>
                    </div>

                    <div className="absolute top-4 right-4 glass-card-dark px-3 py-1.5 rounded-full border border-white/20">
                      <span className="text-xs font-semibold text-blue-300">DMC Operations</span>
                    </div>

                    {/* Content inside image footer */}
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <div className="inline-block bg-blue-600/90 text-white text-[11px] font-bold uppercase px-2.5 py-0.5 rounded mb-1">
                        Sri Lanka National Response
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        Disaster Management Centre Field Readiness
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                        Coordinated flood & landslide monitoring across all 25 districts.
                      </p>
                    </div>
                  </div>

                  {/* Operational Status Sub-bar */}
                  <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span className="text-slate-300 font-medium">Early Warning System: <strong className="text-emerald-400">Operational</strong></span>
                    </div>
                    <Link
                      to="/map"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      View Live Map <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Floating Micro-Badge */}
                <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">25 Districts Covered</p>
                    <p className="text-[11px] text-slate-500">Real-time crowdsourced reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Key Metrics / Stats Section */}
      <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Total Reports"
            value={stats?.total ?? '12'}
            color="bg-blue-600"
            icon={Activity}
            description="Submitted by citizens & officials"
            trend="+Active"
          />
          <StatCard
            label="Critical Incidents"
            value={stats?.critical ?? '3'}
            color="bg-red-600"
            icon={AlertTriangle}
            description="High-priority emergency alerts"
          />
          <StatCard
            label="Under Investigation"
            value={stats?.investigating ?? '7'}
            color="bg-amber-500"
            icon={TrendingUp}
            description="Currently being handled on ground"
          />
          <StatCard
            label="Resolved Cases"
            value={stats?.resolved ?? '2'}
            color="bg-emerald-600"
            icon={CheckCircle2}
            description="Hazard cleared or safe status"
            trend="Verified"
          />
        </div>
      </section>

      {/* Emergency Speed-Dial Hotline Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Phone className="w-4 h-4" /> Immediate Assistance
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              National Emergency Speed Dial
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Direct toll-free connections to Sri Lanka's vital emergency dispatch operators.
            </p>
          </div>
          <Link
            to="/emergency"
            className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Emergency Departments <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyHotlines.map((hotline) => (
            <div
              key={hotline.number}
              className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${hotline.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current">
                    {hotline.badge}
                  </span>
                  <span className="text-2xl font-black tracking-tight">{hotline.number}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-1">{hotline.shortName}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{hotline.desc}</p>
              </div>

              <a
                href={`tel:${hotline.number}`}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${hotline.btnBg}`}
              >
                <Phone className="w-3.5 h-3.5" />
                Call {hotline.number}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Active Incidents Feed with Category Filtering */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Live Incident Stream
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Active Disaster Reports
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Real-time incident reports submitted across Sri Lanka's provinces.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/report" className="btn-danger btn-sm text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> Submit Report
              </Link>
              <Link to="/disasters" className="btn-outline btn-sm text-xs font-bold">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            <button
              onClick={() => setSelectedType('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === 'All'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Incidents ({recentReports.length})
            </button>
            {DISASTER_TYPES.map((type) => {
              const count = recentReports.filter((r) => r.type === type).length;
              const icon = DISASTER_ICONS[type] || '⚠️';
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    selectedType === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{type}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedType === type ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Incident Cards Grid */}
          {loading ? (
            <LoadingSpinner message="Retrieving real-time incident reports..." />
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-slate-700">No active incidents in this category</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No reports currently matching "{selectedType}". Select "All Incidents" or browse the map.
              </p>
              <button
                onClick={() => setSelectedType('All')}
                className="mt-4 btn-outline btn-sm text-xs"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.slice(0, 6).map((report) => (
                <DisasterCard key={report._id} report={report} />
              ))}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need a geographic overview?</h4>
                <p className="text-xs text-slate-500">Explore interactive risk maps with flood & landslide overlays.</p>
              </div>
            </div>
            <Link to="/map" className="btn-primary text-xs py-3 px-5 rounded-xl whitespace-nowrap">
              Open Full-Screen Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Spotlight Section: DMC & Emergency Preparedness */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Visual Frame */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
                  <img
                    src="/dmc_slider_04.jpg"
                    alt="Sri Lanka Disaster Early Warning and Relief Command"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wide">
                      Sri Lanka DMC Partner Network
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 leading-tight">
                      Disaster Management Centre Emergency Protocol
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Coordinating early warning advisories with the Department of Meteorology and Irrigation Department.
                    </p>
                  </div>
                </div>

                {/* Overlaid stats pill */}
                <div className="hidden sm:block absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-lg border border-blue-400/40 text-xs font-bold">
                  ⚡ 24/7 Monitoring Across 25 Districts
                </div>
              </div>
            </div>

            {/* Narrative & Pillars */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Community Resilience & Safety
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Rapid Intelligence.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Coordinated Action.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                During tropical depressions, southwest monsoons, and river basin cresting, every second 
                counts. Disaster Management LK bridges the gap between ground reality and emergency services, 
                giving ordinary citizens a voice and emergency teams immediate situational awareness.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-2.5">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Instant Geolocation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    One-tap GPS capture or interactive pin drop for pin-point hazard localization.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm mb-2.5">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Authority Verification</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Admin moderation checks reports against official bulletins to prevent misinformation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-2.5">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Live Map Integration</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Color-coded severity markers help commuters, relief trucks, and residents steer clear.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-2.5">
                    04
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">Emergency Hotline Link</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Immediate tap-to-call for 117 (DMC), 119 (Police), and 1990 (Suwa Seriya).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3-Step Community Process) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Community Response Protocol
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              How Disaster Management LK Works
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Simple, transparent steps designed for rapid execution even during network congestion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Report Hazard Instantly</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take note of rising water, falling rocks, or blocked roads. Select the hazard type, 
                let GPS locate your position, and submit without logging in.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verification & Triage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Disaster coordinators review citizen submissions, confirm with divisional authorities, 
                and escalate critical threats to active rescue units.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Live Map & Public Alert</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The alert appears instantly on the interactive nationwide map so neighbors, drivers, 
                and families can avoid dangerous zones.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/report"
              className="btn-danger py-3.5 px-8 rounded-xl font-bold text-sm shadow-md"
            >
              <AlertTriangle className="w-4 h-4" />
              File an Incident Report
            </Link>
            <Link
              to="/safety"
              className="btn-outline py-3.5 px-8 rounded-xl font-bold text-sm"
            >
              <Shield className="w-4 h-4" />
              View Disaster Safety Manual
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Preparedness / Safety Tips Preview */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Preparedness</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                Disaster Safety Guidelines
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Vital precautions recommended by Sri Lankan emergency responders.
              </p>
            </div>
            <Link to="/safety" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Read Complete Guide <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl mb-2 block">🌊</span>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Flood Safety</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Never walk or drive through moving floodwaters. Turn off the main electrical switch before water enters.
              </p>
              <Link to="/safety" className="text-xs font-semibold text-blue-600 hover:underline">
                Flood steps →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl mb-2 block">⛰️</span>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Landslide Warnings</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Watch for sudden cracks in soil or walls, leaning trees, or muddy spring waters on slopes. Evacuate early.
              </p>
              <Link to="/safety" className="text-xs font-semibold text-blue-600 hover:underline">
                NBRO warnings →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl mb-2 block">⚡</span>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Lightning & Storms</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Stay indoors away from windows, corded phones, and plumbing. Avoid open paddy fields and tall isolated trees.
              </p>
              <Link to="/safety" className="text-xs font-semibold text-blue-600 hover:underline">
                Storm tips →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl mb-2 block">🎒</span>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Emergency Go-Bag</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Pack clean drinking water, dry rations, torch, power bank, NIC copies, and essential medicines in waterproof bags.
              </p>
              <Link to="/safety" className="text-xs font-semibold text-blue-600 hover:underline">
                Bag checklist →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Official Disclaimer Banner */}
      <section className="py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-slate-200">Official Notice:</strong> Disaster Management LK is a community information 
            and situational awareness platform. In life-threatening emergencies, immediately dial <strong className="text-red-400">117 (DMC)</strong> or <strong className="text-red-400">119 (Police)</strong>.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/about" className="text-slate-300 hover:text-white underline">
              About Platform
            </Link>
            <Link to="/admin/login" className="text-slate-500 hover:text-slate-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
