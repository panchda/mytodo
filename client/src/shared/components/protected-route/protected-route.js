import { Navigate } from "react-router-dom";
import { useAuth } from "../../../stores/use-auth";

export default function ProtectedRoute({ children }) {
  const token =
    useAuth((state) => state.token) || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
