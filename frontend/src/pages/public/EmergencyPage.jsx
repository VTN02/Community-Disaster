import { useState, useEffect } from 'react';
import { Phone, AlertTriangle, Flame, Heart, Zap, Shield, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { emergencyApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const CATEGORY_CONFIG = {
  police: { icon: Shield, label: 'Police & Security', color: 'border-blue-200 bg-blue-50/40', headerBg: 'bg-blue-600', text: 'text-blue-700' },
  fire: { icon: Flame, label: 'Fire & Rescue', color: 'border-red-200 bg-red-50/40', headerBg: 'bg-red-600', text: 'text-red-700' },
  medical: { icon: Heart, label: 'Medical & Ambulance', color: 'border-emerald-200 bg-emerald-50/40', headerBg: 'bg-emerald-600', text: 'text-emerald-700' },
  disaster: { icon: AlertTriangle, label: 'Disaster Coordination', color: 'border-orange-200 bg-orange-50/40', headerBg: 'bg-orange-600', text: 'text-orange-700' },
  utility: { icon: Zap, label: 'Public Utilities (CEB / Water)', color: 'border-amber-200 bg-amber-50/40', headerBg: 'bg-amber-600', text: 'text-amber-800' },
  other: { icon: Phone, label: 'Essential Services', color: 'border-slate-200 bg-slate-50/40', headerBg: 'bg-slate-700', text: 'text-slate-700' },
};

const EmergencyPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await emergencyApi.getAll();
      setContacts(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.organization.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = filtered.reduce((acc, c) => {
    const cat = c.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  const categoryOrder = ['disaster', 'medical', 'police', 'fire', 'utility', 'other'];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                <Phone className="w-3.5 h-3.5" />
                Emergency Operations Dispatch
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                National Emergency Contacts
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Official, verified emergency hotlines across Sri Lanka. One-tap direct dial.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emergency services..."
                className="input-field pl-10 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Priority 4 Quick Dial Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
          {[
            { name: 'Disaster Centre (DMC)', number: '117', desc: 'Floods, Earth slips', color: 'bg-red-600' },
            { name: 'Suwa Seriya Ambulance', number: '1990', desc: 'Free Medical Aid', color: 'bg-emerald-600' },
            { name: 'Police Emergency', number: '119', desc: 'Crime, Rescue Escort', color: 'bg-blue-600' },
            { name: 'Fire & Rescue Service', number: '110', desc: 'Fires, Trapped Citizens', color: 'bg-amber-600' },
          ].map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="card p-4 hover:shadow-md transition-all flex items-center justify-between gap-3 border-l-4 border-l-red-600"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-xl ${item.color} text-white font-black text-sm flex items-center gap-1 flex-shrink-0 shadow-xs`}>
                <Phone className="w-3.5 h-3.5" /> {item.number}
              </span>
            </a>
          ))}
        </div>

        {/* Grouped Contacts */}
        {loading ? (
          <LoadingSpinner message="Retrieving national directory..." />
        ) : error ? (
          <ErrorMessage
            message="Unable to load emergency contacts. Please verify network and retry."
            onRetry={fetchContacts}
          />
        ) : (
          <div className="space-y-10">
            {categoryOrder.map((catKey) => {
              const catContacts = grouped[catKey];
              if (!catContacts || catContacts.length === 0) return null;
              const config = CATEGORY_CONFIG[catKey] || CATEGORY_CONFIG.other;
              const IconComp = config.icon;

              return (
                <div key={catKey}>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                    <div className={`w-7 h-7 rounded-lg ${config.headerBg} text-white flex items-center justify-center`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">{config.label}</h2>
                    <span className="text-xs text-slate-400 font-semibold ml-auto">
                      {catContacts.length} services
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catContacts.map((contact) => (
                      <Card key={contact._id} className={`p-5 flex flex-col justify-between ${config.color}`}>
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 text-sm">{contact.name}</h3>
                            <Badge variant="neutral" size="sm">
                              {contact.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold mb-2">{contact.organization}</p>
                          {contact.description && (
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                              {contact.description}
                            </p>
                          )}
                        </div>

                        <a
                          href={`tel:${contact.phone}`}
                          className={`w-full py-2.5 px-4 rounded-xl ${config.headerBg} hover:opacity-90 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs`}
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call {contact.phone}</span>
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyPage;
