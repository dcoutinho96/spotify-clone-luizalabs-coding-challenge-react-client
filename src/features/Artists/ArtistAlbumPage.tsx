import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useArtistByIdQuery } from "~/gql";
import { LoadingSpinner } from "~/shared";

export const ArtistAlbumsPage = () => {
  const { t } = useTranslation();
  const { artistId } = useParams<{ artistId: string }>();

  const { data, isLoading } = useArtistByIdQuery({ id: artistId! });

  if (isLoading) {
    return <LoadingSpinner data-testid="loading" />;
  }

  if (!data?.artistById) {
    return <div>{t("artist.notFound", "Artista não encontrado")}</div>;
  }

  const { name, images, albums } = data.artistById;
  const [{ url } = { url: "/assets/placeholder-avatar.png" }] = images;

  return (
    <div>
      <h1>{t("artist.albums.title", "Álbuns de {{name}}", { name })}</h1>
      <img src={url} alt={name} width={128} height={128} />

      <p>{t("artist.albums.subtitle", "Coleção de álbuns do artista")}</p>

      <div>
        {albums.edges.map(({ node }) => {
          const { id, name, releaseDate, totalTracks, images } = node;
          const [{ url } = { url: "/assets/placeholder-album.png" }] = images;

          return (
            <div key={id} style={{ marginBottom: "1rem" }}>
              <img src={url} alt={name} width={96} height={96} />
              <div>
                <div>{name}</div>
                <div>
                  {t("artist.albums.releaseDate", "Lançado em")}:{" "}
                  {releaseDate ?? t("artist.albums.unknownDate", "Data desconhecida")}
                </div>
                <div>
                  {t("artist.albums.tracks", "{{count}} faixas", {
                    count: totalTracks ?? 0,
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
