import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Map,
  Phone,
  LogOut,
  Menu,
  X,
  Shield,
  Home,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const defaultNavItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/reports', icon: FileText, label: 'Disaster Reports' },
  { to: '/admin/teams', icon: Shield, label: 'Help Teams & Dispatch' },
  { to: '/admin/map', icon: Map, label: 'Interactive Map' },
  { to: '/admin/emergency', icon: Phone, label: 'Emergency Contacts' },
];

const Sidebar = ({
  children,
  navItems = defaultNavItems,
  portalName = 'Admin Portal',
  portalSubtitle = 'Operations Command',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
            🇱🇰
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight leading-none">ReliefNet</p>
            <p className="text-blue-400 text-xs font-semibold mt-1">{portalName}</p>
          </div>
        </Link>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 py-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Operations
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Public Site Link */}
      <div className="px-4 py-2 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Public Website</span>
        </Link>
      </div>

      {/* Officer Profile & Sign Out */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="truncate min-w-0">
            <p className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-400 truncate">{admin?.email || 'admin@disasterlk.gov.lk'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/30 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 flex-shrink-0 sticky top-0 h-screen border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-900 flex flex-col shadow-2xl animate-slide-up">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-slate-950/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm">🇱🇰</span>
            <span className="font-bold text-white text-sm">{portalName}</span>
          </div>
          <Link to="/" className="text-xs text-blue-400 hover:underline">
            Exit
          </Link>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
