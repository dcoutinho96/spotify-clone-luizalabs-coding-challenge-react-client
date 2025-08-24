import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useArtistByIdQuery } from "~/gql";

import { BackButton, Image, LoadingSpinner, Text, useInfiniteScroll } from "~/shared";
import { useInfiniteArtistAlbums } from "./useInfiniteArtistAlbums";

export const ArtistAlbumsPage = () => {
  const { t } = useTranslation();
  const { artistId } = useParams<{ artistId: string }>();
  
  const { data: artistData, isLoading: artistLoading } = useArtistByIdQuery({
    id: artistId!,
  });
  
  const {
    data: albumsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArtistAlbums(artistId!, 10);

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });
  
  const albumEdges =
    albumsData?.pages.flatMap((page) => page.artistAlbums.edges) ?? [];
  
  if (artistLoading) {
    return <LoadingSpinner data-testid="loading" />;
  }
  
  if (!artistData?.artistById) {
    return <div>{t("artist.notFound")}</div>;
  }

  const { name, images } = artistData.artistById;
  const [{ url: artistImg } = { url: "/assets/placeholder-avatar.png" }] =
    images;

  return (
    <div className="w-full px-8 grid gap-4">
      {}
      <div className="flex justify-between items-center py-8">
        <BackButton>{name}</BackButton>
        <div>
          <Image
            className="rounded-full aspect-square object-cover"
            src={artistImg}
            alt={name}
            width={64}
            height={64}
          />
        </div>
      </div>

      {}
      <div className="grid gap-4 mb-8">
        {albumEdges.map(({ node }) => {
          const { id, name, releaseDate, images } = node;
          const [{ url } = { url: "/assets/placeholder-album.png" }] = images;

          return (
            <div key={id} className="flex gap-4 items-center">
              <Image
                src={url}
                alt={name}
                className="w-18 h-18 aspect-square object-cover"
              />
              <div>
                <Text className="text-sm">{name}</Text>
                <Text className="text-secondary text-xs">{releaseDate}</Text>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};
