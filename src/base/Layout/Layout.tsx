import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "~/config";
import { LoadingSpinner, useAuth } from "~/shared";
import { PrivateRoute, Navbar } from "~/base";

const HomePage = lazy(() =>
  import("~/features").then((module) => ({ default: module.HomePage }))
);

const DashboardPage = lazy(() =>
  import("~/features").then((module) => ({ default: module.DashboardPage }))
);

const UserProfilePage = lazy(() =>
  import("~/features").then((module) => ({ default: module.UserProfilePage }))
);

const LoginPage = lazy(() =>
  import("~/base").then((module) => ({ default: module.LoginPage }))
);

export function Layout() {
  const { isAuth } = useAuth();

  return (
    <div
      data-testid="layout"
      className="flex min-h-screen bg-surface-1 text-primary"
    >
      { isAuth && (
        <Navbar />
      )}
      <main className="flex-1 overflow-y-auto grid place-items-center bg-surface-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.profile} element={<UserProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
