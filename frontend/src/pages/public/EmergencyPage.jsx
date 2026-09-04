import { useState, useEffect } from 'react';
import { Phone, AlertTriangle, Flame, Heart, Zap, Droplets, Shield } from 'lucide-react';
import { emergencyApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CATEGORY_CONFIG = {
  police: { icon: Shield, label: 'Police', color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600', headerBg: 'bg-blue-600' },
  fire: { icon: Flame, label: 'Fire & Rescue', color: 'bg-red-50 border-red-200', iconColor: 'text-red-600', headerBg: 'bg-red-600' },
  medical: { icon: Heart, label: 'Medical', color: 'bg-green-50 border-green-200', iconColor: 'text-green-600', headerBg: 'bg-green-600' },
  disaster: { icon: AlertTriangle, label: 'Disaster Management', color: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-600', headerBg: 'bg-orange-600' },
  utility: { icon: Zap, label: 'Utilities', color: 'bg-yellow-50 border-yellow-200', iconColor: 'text-yellow-600', headerBg: 'bg-yellow-600' },
  other: { icon: Phone, label: 'Other', color: 'bg-slate-50 border-slate-200', iconColor: 'text-slate-600', headerBg: 'bg-slate-600' },
};

const ContactCard = ({ contact }) => {
  const config = CATEGORY_CONFIG[contact.category] || CATEGORY_CONFIG.other;
  const IconComp = config.icon;

  return (
    <div className={`rounded-2xl border-2 ${config.color} overflow-hidden hover:shadow-md transition-all duration-200`}>
      <div className={`${config.headerBg} px-4 py-3 flex items-center gap-2`}>
        <IconComp className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-bold uppercase tracking-wide">{config.label}</span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg mb-1">{contact.name}</h3>
        <p className="text-slate-500 text-sm mb-3">{contact.organization}</p>
        {contact.description && (
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">{contact.description}</p>
        )}
        <a
          href={`tel:${contact.phone}`}
          id={`call-${contact.phone.replace(/\s/g, '')}`}
          className={`${config.headerBg} hover:opacity-90 text-white font-bold text-xl px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm`}
        >
          <Phone className="w-5 h-5" />
          {contact.phone}
        </a>
      </div>
    </div>
  );
};

const EmergencyPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  useEffect(() => { fetchContacts(); }, []);

  // Group by category
  const grouped = contacts.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const categoryOrder = ['police', 'fire', 'medical', 'disaster', 'utility', 'other'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">🚨 Emergency Contacts</h1>
          <p className="text-red-200 text-lg mb-6">
            Official Sri Lankan emergency service numbers. Tap to call.
          </p>
          {/* Top 4 quick dial */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { name: 'Police', number: '119', bg: 'bg-blue-600' },
              { name: 'Fire & Rescue', number: '110', bg: 'bg-red-600' },
              { name: 'Suwa Seriya', number: '1990', bg: 'bg-green-600' },
              { name: 'Disaster Mgmt', number: '117', bg: 'bg-orange-600' },
            ].map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className={`${c.bg} hover:opacity-90 text-white rounded-2xl p-4 text-center transition-all duration-200 shadow-lg`}
              >
                <p className="text-xs font-medium opacity-90 mb-1">{c.name}</p>
                <p className="text-3xl font-black">{c.number}</p>
                <p className="text-xs opacity-75 mt-1">Tap to call</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Important disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Important:</strong> Always call emergency services directly for life-threatening situations. 
            This platform is for community information only.
          </span>
        </div>
      </div>

      {/* All Contacts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">All Emergency Services</h2>

        {loading ? (
          <LoadingSpinner message="Loading emergency contacts..." />
        ) : error ? (
          <ErrorMessage onRetry={fetchContacts} message="Unable to load emergency contacts." />
        ) : (
          <div className="space-y-8">
            {categoryOrder.map((cat) => {
              const catContacts = grouped[cat];
              if (!catContacts || catContacts.length === 0) return null;
              const config = CATEGORY_CONFIG[cat];

              return (
                <div key={cat}>
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span className={`w-2 h-2 rounded-full ${config.headerBg}`}></span>
                    {config.label}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {catContacts.map((c) => (
                      <ContactCard key={c._id} contact={c} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Report reminder */}
        <div className="mt-10 card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-center">
          <h3 className="font-bold text-blue-900 mb-2">Non-Emergency Disaster Report</h3>
          <p className="text-blue-700 text-sm mb-4">
            If you witness a disaster or hazard that isn't immediately life-threatening, 
            help your community by submitting a report.
          </p>
          <a href="/report" className="btn-primary">
            🚨 Submit a Report
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
