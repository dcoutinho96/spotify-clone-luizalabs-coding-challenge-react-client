import { Image } from "~/shared";
import { Home, User, Disc, Play } from "lucide-react";
import { ROUTES } from "~/config";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { NavItem } from "./NavItem";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside
      data-testid="navbar"
      className="
        bg-background-alt text-primary
        fixed bottom-0 left-0 right-0 h-16
        flex items-center justify-around
        px-4
        sm:px-6
        lg:static lg:min-h-screen lg:w-64 lg:flex-col
        lg:items-start lg:justify-start lg:gap-10 lg:p-8
      "
    >
      <Image
        className="hidden lg:block w-[164px] max-w-full h-auto"
        alt={t('accessibility.spotify-logo')}
        src="assets/Spotify_Logo_RGB_white.png"
      />

      <nav
        className="
          flex flex-row justify-around w-full
          lg:flex-col lg:gap-6 lg:w-auto
        "
      >
        <NavItem
          to={ROUTES.dashboard}
          icon={Home}
          label={t('navbar.home')}
          current={location.pathname === ROUTES.dashboard}
        />
        <NavItem
          to={ROUTES.artists}
          icon={Disc}
          label={t('navbar.artists')}
          current={location.pathname.startsWith(ROUTES.artists)}
        />
        <NavItem
          to={ROUTES.playlists}
          icon={Play}
          label={t('navbar.playlists')}
          current={location.pathname.startsWith(ROUTES.playlists)}
        />
        <NavItem
          to={ROUTES.profile}
          icon={User}
          label={t('navbar.profile')}
          current={location.pathname.startsWith(ROUTES.profile)}
        />
      </nav>
    </aside>
  );
}
