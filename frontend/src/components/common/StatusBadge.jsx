import Badge from './Badge';

const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  return <Badge status={status} size={size} className={className} />;
};

export default StatusBadge;
