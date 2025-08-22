import { Image, NavItem } from "~/shared";
import { Home, User, Disc, ListMusic } from "lucide-react";
import { ROUTES } from "~/config";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside data-testid='navbar' className="bg-black text-white w-64 min-h-screen p-8 flex items-start flex-col gap-10">
      <Image
        className="w-[164px] max-w-full h-auto"
        alt={t("accessibility.spotify-logo")}
        src="assets/Spotify_Logo_RGB_white.png"
      />

      <nav className="flex flex-col gap-6">
        <NavItem
          to={ROUTES.dashboard}
          icon={Home}
          label={t("navbar.home")}
          current={location.pathname === ROUTES.dashboard}
        />
        <NavItem
          to={ROUTES.artists}
          icon={Disc}
          label={t("navbar.artists")}
          current={location.pathname.startsWith(ROUTES.artists)}
        />
        <NavItem
          to={ROUTES.playlists}
          icon={ListMusic}
          label={t("navbar.playlists")}
          current={location.pathname.startsWith(ROUTES.playlists)}
        />
        <NavItem
          to={ROUTES.profile}
          icon={User}
          label={t("navbar.profile")}
          current={location.pathname.startsWith(ROUTES.profile)}
        />
      </nav>
    </aside>
  );
}
