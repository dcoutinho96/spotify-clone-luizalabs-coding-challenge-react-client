import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginWithSpotify } from "./login";
import * as pkceModule from "./pkce";
import * as redirectModule from ".";
import { SPOTIFY_LOGIN_URL } from "~/config";

describe("loginWithSpotify", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();

    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    vi.spyOn(pkceModule, "createCodeVerifierAndChallenge").mockResolvedValue({
      verifier: "verifier123",
      challenge: "challenge456",
    });

    // use a valid UUID string
    vi.spyOn(global.crypto, "randomUUID").mockReturnValue(
      "123e4567-e89b-12d3-a456-426614174000"
    );

    vi.spyOn(redirectModule, "buildRedirectURL").mockReturnValue(
      "https://localhost:5173/login"
    );
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  it("stores verifier and state in sessionStorage", async () => {
    await loginWithSpotify();

    expect(sessionStorage.getItem("pkce_verifier")).toBe("verifier123");
    expect(sessionStorage.getItem("oauth_state")).toBe(
      "123e4567-e89b-12d3-a456-426614174000"
    );
  });

  it("sets window.location.href to Spotify login URL with params", async () => {
    await loginWithSpotify();

    const href = window.location.href;
    expect(href).toContain(SPOTIFY_LOGIN_URL);
    expect(href).toContain("response_type=code");
    expect(href).toContain("client_id=");
    expect(href).toContain(
      "redirect_uri=https%3A%2F%2Flocalhost%3A5173%2Flogin"
    );
    expect(href).toContain("scope=");
    expect(href).toContain(
      "state=123e4567-e89b-12d3-a456-426614174000"
    );
    expect(href).toContain("code_challenge_method=S256");
    expect(href).toContain("code_challenge=challenge456");
  });
});
