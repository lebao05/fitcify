import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, userRole }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

function GuestRoute({ children, user }) {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export { ProtectedRoute, GuestRoute };
