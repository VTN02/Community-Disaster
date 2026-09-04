import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHelpTeamAuth } from '../../context/HelpTeamAuthContext';
import { helpTeamAuthApi } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import {
  Shield,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Layers,
  Wrench,
} from 'lucide-react';

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

const AVAILABLE_SKILLS = [
  'Rescue',
  'Medical',
  'First Aid',
  'Boat Navigation',
  'Logistics',
  'Shelter Operations',
  'Firefighting',
  'Heavy Machinery',
  'Food & Supply',
  'Radio Communication',
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    district: 'Jaffna',
    town: 'Chavakachcheri',
    skills: ['Rescue', 'Medical'],
    availability: true,
  });

  const [loading, setLoading] = useState(false);
  const { login } = useHelpTeamAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      const updated = exists
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated.length === 0 ? ['Rescue'] : updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.district || !formData.town) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await helpTeamAuthApi.register(formData);
      if (res.data.success) {
        login(res.data.token, res.data.member);
        showToast(res.data.message || 'Account created successfully!', 'success');
        navigate('/help-team/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please check your details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const previewDistrictTeam = `${formData.district.trim() || 'District'} Helping Team`;
  const previewSubGroup = `${formData.town.trim() || 'Town'} Helping Sub Team`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center relative z-10 px-4">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Help Team Member Registration
        </h2>
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          Join your local disaster response network. You will be automatically assigned to your
          District Team and Town Sub Group.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Kamal Perera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="0771234567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
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
                    placeholder="kamal@helpteam.lk"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password *
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
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Location (District & Town) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  District *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Town / Sub-Area *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Chavakachcheri"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-400" />
                Specialized Skills (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {isSelected ? `✓ ${skill}` : skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Initial Availability Toggle */}
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Available for Deployment</p>
                <p className="text-[11px] text-slate-400">Set your status to active immediately upon registration</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Automatic Team Placement Live Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-800/60 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Automatic Placement Guarantee
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Based on your selected location, you will be automatically assigned to:
              </p>
              <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-blue-900/50">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">District Team</p>
                  <p className="text-white font-bold truncate">🏛️ {previewDistrictTeam}</p>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-blue-900/50">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Town Sub Team</p>
                  <p className="text-white font-bold truncate">🏘️ {previewSubGroup}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Complete Registration & Join Team
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Already have a Help Team account?{' '}
              <Link to="/help-team/login" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                Sign in
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

export default Register;
