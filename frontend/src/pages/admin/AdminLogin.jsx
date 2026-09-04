import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Shield, ArrowRight, Home } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      login(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@disasterlk.gov.lk');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-600/20 mb-4">
          <span className="text-2xl">🇱🇰</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ReliefNet Command Center
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Official Administrative Portal & Operational Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-8 shadow-2xl rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Administrator Sign In</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 rounded-xl p-3.5 mb-5 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5" htmlFor="admin-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@disasterlk.gov.lk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2 text-sm shadow-lg shadow-blue-600/25"
            >
              Access Operations Command
            </Button>
          </form>

          {/* Quick Demo Credential Button */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={fillDemo}
              className="w-full text-left text-xs bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl text-slate-300 transition-colors flex items-center justify-between"
            >
              <span>Fill Default Admin Credentials</span>
              <span className="text-[10px] text-blue-400 font-mono">admin@disasterlk.gov.lk</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center flex items-center justify-center gap-4 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-300 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Public Site
          </Link>
          <span>·</span>
          <Link to="/help-team/login" className="hover:text-slate-300 flex items-center gap-1 transition-colors">
            <Shield className="w-3.5 h-3.5" /> Help Team Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
