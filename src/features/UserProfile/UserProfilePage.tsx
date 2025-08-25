import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useMeQuery } from "~/gql";
import { Button, Image, LoadingSpinner, Text, useAuth } from "~/shared";
import { ROUTES } from "~/config";

export const UserProfilePage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useMeQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const {
    me: { images = [], displayName },
  } = data!;

  const [{ url } = { url: "/assets/placeholder-avatar.png" }] = images;

  const handleSignOut = () => {
    logout();
    navigate(ROUTES.home);
  };

  return (
    <div data-testid="user-profile-page" className="flex flex-col items-center gap-6">
      <Image
        className="w-32 aspect-square rounded-full object-cover"
        src={url}
        alt={t("profile.alt-profile-picture")}
        data-testid="profile-picture"
      />
      <Text
        data-testid="profile-display-name"
        className="text-2xl font-medium tracking-[0.01em]"
      >
        {displayName}
      </Text>
      <Button
        variant="primary"
        data-testid="profile-signout-button"
        onClick={handleSignOut}
      >
        {t("profile.sign-out-button")}
      </Button>
    </div>
  );
};
