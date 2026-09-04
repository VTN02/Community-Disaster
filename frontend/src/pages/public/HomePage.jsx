import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Map, Phone, Shield, Activity, TrendingUp, Users, ChevronRight, Bot, Sparkles } from 'lucide-react';
import { reportsApi } from '../../services/api';
import DisasterCard from '../../components/disaster/DisasterCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DISASTER_ICONS } from '../../utils/constants';

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className={`card p-6 border-t-4 ${color}`}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <Icon className="w-5 h-5 text-slate-400" />
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

const HomePage = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, statsRes] = await Promise.all([
          reportsApi.getAll({ limit: 6, status: 'investigating' }),
          reportsApi.getStats(),
        ]);
        setRecentReports(reportsRes.data.data);
        setStats(statsRes.data.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm">🇱🇰</span>
              <span className="text-sm text-blue-300 font-medium">Community Disaster Platform — Sri Lanka</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Report Danger.{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Stay Informed.
              </span>
              <br />
              Stay Safe.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              A community-powered platform for reporting and discovering local disaster situations 
              across Sri Lanka. Together, we help our communities stay safe.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                to="/report"
                id="hero-report-btn"
                className="btn-danger text-base py-4 px-8 rounded-xl pulse-emergency"
              >
                <AlertTriangle className="w-5 h-5" />
                🚨 Report a Disaster
              </Link>
              <Link
                to="/map"
                id="hero-map-btn"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2"
              >
                <Map className="w-5 h-5" />
                🗺️ View Disaster Map
              </Link>
              <Link
                to="/assistant"
                id="hero-assistant-btn"
                className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border border-indigo-300/40 text-white font-bold px-7 py-4 rounded-xl transition-all duration-300 inline-flex items-center gap-3 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-105 active:scale-95"
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                </div>
                <span>Ask Disaster AI</span>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                  NEW
                </span>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Emergency Quick Access Bar */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <span className="text-sm font-bold text-red-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                🚨 Emergency:
              </span>
              {[
                { name: 'Police', number: '119' },
                { name: 'Fire', number: '110' },
                { name: 'Ambulance', number: '1990' },
                { name: 'Disaster Mgmt', number: '117' },
              ].map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-medium">{c.name}:</span>{' '}
                  <span className="font-bold text-red-400">{c.number}</span>
                </a>
              ))}
              <Link to="/emergency" className="ml-auto text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All contacts <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Reports" value={stats.total} color="border-t-blue-500" icon={Activity} />
              <StatCard label="Critical" value={stats.critical} color="border-t-red-500" icon={AlertTriangle} />
              <StatCard label="Investigating" value={stats.investigating} color="border-t-orange-500" icon={TrendingUp} />
              <StatCard label="Resolved" value={stats.resolved} color="border-t-green-500" icon={Users} />
            </div>
          </div>
        </section>
      )}

      {/* Why Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-4">Why Disaster Management LK?</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                During floods, landslides, and other emergencies across Sri Lanka, people need 
                quick access to accurate information about affected areas and nearby incidents. 
                Official channels alone are not always fast enough.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Disaster Management LK empowers communities to report incidents immediately, 
                helping neighbours, families, and emergency services stay informed and coordinate 
                faster responses.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🌊', label: 'Floods' },
                  { icon: '⛰️', label: 'Landslides' },
                  { icon: '🌧️', label: 'Heavy Rain' },
                  { icon: '🔥', label: 'Fires' },
                  { icon: '🚧', label: 'Road Blocks' },
                  { icon: '🌪️', label: 'Storms' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {[
                {
                  icon: '🤖',
                  title: 'AI Disaster Assistant',
                  desc: '24/7 smart guidance on flood safety, cyclone preparedness, emergency kits, and recovery.',
                },
                {
                  icon: '📍',
                  title: 'Location-Based Reporting',
                  desc: 'Use your current location or select on map to precisely pin where disasters occur.',
                },
                {
                  icon: '🔍',
                  title: 'Verified Information',
                  desc: 'Administrators review and verify reports to ensure accuracy and public safety.',
                },
                {
                  icon: '🗺️',
                  title: 'Real-Time Map',
                  desc: 'View all active incidents across Sri Lanka on an interactive map.',
                },
                {
                  icon: '📞',
                  title: 'Emergency Contacts',
                  desc: 'Quick access to official Sri Lankan emergency services numbers.',
                },
              ].map((item) => (
                <div key={item.title} className="card p-5 flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Active Incidents</h2>
              <p className="section-subtitle">Currently being investigated</p>
            </div>
            <Link to="/disasters" className="btn-outline btn-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading active incidents..." />
          ) : recentReports.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">✅ No active incidents at this time.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentReports.map((report) => (
                <DisasterCard key={report._id} report={report} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-blue-200 mb-12">Three simple steps to help your community</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '📍', title: 'Report', desc: 'Share the incident location and details using your phone or computer.' },
              { step: '2', icon: '✅', title: 'Verify', desc: 'Our administrators review and verify reports to confirm accuracy.' },
              { step: '3', icon: '📢', title: 'Inform', desc: 'Verified incidents appear on the map and dashboard for everyone to see.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-white/10 border-2 border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/report" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Report a Disaster
            </Link>
            <Link to="/safety" className="bg-white/10 border border-white/30 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Safety Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
