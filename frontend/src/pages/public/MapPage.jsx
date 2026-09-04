import { useState, useEffect } from 'react';
import { Navigation, Layers } from 'lucide-react';
import { reportsApi } from '../../services/api';
import DisasterMap from '../../components/map/DisasterMap';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SEVERITY_CONFIG } from '../../utils/constants';

const MapPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reportsApi.getAll({ limit: 200 });
        setReports(res.data.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  const filteredReports = selectedSeverity
    ? reports.filter((r) => r.severity === selectedSeverity)
    : reports;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Disaster Map
            </h1>
            <p className="text-sm text-slate-500">
              {filteredReports.length} incidents shown across Sri Lanka
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="input-field py-2 text-sm w-auto"
            >
              <option value="">All Severities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            {/* My Location */}
            <button
              onClick={handleGetLocation}
              disabled={geoLoading}
              className="btn-outline btn-sm"
            >
              <Navigation className="w-4 h-4" />
              {geoLoading ? 'Getting location...' : '📍 My Location'}
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Severity:</span>
          {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedSeverity(selectedSeverity === key ? '' : key)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-all ${selectedSeverity === key ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}`}
            >
              <span className={`w-3 h-3 rounded-full ${config.dot}`}></span>
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {loading ? (
          <div className="h-[600px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
            <LoadingSpinner message="Loading map data..." />
          </div>
        ) : (
          <DisasterMap
            reports={filteredReports}
            userLocation={userLocation}
            height="calc(100vh - 200px)"
          />
        )}
      </div>

      {/* Stats below map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(SEVERITY_CONFIG).map(([key, config]) => {
            const count = reports.filter((r) => r.severity === key).length;
            return (
              <div key={key} className={`card p-4 text-center border-t-4 ${
                key === 'critical' ? 'border-t-red-600' :
                key === 'high' ? 'border-t-orange-500' :
                key === 'medium' ? 'border-t-yellow-500' : 'border-t-green-500'
              }`}>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-sm text-slate-500">{config.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
