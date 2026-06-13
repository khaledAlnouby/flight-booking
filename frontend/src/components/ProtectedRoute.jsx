import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.type !== allowedRole) {
    // Redirect to their respective home if they try to access wrong role page
    return <Navigate to={user.type === 'Company' ? '/company/home' : '/passenger/home'} replace />;
  }

  return children;
};

export default ProtectedRoute;
