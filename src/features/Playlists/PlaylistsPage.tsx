import { useTranslation } from "react-i18next";
import { Button, Image, LoadingSpinner, Text, useInfiniteScroll } from "~/shared";
import { useInfiniteQuery, InfiniteData, useQueryClient } from "@tanstack/react-query";
import {
  fetcher,
  MyPlaylistsDocument,
  MyPlaylistsQuery,
  MyPlaylistsQueryVariables,
  useCreatePlaylistMutation,
} from "~/gql";
import { Modal } from "~/shared/components/Modal";
import { useState } from "react";

export const PlaylistsPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      MyPlaylistsQuery,
      Error,
      InfiniteData<MyPlaylistsQuery>,
      ["MyPlaylists"],
      number
    >({
      queryKey: ["MyPlaylists"],
      queryFn: ({ pageParam = 0 }) =>
        fetcher<MyPlaylistsQuery, MyPlaylistsQueryVariables>(MyPlaylistsDocument, {
          limit: 10,
          offset: pageParam,
        })(),
      initialPageParam: 0,
      getNextPageParam: (lastPage: MyPlaylistsQuery, allPages) =>
        lastPage.myPlaylists.pageInfo.hasNextPage ? allPages.length * 10 : undefined,
    });

  const createPlaylist = useCreatePlaylistMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MyPlaylists"] });
      setIsModalOpen(false);
      setPlaylistName("");
    },
  });

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  const edges =
    data?.pages.flatMap((page: MyPlaylistsQuery) => page.myPlaylists.edges) ?? [];

  if (isLoading && edges.length === 0) {
    return <LoadingSpinner />;
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = playlistName.trim();
    if (!name || createPlaylist.isPending) return;
    createPlaylist.mutate({ name, public: true });
  };

  return (
    <div className="w-full px-8 grid gap-2">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form
          onSubmit={handleSubmit}
          className="
            w-full max-w-[600px] mx-auto
            px-6 md:px-10 py-8 md:py-10
            max-h-[75vh] overflow-y-auto
            flex flex-col items-center gap-6
          "
        >
          <Text className="text-sm text-white text-base font-medium text-center">
            {t("playlists.give-name-playlist")}
          </Text>

          <input
            type="text"
            autoFocus
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            aria-label={t("playlists.give-name-playlist")}
            className="
              w-full text-center text-2xl md:text-3xl font-semibold
              text-white bg-transparent
              border-b border-base-100/30 focus:border-primary/80 focus:outline-none
              pb-2
            "
          />

          <Button
            type="submit"
            variant="primary"
            disabled={createPlaylist.isPending || playlistName.trim().length === 0}
          >
            {createPlaylist.isPending ? t("common.loading") : t("playlists.create")}
          </Button>
        </form>
      </Modal>

      <div className="py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <Text className="text-2xl md:text-3xl font-semibold">
            {t("playlists.title")}
          </Text>
          <Text className="text-sm md:text-base text-secondary">
            {t("playlists.subtitle")}
          </Text>
        </div>
        <div className="flex justify-center sm:justify-end">
          <Button onClick={() => setIsModalOpen(true)}>
            {t("playlists.create-playlist")}
          </Button>
        </div>
      </div>

      <div className="gap-4 grid mb-8">
        {edges.map(({ node }) => {
          const { id, name, images, owner } = node;
          const [{ url } = { url: "/assets/placeholder-avatar.png" }] = images;
          return (
            <div key={id} className="flex gap-4 items-center p-2">
              <Image
                className="aspect-square object-cover"
                src={url}
                alt={name}
                width={64}
                height={64}
              />
              <div className="flex flex-col">
                <Text className="text-sm font-medium">{name}</Text>
                <Text className="text-xs text-secondary">{owner.displayName}</Text>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};
