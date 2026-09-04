import { Navigate } from 'react-router-dom';
import { useHelpTeamAuth } from '../context/HelpTeamAuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HelpTeamProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useHelpTeamAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Verifying Help Team session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/help-team/login" replace />;
  }

  return children;
};

export default HelpTeamProtectedRoute;
