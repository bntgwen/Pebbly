import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const location = useLocation();
  if (!currentUserId) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
