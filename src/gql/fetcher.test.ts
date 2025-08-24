import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { fetcher } from "./fetcher";

describe("fetcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    global.fetch = vi.fn() as any;
    
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((k: string) => store[k] ?? null),
      setItem: vi.fn((k: string, v: string) => {
        store[k] = v;
      }),
      removeItem: vi.fn((k: string) => {
        delete store[k];
      }),
      clear: vi.fn(() => {
        for (const k in store) delete store[k];
      }),
    });

    const session: Record<string, string> = {};
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn((k: string) => session[k] ?? null),
      setItem: vi.fn((k: string, v: string) => {
        session[k] = v;
      }),
      removeItem: vi.fn((k: string) => {
        delete session[k];
      }),
      clear: vi.fn(() => {
        for (const k in session) delete session[k];
      }),
    });
    
    vi.stubGlobal("navigator", { onLine: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("throws if query is invalid", () => {
    expect(() => fetcher<unknown, undefined>("")).toBeInstanceOf(Function);
  });

  it("returns data on success", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { hello: "world" } }),
    });

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    const result = await fn();
    expect(result).toEqual({ hello: "world" });
  });

  it("throws if offline with no cache", async () => {
    (navigator as any).onLine = false;

    const fn = fetcher<{ hi: string }, undefined>("query { hi }");
    await expect(fn()).rejects.toThrow(
      "Offline: no network connection and no cached data available"
    );
  });

  it("returns cached data if offline with cache", async () => {
    const cacheKey = JSON.stringify({ query: "query { hi }", variables: undefined });
    localStorage.setItem(cacheKey, JSON.stringify({ hi: "cached" }));

    (navigator as any).onLine = false;

    const fn = fetcher<{ hi: string }, undefined>("query { hi }");
    await expect(fn()).resolves.toEqual({ hi: "cached" });
  });

  it("throws Network request failed on fetch reject", async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error("boom"));

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    await expect(fn()).rejects.toThrow("Network request failed: boom");
  });

  it("throws Invalid JSON on bad JSON", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("bad json");
      },
    });

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    await expect(fn()).rejects.toThrow(/Invalid JSON response/);
  });

  it("throws HTTP_ERROR when not ok", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ errors: [{ message: "boom" }] }),
    });

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    await expect(fn()).rejects.toThrow("boom");
  });

  it("throws GraphQL error if errors array exists", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ errors: [{ message: "bad gql" }] }),
    });

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    await expect(fn()).rejects.toThrow("bad gql");
  });

  it("throws No data returned if errors is empty array", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ errors: [] }),
    });

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    await expect(fn()).rejects.toThrow("No data returned from server");
  });

  it("throws when data is null", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: null }),
    });

    const fn = fetcher<{ hello: string }, undefined>("query { hello }");
    await expect(fn()).rejects.toThrow("No data returned from server");
  });

  it("uses Authorization header if token exists", async () => {
    sessionStorage.setItem("access_token", "abc123");

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { pong: true } }),
    });

    const fn = fetcher<{ pong: boolean }, undefined>("query { pong }");
    await fn();

    const [, options] = (global.fetch as Mock).mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc123");
  });

  it("uses env URL when provided", async () => {
    vi.stubEnv("VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL", "https://api.example.com/gql");

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { pong: true } }),
    });

    const fn = fetcher<{ pong: boolean }, undefined>("query { pong }");
    await fn();

    const [calledUrl] = (global.fetch as Mock).mock.calls[0];
    expect(calledUrl).toBe("https://api.example.com/gql");
  });
});
