import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, AlertTriangle, Phone, Sparkles, Bot } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/disasters', label: 'Active Reports' },
  { to: '/map', label: 'Disaster Map' },
  { to: '/assistant', label: 'AI Assistant', isAi: true },
  { to: '/emergency', label: 'Emergency' },
  { to: '/safety', label: 'Safety Guide' },
  { to: '/about', label: 'About' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-base">🇱🇰</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">Disaster Management</p>
              <p className="text-blue-600 text-xs font-semibold">LK</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              if (link.isAi) {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    id="nav-ai-assistant-btn"
                    className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 border ${
                      active
                        ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 text-white border-indigo-300 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-indigo-400/40 shadow-indigo-500/20'
                    }`}
                  >
                    {/* Pulsing Active Status Dot */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 border border-white/80" />
                    </span>

                    {/* AI Logo Icon Box */}
                    <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                      <Bot className="w-3.5 h-3.5" />
                    </div>

                    <span className="tracking-wide">{link.label}</span>

                    <span className="bg-white/20 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      AI
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive(link.to)
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Report Button + Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link
              to="/report"
              className="btn-danger btn-sm text-sm hidden sm:inline-flex"
            >
              <AlertTriangle className="w-4 h-4" />
              Report
            </Link>
            <Link
              to="/emergency"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hidden sm:flex"
              title="Emergency Contacts"
            >
              <Phone className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              if (link.isAi) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 my-1.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span>{link.label}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-extrabold px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AI Chat
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              to="/report"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center btn-danger py-3 mt-2"
            >
              🚨 Report Disaster
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
