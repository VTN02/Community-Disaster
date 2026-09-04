import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, Phone, LogOut, Menu, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
  { to: '/admin/map', icon: Map, label: 'Map View' },
  { to: '/admin/emergency', icon: Phone, label: 'Emergency Contacts' },
];

const AdminSidebar = ({ children }) => {
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
    <div className="flex flex-col h-full justify-between overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-base shadow-sm">🇱🇰</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Disaster Management</p>
              <p className="text-blue-400 text-xs font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav (Non-scrollable, static items) */}
        <nav className="p-3 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin info + Logout (Fixed at bottom) */}
      <div className="p-3 border-t border-slate-800 bg-slate-900 flex-shrink-0">
        <div className="px-3 py-2 mb-2 rounded-xl bg-slate-800/60 border border-slate-700/40">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Signed in as</p>
          <p className="text-sm font-semibold text-white truncate mt-0.5">{admin?.name || 'Administrator'}</p>
          <p className="text-xs text-slate-400 truncate">{admin?.email || 'admin@disasterlk.gov.lk'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/30 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex bg-slate-100 overflow-hidden">
      {/* Desktop Fixed Non-Scrollable Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 flex-shrink-0 h-full select-none z-30 border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-900 flex flex-col h-full shadow-2xl">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base">🇱🇰</span>
            <span className="font-bold text-slate-900 text-sm">Admin Portal</span>
          </div>
          <Link to="/" className="ml-auto text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
            ← Public Site
          </Link>
        </header>

        {/* Page content with independent scrolling */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;
