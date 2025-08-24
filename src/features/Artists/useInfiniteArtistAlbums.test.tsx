import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";

import { useInfiniteArtistAlbums } from "./useInfiniteArtistAlbums";
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

describe("useInfiniteArtistAlbums", () => {
  const mockArtistId = "artist-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the first page with correct variables", async () => {
    (fetcher as unknown as Mock).mockReturnValue(() =>
      Promise.resolve({
        artistAlbums: {
          edges: [{ node: { id: "album-1", name: "First Album", images: [] } }],
          totalCount: 2,
        },
      })
    );

    const { result } = renderHook(
      () => useInfiniteArtistAlbums(mockArtistId, 10),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetcher).toHaveBeenCalledWith(expect.anything(), {
      artistId: mockArtistId,
      limit: 10,
      offset: 0,
    });

    expect(
      result.current.data?.pages[0].artistAlbums.edges[0].node.name
    ).toBe("First Album");
  });

  it("computes next page param when more albums remain", async () => {
    (fetcher as unknown as Mock).mockReturnValue(() =>
      Promise.resolve({
        artistAlbums: {
          edges: [{ node: { id: "album-1", name: "First Album", images: [] } }],
          totalCount: 3,
        },
      })
    );

    const { result } = renderHook(
      () => useInfiniteArtistAlbums(mockArtistId, 10),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const next = result.current.fetchNextPage;
    await next();
    
    expect(fetcher).toHaveBeenLastCalledWith(expect.anything(), {
      artistId: mockArtistId,
      limit: 10,
      offset: 1,
    });
  });

  it("stops pagination when all albums are loaded", async () => {
    (fetcher as unknown as Mock).mockReturnValue(() =>
      Promise.resolve({
        artistAlbums: {
          edges: [
            { node: { id: "album-1", name: "First Album", images: [] } },
            { node: { id: "album-2", name: "Second Album", images: [] } },
          ],
          totalCount: 2,
        },
      })
    );

    const { result } = renderHook(
      () => useInfiniteArtistAlbums(mockArtistId, 10),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});