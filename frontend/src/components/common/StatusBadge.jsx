import { STATUS_CONFIG } from '../../utils/constants';

const StatusBadge = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`badge border ${config.color} ${size === 'lg' ? 'text-sm px-3 py-1.5' : ''}`}>
      {config.icon} {config.label}
    </span>
  );
};

export default StatusBadge;
