import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHelpTeamAuth } from '../../context/HelpTeamAuthContext';
import { helpTeamAuthApi } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import { Shield, Lock, Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useHelpTeamAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await helpTeamAuthApi.login(formData);
      if (res.data.success) {
        login(res.data.token, res.data.member);
        showToast(`Welcome back, ${res.data.member.name}!`, 'success');
        navigate('/help-team/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick helper to autofill sample accounts
  const fillSample = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Help Team Portal</h2>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to access assigned disaster incidents and field response operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@helpteam.lk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In to Field Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-2">⚡ Quick Test Accounts:</p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillSample('kamal@helpteam.lk', 'Kamal@123')}
                className="w-full text-left text-xs bg-slate-800/60 hover:bg-slate-800 p-2 rounded-lg text-slate-300 transition-colors flex items-center justify-between"
              >
                <span>Kamal (Jaffna / Chavakachcheri)</span>
                <span className="text-[10px] text-blue-400 font-mono">Fill</span>
              </button>
              <button
                type="button"
                onClick={() => fillSample('nimali@helpteam.lk', 'Nimali@123')}
                className="w-full text-left text-xs bg-slate-800/60 hover:bg-slate-800 p-2 rounded-lg text-slate-300 transition-colors flex items-center justify-between"
              >
                <span>Nimali (Colombo / Baseline Rd)</span>
                <span className="text-[10px] text-blue-400 font-mono">Fill</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Not registered as a Help Team member yet?{' '}
              <Link to="/help-team/register" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                Join a Help Team
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to Disaster Management LK Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
