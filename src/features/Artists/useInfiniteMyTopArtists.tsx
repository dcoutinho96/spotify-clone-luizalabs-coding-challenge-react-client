import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "~/gql/fetcher";
import {
  MyTopArtistsDocument,
  MyTopArtistsQuery,
  MyTopArtistsQueryVariables,
} from "~/gql";

export function useInfiniteMyTopArtists(limit = 10) {
  return useInfiniteQuery<MyTopArtistsQuery>({
    queryKey: ["MyTopArtists"],
    queryFn: async ({ pageParam }) =>
      fetcher<MyTopArtistsQuery, MyTopArtistsQueryVariables>(
        MyTopArtistsDocument,
        { limit, offset: pageParam as number }
      )(),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + (page.myTopArtists.edges.length ?? 0),
        0
      );
      return loaded < (lastPage.myTopArtists.totalCount ?? 0)
        ? loaded
        : undefined;
    },
  });
}
