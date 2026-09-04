import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft, AlertTriangle, Shield, CheckCircle, Phone, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { reportsApi } from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { DISASTER_ICONS, SEVERITY_CONFIG, formatDate, timeAgo } from '../../utils/constants';

const SAFETY_TIPS = {
  Flood: [
    'Move to designated higher ground or community shelters immediately.',
    'Do not attempt to walk, swim, or drive through flowing water.',
    'Disconnect main power switches before evacuation if safe to do so.',
    'Listen to local DMC radio broadcasts and siren alerts.',
  ],
  Landslide: [
    'Evacuate immediately away from steep cut-slopes and embankments.',
    'Avoid roads with visible mud flow, rockfall, or cracks.',
    'Contact emergency services (119 or 117) if people are trapped.',
    'Observe NBRO warning advisories for your district.',
  ],
  'Heavy Rain': [
    'Stay indoors in well-anchored structures away from unstable trees.',
    'Avoid traveling along mountain passes or waterlogged roads.',
    'Store clean drinking water, flashlights, and charged communication devices.',
  ],
  Storm: [
    'Stay indoors away from glass windows and loose roofing sheets.',
    'Secure outdoor equipment and livestock in advance.',
    'Keep away from high-voltage cables and fallen electrical poles.',
  ],
  Fire: [
    'Evacuate immediately without pausing to gather personal possessions.',
    'Call 110 (Fire & Rescue) immediately with exact location.',
    'Stay low below the smoke line and cover nose and mouth with a damp cloth.',
  ],
  'Road Blockage': [
    'Use official police detour routes to avoid the blocked road.',
    'Do not attempt to cross tree blockages or fallen utility lines.',
  ],
  'Building Damage': [
    'Do not enter partially collapsed or structurally compromised buildings.',
    'Establish a safe perimeter around the building.',
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

  if (loading) return <LoadingSpinner fullScreen message="Retrieving incident dossier..." />;
  if (error || !report)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <ErrorMessage message="Unable to load this incident report record." />
          <Link to="/disasters" className="mt-4 inline-block">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Active Reports
            </Button>
          </Link>
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
        {/* Back Link */}
        <Link
          to="/disasters"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Reports
        </Link>

        {/* Main Incident Card */}
        <Card className="mb-6 overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl sm:text-2xl font-black text-white">{report.type}</h1>
                    <Badge severity={report.severity} size="md" />
                    <Badge status={report.status} size="md" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-white">{report.district}</span>
                    {report.area && <span>· {report.area}</span>}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-400 flex-shrink-0">
                <p className="flex items-center gap-1 sm:justify-end">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Reported {timeAgo(report.createdAt)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(report.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Incident Description
              </h3>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {report.description}
              </p>
            </div>

            {/* Optional Image */}
            {report.imageUrl && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Field Photo Evidence
                </h3>
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-lg">
                  <img
                    src={report.imageUrl}
                    alt={report.type}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            {/* Location Map View */}
            {hasLocation && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    Pinpoint Geographic Location
                  </h3>
                  <a
                    href={`https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>

                <div className="h-64 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs">
                  <MapContainer
                    center={[report.location.latitude, report.location.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CircleMarker
                      center={[report.location.latitude, report.location.longitude]}
                      radius={12}
                      pathOptions={{
                        color: sev.mapColor,
                        fillColor: sev.mapColor,
                        fillOpacity: 0.8,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="text-xs font-sans">
                          <strong>{report.type}</strong>
                          <br />
                          {report.area ? `${report.area}, ` : ''}
                          {report.district}
                        </div>
                      </Popup>
                    </CircleMarker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Safety Guidelines Card */}
        {safetyTips.length > 0 && (
          <Card className="p-6 mb-6 border-blue-200 bg-blue-50/30">
            <div className="flex items-center gap-2.5 mb-3 text-blue-900">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm sm:text-base">
                Safety Guidance for {report.type} Situations
              </h3>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
              {safetyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Emergency Assistance Callout */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400" /> Need Immediate Emergency Assistance?
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Contact 24/7 disaster management authorities or emergency first responders.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="tel:117" className="btn-danger btn-sm text-xs font-bold">
              Call DMC (117)
            </a>
            <a href="tel:1990" className="btn-success btn-sm text-xs font-bold">
              Call 1990
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetailPage;
