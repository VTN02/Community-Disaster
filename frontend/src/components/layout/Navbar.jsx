import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  AlertTriangle,
  Phone,
  Shield,
  MapPin,
  LifeBuoy,
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/disasters', label: 'Active Reports' },
  { to: '/map', label: 'Disaster Map' },
  { to: '/emergency', label: 'Emergency Contacts' },
  { to: '/safety', label: 'Safety Guide' },
  { to: '/about', label: 'About' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Advisory Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white truncate">
              National Disaster Monitoring & Early Warning Network — Sri Lanka
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-slate-400">
            <span>24/7 Hotline:</span>
            <a href="tel:117" className="text-white hover:text-red-400 font-bold">
              📞 117 (DMC)
            </a>
            <a href="tel:1990" className="text-white hover:text-emerald-400 font-bold">
              🚑 1990 (Ambulance)
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-base">🇱🇰</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                  ReliefNet
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  LK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Disaster Response Network</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Help Team Portal Button */}
            <Link
              to="/help-team/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-200 shadow-2xs hover:shadow-xs"
              title="Help Team Operations Portal"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Help Team</span>
            </Link>

            {/* Emergency Hotline Button */}
            <Link
              to="/emergency"
              className="hidden md:inline-flex p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Emergency Hotlines"
            >
              <Phone className="w-4 h-4" />
            </Link>

            {/* Primary Report Button */}
            <Link
              to="/report"
              className="btn-danger btn-sm text-xs shadow-md shadow-red-500/20 hover:shadow-red-500/30"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Disaster</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl animate-slide-up">
          <div className="px-4 py-4 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/help-team/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200"
              >
                <Shield className="w-4 h-4" />
                Help Team Portal
              </Link>
              <Link
                to="/report"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full btn-danger py-2.5 text-xs font-bold"
              >
                <AlertTriangle className="w-4 h-4" />
                🚨 Report Disaster Incident
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
