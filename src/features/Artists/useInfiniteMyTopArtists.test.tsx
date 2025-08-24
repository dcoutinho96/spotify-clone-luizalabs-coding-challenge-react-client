import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";

import { useInfiniteMyTopArtists } from "./useInfiniteMyTopArtists";
import { fetcher } from "~/gql/fetcher";

vi.mock("~/gql/fetcher", () => ({
  fetcher: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useInfiniteMyTopArtists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the first page with correct variables", async () => {
    (fetcher as unknown as Mock).mockReturnValue(() =>
      Promise.resolve({
        myTopArtists: {
          edges: [{ node: { id: "artist-1", name: "Alice", images: [] } }],
          totalCount: 2,
        },
      })
    );

    const { result } = renderHook(() => useInfiniteMyTopArtists(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetcher).toHaveBeenCalledWith(expect.anything(), {
      limit: 10,
      offset: 0,
    });

    expect(
      result.current.data?.pages[0].myTopArtists.edges[0].node.name
    ).toBe("Alice");
  });

  it("fetches the next page when more artists exist", async () => {
    (fetcher as unknown as Mock).mockReturnValue(() =>
      Promise.resolve({
        myTopArtists: {
          edges: [{ node: { id: "artist-1", name: "Alice", images: [] } }],
          totalCount: 3,
        },
      })
    );

    const { result } = renderHook(() => useInfiniteMyTopArtists(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await result.current.fetchNextPage();

    expect(fetcher).toHaveBeenLastCalledWith(expect.anything(), {
      limit: 5,
      offset: 1,
    });
  });

  it("stops when all artists are loaded", async () => {
    (fetcher as unknown as Mock).mockReturnValue(() =>
      Promise.resolve({
        myTopArtists: {
          edges: [
            { node: { id: "artist-1", name: "Alice", images: [] } },
            { node: { id: "artist-2", name: "Bob", images: [] } },
          ],
          totalCount: 2,
        },
      })
    );

    const { result } = renderHook(() => useInfiniteMyTopArtists(10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});
