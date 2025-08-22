import { SPOTIFY_LOGIN_URL } from "~/config";
import { createCodeVerifierAndChallenge } from "./pkce";
import { buildRedirectURL } from ".";

export const loginWithSpotify = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const scope = import.meta.env.VITE_SPOTIFY_SCOPES;

  const { verifier, challenge } = await createCodeVerifierAndChallenge();
  const state = crypto.randomUUID();

  sessionStorage.setItem("pkce_verifier", verifier);
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: buildRedirectURL(),
    scope,
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.href = `${SPOTIFY_LOGIN_URL}${params.toString()}`;
};
