import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/shared";
import { ROUTES } from "~/config";
import { LoadingSpinner } from "~/shared";

export function PrivateRoute({ redirectTo = ROUTES.login }: { redirectTo?: string }) {
  const { loading, isAuth } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuth ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
