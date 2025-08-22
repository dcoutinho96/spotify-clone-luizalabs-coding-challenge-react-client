import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleSpotifyCallback } from "~/auth/callback";
import { ROUTES } from "~/config";
import { LoadingSpinner } from "~/shared";

export function LoginPage() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      navigate(ROUTES.home);
      return;
    }

    (async () => {
      try {
        await handleSpotifyCallback();
        navigate(ROUTES.dashboard);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        navigate(ROUTES.home);
      }
    })();
  }, [navigate]);

  return <LoadingSpinner />;
}
