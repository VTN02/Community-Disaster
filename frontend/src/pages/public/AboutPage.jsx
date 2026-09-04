import { Link } from 'react-router-dom';
import { AlertTriangle, Users, MapPin, CheckCircle, Info } from 'lucide-react';

const AboutPage = () => (
  <div className="min-h-screen bg-slate-50">
    {/* Hero */}
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-5xl mb-4 block">🇱🇰</span>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">About Disaster Management LK</h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          A community-powered platform for reporting and discovering local disaster situations across Sri Lanka.
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* The Problem */}
      <section className="card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">The Problem</h2>
            <p className="text-slate-500">Why we built this platform</p>
          </div>
        </div>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Sri Lanka experiences frequent natural disasters — floods, landslides, storms, and more — 
            particularly during monsoon seasons. Every year, communities across the island are affected 
            by these events, often with little warning and limited access to real-time information.
          </p>
          <p>
            When a flood hits Gampaha or a landslide blocks the Kandy road, people in nearby areas 
            need to know <strong className="text-slate-800">immediately</strong>. Official channels and 
            news media are often too slow, and there is no simple way for ordinary people to share 
            what they are witnessing on the ground.
          </p>
          <p>
            This information gap costs time — and in emergencies, time costs lives.
          </p>
        </div>
      </section>

      {/* Our Solution */}
      <section className="card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Solution</h2>
            <p className="text-slate-500">How Disaster Management LK helps</p>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">
          Disaster Management LK is a simple, accessible web platform that allows anyone with a phone 
          or computer to report a local disaster within minutes — no registration required. 
          Reports are geolocated, categorised by severity, and displayed on a real-time map 
          for the entire community to see.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '📍', title: 'Precise Location', desc: 'Use GPS or select on map to pin exactly where the incident is.' },
            { icon: '⚡', title: 'Instant Reporting', desc: 'No login required. Report a disaster in under 2 minutes.' },
            { icon: '✅', title: 'Verified Reports', desc: 'Administrators review reports to filter out false information.' },
            { icon: '🗺️', title: 'Interactive Map', desc: 'See all incidents across Sri Lanka on a live disaster map.' },
            { icon: '🔍', title: 'Smart Filtering', desc: 'Filter by disaster type, severity, status, and district.' },
            { icon: '📞', title: 'Emergency Contacts', desc: 'Direct access to all official Sri Lankan emergency numbers.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Community Reporting Works */}
      <section className="card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">How Community Reporting Works</h2>
            <p className="text-slate-500">A simple, open, and verified process</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { step: '1', icon: '📝', title: 'Anyone Can Report', desc: 'No registration or login needed. Fill in the disaster type, location, severity, and description.' },
            { step: '2', icon: '📍', title: 'Location is Captured', desc: 'Use your phone\'s GPS or click anywhere on the map to mark the exact location.' },
            { step: '3', icon: '🔍', title: 'Administrators Review', desc: 'Our administrators verify the report for accuracy before it appears publicly.' },
            { step: '4', icon: '📢', title: 'Community is Informed', desc: 'Verified reports appear on the map and dashboard for everyone to see.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{item.icon} {item.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Verification */}
      <section className="card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Administrator Verification</h2>
            <p className="text-slate-500">Ensuring quality and accuracy</p>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          To protect the community from false or misleading reports, all submissions are reviewed 
          by authorised administrators before being publicly visible as verified. Administrators can:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Verify reports that are confirmed accurate',
            'Reject false, duplicate, or unclear reports',
            'Update the severity level based on evolving conditions',
            'Update the status (Pending → Investigating → Resolved)',
            'Manage emergency contact information',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Technology */}
      <section className="card p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">⚙️ Technology</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'React', desc: 'Frontend framework' },
            { label: 'Node.js', desc: 'Backend runtime' },
            { label: 'MongoDB', desc: 'Database' },
            { label: 'Leaflet', desc: 'Interactive maps' },
            { label: 'OpenStreetMap', desc: 'Map tiles (free)' },
            { label: 'JWT + bcrypt', desc: 'Secure authentication' },
          ].map((t) => (
            <div key={t.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
              <p className="font-semibold text-slate-800 text-sm">{t.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPORTANT DISCLAIMER */}
      <section className="card p-8 border-2 border-amber-300 bg-amber-50">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Important Disclaimer
        </h2>
        <p className="text-amber-800 leading-relaxed font-medium">
          Disaster Management LK is a community information platform. 
          For emergencies, users should contact the appropriate official emergency services 
          and follow official government instructions.
        </p>
        <p className="text-amber-700 mt-3 text-sm leading-relaxed">
          The information on this platform is user-submitted and community-verified. 
          While administrators review reports for accuracy, this platform does not replace 
          official disaster management channels. Always contact official emergency services 
          for life-threatening situations.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {[
            { name: 'Police', num: '119' },
            { name: 'Fire', num: '110' },
            { name: 'Ambulance', num: '1990' },
            { name: 'Disaster Mgmt', num: '117' },
          ].map((c) => (
            <a key={c.num} href={`tel:${c.num}`}
              className="flex-1 text-center bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
              {c.name}: {c.num}
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-6">
        <Link to="/report" className="btn-danger text-base py-4 px-10">
          🚨 Report a Disaster Now
        </Link>
      </div>
    </div>
  </div>
);

export default AboutPage;
