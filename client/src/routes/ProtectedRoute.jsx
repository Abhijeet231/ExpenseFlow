import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const { status, user } = useAuth();

  // Still checking cookie/session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === "manager" ? "/manager" : "/dashboard"} replace />;
  }

  return children;
}