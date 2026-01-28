import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContextSimple";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { session, profile, loading } = useAuth();
  console.log(profile);
  // Still loading auth state
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
