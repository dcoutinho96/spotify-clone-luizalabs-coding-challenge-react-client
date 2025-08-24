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
      let data: Awaited<ReturnType<typeof handleSpotifyCallback>> | null = null;
      try {
        data = await handleSpotifyCallback();
      } finally {
        if (!data?.access_token) {
          navigate(ROUTES.home);        
        } else {
          navigate(ROUTES.dashboard);   
        }
      }
    })();
  }, [navigate]);

  return <LoadingSpinner />;
}
