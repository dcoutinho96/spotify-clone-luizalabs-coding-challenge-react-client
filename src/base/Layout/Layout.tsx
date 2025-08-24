import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";
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
const ArtistsPage = lazy(() =>
  import("~/features").then((module) => ({ default: module.ArtistsPage }))
);
const ArtistAlbumsPage = lazy(() =>
  import("~/features").then((module) => ({ default: module.ArtistAlbumsPage }))
);
const LoginPage = lazy(() =>
  import("~/base").then((module) => ({ default: module.LoginPage }))
);

export function Layout() {
  const { isAuth } = useAuth();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleScroll = () => {
      scrollPositions.current[location.pathname] = main.scrollTop;
    };

    main.addEventListener("scroll", handleScroll);
    return () => {
      main.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);
  
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const saved = scrollPositions.current[location.pathname];
    main.scrollTo(0, saved ?? 0);
  }, [location.pathname]);

  return (
    <div
      data-testid="layout"
      className="flex min-h-screen bg-background text-primary"
    >
      {isAuth && <Navbar />}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto h-screen scrollbar grid place-items-center bg-background"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.profile} element={<UserProfilePage />} />
              <Route path={ROUTES.artists} element={<ArtistsPage />} />
              <Route path={ROUTES.artistAlbums} element={<ArtistAlbumsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
