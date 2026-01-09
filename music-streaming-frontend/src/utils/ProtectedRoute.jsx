import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ NOT LOGGED IN → LOGIN PAGE
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ LOGGED IN → ALLOW ACCESS
  return children;
};

export default ProtectedRoute;
