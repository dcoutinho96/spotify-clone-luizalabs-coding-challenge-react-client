export const fetcher =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit["headers"]
  ): (() => Promise<TData>) => {
    return async () => {
      const token = sessionStorage.getItem("access_token");

      const res = await fetch(
        import.meta.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL as string,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        }
      );

      const json = await res.json();

      if (json.errors) {
        const { message } = json.errors[0] || {};
        throw new Error(message || "GraphQL error");
      }

      return json.data as TData;
    };
  };
