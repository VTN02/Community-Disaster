import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation, X } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Sri Lanka center
const SRI_LANKA_CENTER = [7.8731, 80.7718];

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return null;
};

const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.latitude, coords.longitude], 14, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

const LocationPicker = ({ value, onChange }) => {
  const [showMap, setShowMap] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGeoLoading(false);
        setShowMap(true);
      },
      () => {
        setGeoError('Unable to get your location. Please allow location access or select on map.');
        setGeoLoading(false);
      }
    );
  };

  return (
    <div className="space-y-3">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={geoLoading}
          className="btn-outline btn-sm flex-1 justify-center"
        >
          <Navigation className="w-4 h-4" />
          {geoLoading ? 'Getting Location...' : '📍 Use My Current Location'}
        </button>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="btn-ghost btn-sm flex-1 justify-center border border-slate-200"
        >
          <MapPin className="w-4 h-4" />
          {showMap ? 'Hide Map' : '🗺️ Select on Map'}
        </button>
      </div>

      {/* Error */}
      {geoError && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{geoError}</p>
      )}

      {/* Selected coordinates display */}
      {value?.latitude && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Location Selected</p>
            <p className="text-xs text-blue-600">
              {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-auto text-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <p className="text-xs text-slate-500">👆 Click anywhere on the map to select the incident location</p>
          </div>
          <div style={{ height: '350px' }}>
            <MapContainer
              center={value?.latitude ? [value.latitude, value.longitude] : SRI_LANKA_CENTER}
              zoom={value?.latitude ? 13 : 7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              />
              <MapClickHandler onLocationSelect={onChange} />
              {value?.latitude && (
                <>
                  <Marker position={[value.latitude, value.longitude]} />
                  <FlyTo coords={value} />
                </>
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
