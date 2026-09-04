// Severity config
export const SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-green-100 text-green-800 border-green-200',
    dot: 'bg-green-500',
    mapColor: '#22c55e',
    textColor: 'text-green-700',
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dot: 'bg-yellow-500',
    mapColor: '#eab308',
    textColor: 'text-yellow-700',
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
    mapColor: '#f97316',
    textColor: 'text-orange-700',
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-600',
    mapColor: '#dc2626',
    textColor: 'text-red-700',
  },
};

// Status config
export const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '🕐' },
  investigating: { label: 'Investigating', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔍' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: '❌' },
};

// Verification status config
export const VERIFICATION_CONFIG = {
  pending: { label: 'Unverified', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  verified: { label: 'Verified', color: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
};

// Disaster type icons
export const DISASTER_ICONS = {
  'Flood': '🌊',
  'Landslide': '⛰️',
  'Heavy Rain': '🌧️',
  'Road Blockage': '🚧',
  'Storm': '🌪️',
  'Fire': '🔥',
  'Building Damage': '🏚️',
  'Other': '⚠️',
};

export const DISASTER_TYPES = ['Flood', 'Landslide', 'Heavy Rain', 'Road Blockage', 'Storm', 'Fire', 'Building Damage', 'Other'];

export const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

// Format relative time
export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-LK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate distance between coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};
