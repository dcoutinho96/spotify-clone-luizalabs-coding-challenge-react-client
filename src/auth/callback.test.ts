// src/auth/callback.test.ts
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from "vitest";
import { handleSpotifyCallback } from "./callback";
import { SPOTIFY_TOKEN_URL } from "~/config";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}
interface FetchOkOnly {
  ok: boolean;
  json?: () => Promise<unknown>;
}

describe("handleSpotifyCallback", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("throws if code/state missing or state mismatch", async () => {
    sessionStorage.setItem("oauth_state", "stored");
    Object.defineProperty(window, "location", {
      value: new URL("https://localhost:5173/login") as unknown as Location,
      configurable: true,
    });
    await expect(handleSpotifyCallback()).rejects.toThrow("Invalid state");

    sessionStorage.setItem("oauth_state", "abc");
    Object.defineProperty(window, "location", {
      value: new URL("https://localhost:5173/login?code=123&state=def") as unknown as Location,
      configurable: true,
    });
    await expect(handleSpotifyCallback()).rejects.toThrow("Invalid state");
  });

  it("throws if fetch returns non-ok response", async () => {
    sessionStorage.setItem("oauth_state", "xyz");
    sessionStorage.setItem("pkce_verifier", "verifier123");
    Object.defineProperty(window, "location", {
      value: new URL("https://localhost:5173/login?code=code123&state=xyz") as unknown as Location,
      configurable: true,
    });

    (global.fetch as unknown as Mock).mockResolvedValueOnce({ ok: false } as FetchOkOnly);

    await expect(handleSpotifyCallback()).rejects.toThrow("Token exchange failed");
    expect(global.fetch).toHaveBeenCalledWith(SPOTIFY_TOKEN_URL, expect.any(Object));
  });

  it("stores tokens on success", async () => {
    sessionStorage.setItem("oauth_state", "xyz");
    sessionStorage.setItem("pkce_verifier", "verifier123");
    Object.defineProperty(window, "location", {
      value: new URL("https://localhost:5173/login?code=code123&state=xyz") as unknown as Location,
      configurable: true,
    });

    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<TokenResponse> => ({
        access_token: "access123",
        refresh_token: "refresh123",
      }),
    });

    const data = await handleSpotifyCallback();

    expect(data.access_token).toBe("access123");
    expect(data.refresh_token).toBe("refresh123");
    expect(sessionStorage.getItem("access_token")).toBe("access123");
    expect(sessionStorage.getItem("refresh_token")).toBe("refresh123");
  });
});
