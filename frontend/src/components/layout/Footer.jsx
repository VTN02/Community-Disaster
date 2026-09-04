import { Link } from 'react-router-dom';
import { Phone, AlertTriangle, Shield, Heart, ExternalLink, ArrowRight } from 'lucide-react';

const emergencyNumbers = [
  { name: 'Disaster Management Centre', number: '117', tag: 'DMC 24/7' },
  { name: 'Suwa Seriya Free Ambulance', number: '1990', tag: 'Medical' },
  { name: 'Sri Lanka Police Emergency', number: '119', tag: 'Police' },
  { name: 'Fire & Rescue Service', number: '110', tag: 'Fire' },
];

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report Incident' },
  { to: '/disasters', label: 'Active Reports' },
  { to: '/map', label: 'Disaster Map' },
  { to: '/emergency', label: 'Emergency Directory' },
  { to: '/safety', label: 'Safety Guidelines' },
  { to: '/about', label: 'About Platform' },
];

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
    {/* Emergency Hotline Strip */}
    <div className="bg-slate-900/80 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">Emergency Hotlines</p>
            <p className="text-xs text-slate-300">Toll-free 24/7 national emergency services</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {emergencyNumbers.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 hover:border-slate-500 shadow-2xs"
            >
              <span className="text-red-400 font-extrabold">{item.number}</span>
              <span className="text-slate-400 font-normal">({item.tag})</span>
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* Main Footer Links */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md font-bold text-sm">
              🇱🇰
            </div>
            <div>
              <p className="font-extrabold text-white text-base leading-none">ReliefNet LK</p>
              <p className="text-blue-400 text-xs font-semibold mt-1">Disaster Management & Response</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
            A unified, community-powered early warning and disaster response system for Sri Lanka.
            Connecting citizens, volunteer rescue teams, and emergency responders in real time.
          </p>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-1 max-w-md">
            <p className="text-red-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Critical Emergency Notice
            </p>
            <p className="text-slate-400 leading-relaxed">
              If you or someone else is in immediate physical danger, contact <strong>119 (Police)</strong>,{' '}
              <strong>110 (Fire)</strong>, or <strong>1990 (Ambulance)</strong> immediately.
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            Navigation
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Portals & Operations */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            Response Portals
          </h3>
          <div className="space-y-2.5">
            <Link
              to="/help-team/dashboard"
              className="block p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 transition-all hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Help Team Portal
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold">
                  Field Units
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Incident task dispatches and status updates</p>
            </Link>

            <Link
              to="/admin/login"
              className="block p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 transition-all hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  🏛️ Admin Portal
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-semibold">
                  Command
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Operations monitoring and report verification</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ReliefNet LK · Sri Lanka Disaster Management Community Platform.</p>
        <p className="flex items-center gap-1">
          Made for Sri Lanka with <Heart className="w-3 h-3 text-red-500" />
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
