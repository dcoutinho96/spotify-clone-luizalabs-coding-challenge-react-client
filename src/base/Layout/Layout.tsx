import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "~/config";
import { LoadingSpinner } from "~/shared/";
import { PrivateRoute } from "~/base";

const HomePage = lazy(() =>
  import("~/features").then(module => ({ default: module.HomePage }))
);

const DashboardPage = lazy(() =>
  import("~/features").then(module => ({ default: module.DashboardPage }))
);

const LoginPage = lazy(() =>
  import("~/base").then(module => ({ default: module.LoginPage }))
);

export function Layout() {
  return (
    <div data-testid='layout' className="grid place-items-center min-h-screen">
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />

            <Route element={<PrivateRoute/>}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
