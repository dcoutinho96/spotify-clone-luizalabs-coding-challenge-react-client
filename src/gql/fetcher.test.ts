import { describe, it, expect, beforeEach, afterEach, vi, Mock } from "vitest";
import { fetcher } from "./fetcher";

describe("fetcher", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("sends request without Authorization header when no token", async () => {
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({ data: { ok: true } }),
    });

    const query = "query Test";
    const variables = { id: 1 };
    const fn = fetcher<{ ok: boolean }, typeof variables>(query, variables);

    const result = await fn();

    expect(result).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      import.meta.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ query, variables }),
      })
    );
  });

  it("sends request with Authorization header when token exists", async () => {
    sessionStorage.setItem("access_token", "test-token");

    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({ data: { ok: true } }),
    });

    const fn = fetcher<{ ok: boolean }, void>("query Auth");
    await fn();

    expect(global.fetch).toHaveBeenCalledWith(
      import.meta.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("merges custom headers", async () => {
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({ data: { ok: true } }),
    });

    const fn = fetcher<{ ok: boolean }, void>("query Headers", undefined, {
      "X-Test": "123",
    });
    await fn();

    expect(global.fetch).toHaveBeenCalledWith(
      import.meta.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Test": "123",
        }),
      })
    );
  });

  it("throws an error when response contains errors with message", async () => {
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({
        errors: [{ message: "Something went wrong" }],
      }),
    });

    const fn = fetcher<unknown, void>("query Error");
    await expect(fn()).rejects.toThrow("Something went wrong");
  });

  it("throws a generic error when response contains errors without message", async () => {
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({
        errors: [{}],
      }),
    });

    const fn = fetcher<unknown, void>("query Error");
    await expect(fn()).rejects.toThrow("GraphQL error");
  });

  it("returns data when request succeeds", async () => {
    const data = { hello: "world" };

    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({ data }),
    });

    const fn = fetcher<typeof data, void>("query Success");
    const result = await fn();

    expect(result).toEqual(data);
  });

  it("throws a generic error when response contains empty errors array", async () => {
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({
        errors: [],
      }),
    });

    const fn = fetcher<unknown, void>("query EmptyErrors");
    await expect(fn()).rejects.toThrow("GraphQL error");
  });

  it("returns undefined when response contains no errors and no data", async () => {
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: async () => ({}),
    });

    const fn = fetcher<unknown, void>("query NoErrors");
    const result = await fn();

    expect(result).toBeUndefined();
  });
});
