import Badge from './Badge';

const SeverityBadge = ({ severity, size = 'sm', className = '' }) => {
  return <Badge severity={severity} size={size} className={className} />;
};

export default SeverityBadge;
