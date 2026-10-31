import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Memeriksa autentikasi...</div>;
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;
