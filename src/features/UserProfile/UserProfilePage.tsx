import { useTranslation } from "react-i18next";
import { useMeQuery } from "~/gql";
import { Button, Image, LoadingSpinner, Text } from "~/shared";

export const UserProfilePage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useMeQuery();

  if (isLoading) {
    return <LoadingSpinner data-testid="loading" />;
  }
  const {
    me: { images = [], displayName },
  } = data!;

  const [{ url } = { url: "/assets/placeholder-avatar.png" }] = images;

  return (
    <div className="flex flex-col items-center gap-6">
      <Image
        className="w-32 aspect-square rounded-full object-cover"
        src={url}
        alt={t("profile.alt-profile-picture")}
      />
      <Text className="text-2xl font-medium tracking-[0.01em]">
        {displayName}
      </Text>
      <Button className="m-3">{t("profile.sign-out-button")}</Button>
    </div>
  );
};
