import { Link } from 'react-router-dom';
import { Phone, AlertTriangle, Shield, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-base">🇱🇰</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Disaster Management LK</p>
              <p className="text-blue-400 text-xs">Report. Inform. Stay Safe.</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            A community-powered disaster reporting and information platform for Sri Lanka. 
            Helping communities stay informed during emergencies.
          </p>
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-xl">
            <p className="text-xs text-red-300 font-semibold">⚠️ Important</p>
            <p className="text-xs text-slate-400 mt-1">
              This is a community information platform. For emergencies, always contact official emergency services.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/report', label: 'Report Disaster' },
              { to: '/disasters', label: 'Active Reports' },
              { to: '/map', label: 'Disaster Map' },
              { to: '/safety', label: 'Safety Guide' },
              { to: '/about', label: 'About' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Numbers */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-400" />
            Emergency Numbers
          </h3>
          <ul className="space-y-2.5">
            {[
              { name: 'Police', number: '119' },
              { name: 'Fire & Rescue', number: '110' },
              { name: 'Suwa Seriya', number: '1990' },
              { name: 'Disaster Mgmt', number: '117' },
            ].map((contact) => (
              <li key={contact.number} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{contact.name}</span>
                <a
                  href={`tel:${contact.number}`}
                  className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
                >
                  {contact.number}
                </a>
              </li>
            ))}
          </ul>
          <Link
            to="/emergency"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
          >
            View all contacts →
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Disaster Management LK. Community Information Platform.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Admin Portal
          </Link>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> for Sri Lanka
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
