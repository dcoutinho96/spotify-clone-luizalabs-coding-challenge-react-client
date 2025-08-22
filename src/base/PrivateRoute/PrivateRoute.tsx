import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "~/config";
import { LoadingSpinner, useAuth } from '~/shared'

type PrivateRouteProps = Readonly<{
  redirectTo?: string;
}>;

export function PrivateRoute({ redirectTo = ROUTES.login }: PrivateRouteProps) {
  const { loading, isAuth } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuth ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
