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

const LoginPage = lazy(() =>
  import("~/base").then((module) => ({ default: module.LoginPage }))
);

export function Layout() {
  const { isAuth } = useAuth();
  
  return (
    <div
      data-testid="layout"
      className="flex min-h-screen bg-black text-white"
    >
      { isAuth && (
        <Navbar />
      )}
      <main className="flex-1 overflow-y-auto grid place-items-center">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
