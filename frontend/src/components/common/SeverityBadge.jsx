import { SEVERITY_CONFIG } from '../../utils/constants';

const SeverityBadge = ({ severity, size = 'sm' }) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
  return (
    <span className={`badge border ${config.color} ${size === 'lg' ? 'text-sm px-3 py-1.5' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export default SeverityBadge;
