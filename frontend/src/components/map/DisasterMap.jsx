import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { SEVERITY_CONFIG, DISASTER_ICONS, STATUS_CONFIG, timeAgo } from '../../utils/constants';
import L from 'leaflet';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SRI_LANKA_CENTER = [7.8731, 80.7718];

const FlyToUser = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 12, { duration: 1.5 });
  }, [coords, map]);
  return null;
};

const DisasterMap = ({ reports = [], userLocation = null, height = '500px' }) => {
  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer
        center={SRI_LANKA_CENTER}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        {/* User location marker */}
        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={10}
            pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.8, weight: 2 }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-blue-700">📍 Your Location</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Disaster markers */}
        {reports.map((report) => {
          if (!report.location?.latitude || !report.location?.longitude) return null;
          const sev = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.medium;
          const icon = DISASTER_ICONS[report.type] || '⚠️';
          const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;

          return (
            <CircleMarker
              key={report._id}
              center={[report.location.latitude, report.location.longitude]}
              radius={report.severity === 'critical' ? 14 : report.severity === 'high' ? 12 : 10}
              pathOptions={{
                color: sev.mapColor,
                fillColor: sev.mapColor,
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{report.type}</p>
                      <p className="text-xs text-slate-500">
                        {report.area ? `${report.area}, ` : ''}{report.district}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Severity</span>
                      <span className="text-xs font-bold" style={{ color: sev.mapColor }}>
                        {sev.label.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Status</span>
                      <span className="text-xs font-medium">{statusConfig.icon} {statusConfig.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Reported</span>
                      <span className="text-xs text-slate-600">{timeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/disasters/${report._id}`}
                    className="block text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-1.5 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {userLocation && <FlyToUser coords={userLocation} />}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
