import { SPOTIFY_TOKEN_URL } from "~/config";
import { buildRedirectURL } from ".";
import { authEvents } from "~/shared/"; 

export const handleSpotifyCallback = async () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = sessionStorage.getItem("oauth_state");
  if (!code || !state || state !== storedState) throw new Error("Invalid state");

  const verifier = sessionStorage.getItem("pkce_verifier")!;
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: buildRedirectURL(),
      code_verifier: verifier,
    }),
  });

  if (!res.ok) throw new Error("Token exchange failed");
  const data = await res.json();

  sessionStorage.setItem("access_token", data.access_token);
  sessionStorage.setItem("refresh_token", data.refresh_token);

  authEvents.emit("token", data.access_token);

  return data;
};
