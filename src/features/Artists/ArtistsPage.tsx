import { useTranslation } from "react-i18next";
import { useMyTopArtistsQuery } from "~/gql";
import { LoadingSpinner } from "~/shared";
import { Link } from "react-router-dom";

import { ROUTES } from "~/config";

export const ArtistsPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useMyTopArtistsQuery({ limit: 10 });

  if (isLoading) {
    return <LoadingSpinner data-testid="loading" />;
  }

  return (
    <div>
      <h1>{t("artist.title", "Meus Artistas")}</h1>
      <p>{t("artist.subtitle", "Sua coleção pessoal de artistas")}</p>

      <div style={{ display: "grid", gap: "1rem" }}>
        {data?.myTopArtists.edges.map(({ node }) => {
          const { id, name, images } = node;
          const [{ url } = { url: "/assets/placeholder-avatar.png" }] = images;

          return (
            <Link
              key={id}
              to={ROUTES.artistAlbums.replace(":artistId", id)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img src={url} alt={name} width={64} height={64} />
              <div>{name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
