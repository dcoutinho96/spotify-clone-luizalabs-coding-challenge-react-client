export const fetcher =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit["headers"]
  ): (() => Promise<TData>) => {
    return async () => {
      const token = sessionStorage.getItem("access_token");

      let baseUrl: string;
      try {
        
        baseUrl =
          import.meta.env?.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL ??
          "http://localhost:4000";
      } catch (err) {
        
        if (err instanceof Error) throw err;
        throw new Error("Unknown error in fetcher");
      }

      const cacheKey = JSON.stringify({ query, variables });

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached) as TData;
        throw new Error("Offline: no network connection and no cached data available");
      }

      let res: Response;
      try {
        res = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options,
          },
          body: JSON.stringify({ query, variables }),
        });
      } catch (err) {
        throw new Error(
          err instanceof Error
            ? `Network request failed: ${err.message}`
            : `Network request failed: ${String(err)}`
        );
      }

      let json: unknown;
      try {
        json = await res.json();
      } catch {
        throw new Error(`Invalid JSON response (status ${res.status})`);
      }

      const parsed = json as { data?: TData; errors?: { message?: string | null }[] };

      if (!res.ok) {
        throw new Error(
          parsed.errors?.[0]?.message ??
          `GraphQL request failed with status ${res.status}`
        );
      }

      if (parsed.errors) {
        if (parsed.errors.length === 0) throw new Error("GraphQL error");
        throw new Error(parsed.errors[0]?.message ?? "GraphQL error");
      }

      if (!parsed.data) throw new Error("No data returned from server");

      localStorage.setItem(cacheKey, JSON.stringify(parsed.data));
      return parsed.data;
    };
  };
