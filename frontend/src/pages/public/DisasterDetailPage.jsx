import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { reportsApi } from '../../services/api';
import SeverityBadge from '../../components/common/SeverityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { DISASTER_ICONS, SEVERITY_CONFIG, formatDate, timeAgo } from '../../utils/constants';

const SAFETY_TIPS = {
  Flood: [
    'Move to higher ground if instructed by authorities.',
    'Avoid walking or driving through floodwater.',
    'Stay away from electrical equipment in flooded areas.',
    'Follow official emergency instructions and evacuation orders.',
  ],
  Landslide: [
    'Move away from unstable slopes immediately.',
    'Avoid roads and areas affected by landslides.',
    'Follow evacuation instructions from authorities.',
    'Contact emergency services if people are trapped.',
  ],
  'Heavy Rain': [
    'Stay indoors when conditions are dangerous.',
    'Avoid unnecessary travel during heavy rain.',
    'Monitor official weather warnings.',
    'Prepare emergency supplies in case of prolonged rain.',
  ],
  Storm: [
    'Stay indoors and away from windows.',
    'Secure loose objects outside your home.',
    'Avoid coastal and low-lying areas.',
    'Monitor official weather bulletins.',
  ],
  Fire: [
    'Evacuate the area immediately if instructed.',
    'Call 110 (Fire & Rescue) immediately.',
    'Do not re-enter a building affected by fire.',
    'Stay low if there is smoke.',
  ],
  'Road Blockage': [
    'Use alternate routes to avoid the blocked area.',
    'Do not attempt to cross a blocked road.',
    'Follow instructions from police and road personnel.',
  ],
  'Building Damage': [
    'Do not enter a damaged building.',
    'Evacuate immediately and move to a safe location.',
    'Contact emergency services if people are trapped.',
  ],
};

const DisasterDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reportsApi.getOne(id);
        setReport(res.data.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen message="Loading incident details..." />;
  if (error || !report) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <ErrorMessage message="We couldn't load this incident report." />
        <Link to="/disasters" className="btn-outline btn-sm mt-4">← Back to Reports</Link>
      </div>
    </div>
  );

  const icon = DISASTER_ICONS[report.type] || '⚠️';
  const sev = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.medium;
  const safetyTips = SAFETY_TIPS[report.type] || [];
  const hasLocation = report.location?.latitude && report.location?.longitude;

  return (
    <div className="min-h-screen bg-slate-50 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link to="/disasters" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </Link>

        {/* Main Card */}
        <div className="card overflow-hidden mb-6">
          {/* Severity Banner */}
          <div className={`px-6 py-4 flex items-center justify-between ${
            report.severity === 'critical' ? 'bg-red-600' :
            report.severity === 'high' ? 'bg-orange-500' :
            report.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          } text-white`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-sm font-medium opacity-90">{report.type}</p>
                <h1 className="text-xl font-bold">{sev.label.toUpperCase()} SEVERITY</h1>
              </div>
            </div>
            <StatusBadge status={report.status} size="lg" />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Location */}
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="text-lg font-semibold text-slate-700">
                {report.area ? `${report.area}, ` : ''}{report.district}
              </span>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Severity', value: <SeverityBadge severity={report.severity} size="lg" /> },
                { label: 'Status', value: <StatusBadge status={report.status} size="lg" /> },
                { label: 'Reported', value: timeAgo(report.createdAt) },
                { label: 'Last Updated', value: timeAgo(report.updatedAt) },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">{item.label}</p>
                  <div className="font-semibold text-slate-800 text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="font-bold text-slate-900 mb-3">Incident Description</h2>
              <p className="text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">
                {report.description}
              </p>
            </div>

            {/* Full timestamp */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Reported on {formatDate(report.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Map */}
        {hasLocation && (
          <div className="card p-5 mb-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Incident Location
            </h2>
            <div style={{ height: '300px' }}>
              <MapContainer
                center={[report.location.latitude, report.location.longitude]}
                zoom={14}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
                <CircleMarker
                  center={[report.location.latitude, report.location.longitude]}
                  radius={14}
                  pathOptions={{ color: sev.mapColor, fillColor: sev.mapColor, fillOpacity: 0.7, weight: 3 }}
                >
                  <Popup>
                    <strong>{report.type}</strong><br />
                    {report.district}
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Coordinates: {report.location.latitude.toFixed(5)}, {report.location.longitude.toFixed(5)}
            </p>
          </div>
        )}

        {/* Safety Tips */}
        {safetyTips.length > 0 && (
          <div className="card p-5 border-l-4 border-l-amber-500">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              ⚠️ Safety Recommendations for {report.type}
            </h2>
            <ul className="space-y-2">
              {safetyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/disasters" className="btn-outline flex-1 justify-center">
            ← Back to All Reports
          </Link>
          <Link to="/emergency" className="btn-danger flex-1 justify-center">
            <AlertTriangle className="w-4 h-4" />
            Emergency Contacts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetailPage;
