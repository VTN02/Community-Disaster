import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHelpTeamAuth } from '../../context/HelpTeamAuthContext';
import AvailabilityToggle from './AvailabilityToggle';
import { Shield, LayoutDashboard, ListTodo, LogOut, ArrowLeft } from 'lucide-react';

const HelpTeamNavbar = () => {
  const { member, logout } = useHelpTeamAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/help-team/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Portal title */}
          <div className="flex items-center gap-3">
            <Link to="/help-team/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-tight">ReliefNet</p>
                <p className="text-blue-400 text-xs font-semibold">Help Team Portal</p>
              </div>
            </Link>

            {member?.district && (
              <span className="hidden md:inline-flex items-center text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                📍 {member.town}, {member.district}
              </span>
            )}
          </div>

          {/* Navigation links */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              to="/help-team/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/help-team/dashboard')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/help-team/tasks"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive('/help-team/tasks')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              My Tasks
            </Link>
          </nav>

          {/* Right Controls: Availability, Member profile, Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <AvailabilityToggle compact />
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">{member?.name}</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[130px]">{member?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white hidden md:flex items-center gap-1 pl-2 border-l border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Site
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HelpTeamNavbar;
