import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { loginWithSpotify } from "~/auth";
import { Button, Image, Text, Container, useAuth } from "~/shared";
import { ROUTES } from "~/config";

export function HomePage() {
  const { t } = useTranslation();
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (isAuth && !loading) {
      navigate(ROUTES.dashboard);
    }
  }, [isAuth, loading, navigate]);
  
  if (loading || isAuth) {
    return null;
  }

  return (
    <Container className="min-h-screen grid place-items-center px-4">
      <div className="grid gap-4 sm:gap-5 md:gap-6 place-items-center text-center w-full max-w-screen-sm">
        <Image
          className="w-[8rem] sm:w-[10.25rem] max-w-full h-auto"
          alt={t("accessibility.spotify-logo")}
          src="assets/Spotify_Logo_RGB_white.png"
        />
        <Text as="h1" className="text-sm font-medium leading-6">
          {t("home.login-instructions")}
        </Text>
        <Button onClick={loginWithSpotify}>
          {t("home.login-button")}
        </Button>
      </div>
    </Container>
  );
}