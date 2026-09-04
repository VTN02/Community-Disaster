import Loader from './Loader';

const LoadingSpinner = ({ message, fullScreen, size }) => {
  return <Loader message={message} fullScreen={fullScreen} size={size} />;
};

export default LoadingSpinner;
