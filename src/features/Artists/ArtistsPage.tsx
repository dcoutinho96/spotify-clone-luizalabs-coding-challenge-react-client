import { useTranslation } from "react-i18next";
import { Image, LoadingSpinner, Text, useInfiniteScroll } from "~/shared";
import { Link } from "react-router-dom";
import { ROUTES } from "~/config";
import { useInfiniteMyTopArtists } from "./";

export const ArtistsPage = () => {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMyTopArtists(10);

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });
  
  const edges = data?.pages.flatMap((page) => page.myTopArtists.edges) ?? [];

  if (isLoading && edges.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full px-8 grid gap-2">
      <div className="py-8">
        <Text className="text-xl md:text-3xl font-semibold">
          {t("artist.title", "Meus Artistas")}
        </Text>
        <Text className="text-sm md:text-base text-secondary">
          {t("artist.subtitle", "Sua coleção pessoal de artistas")}
        </Text>
      </div>

      <div className="gap-4 grid mb-8">
        {edges.map(({ node }) => {
          const { id, name, images } = node;
          const [{ url } = { url: "/assets/placeholder-avatar.png" }] = images;

          return (
            <Link
              key={id}
              to={ROUTES.artistAlbums.replace(":artistId", id)}
              className="flex gap-4 items-center"
            >
              <Image
                className="rounded-full aspect-square object-cover"
                src={url}
                alt={name}
                width={64}
                height={64}
              />
              <Text className="text-sm">{name}</Text>
            </Link>
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};
