import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "~/gql/fetcher";
import {
  ArtistAlbumsDocument,
  ArtistAlbumsQuery,
  ArtistAlbumsQueryVariables,
} from "~/gql";

export function useInfiniteArtistAlbums(artistId: string, limit = 10) {
  return useInfiniteQuery<ArtistAlbumsQuery>({
    queryKey: ["ArtistAlbums", artistId],
    queryFn: async ({ pageParam }) =>
      fetcher<ArtistAlbumsQuery, ArtistAlbumsQueryVariables>(
        ArtistAlbumsDocument,
        {
          artistId,
          limit,
          offset: pageParam as number,
        }
      )(),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + (page.artistAlbums.edges.length ?? 0),
        0
      );
      return loaded < (lastPage.artistAlbums.totalCount ?? 0)
        ? loaded
        : undefined;
    },
  });
}
