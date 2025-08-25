import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Text, Button } from "~/shared";
import { ROUTES } from "~/config";

interface ErrorComponentProps {
  readonly icon: LucideIcon;
  readonly iconColor?: string;
  readonly titleKey: string;
  readonly messageKey: string;
  readonly "data-testid"?: string;
}

export function ErrorComponent({
  icon: Icon,
  iconColor = "text-[var(--color-brand)]",
  titleKey,
  messageKey,
  ...props
}: ErrorComponentProps) {
  const { t } = useTranslation();

  const handleHardRedirect = () => {
    window.location.href = ROUTES.home;
  };

  return (
    <section
      data-testid={props["data-testid"]}
      className="w-full min-h-screen flex justify-center"
      aria-labelledby="error-title"
    >
      <div className="w-full rounded-2xl bg-[var(--color-surface)] shadow-lg">
        <div className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:p-10">
          <Icon
            className={`h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ${iconColor}`}
            aria-hidden="true"
          />

          <Text
            id="error-title"
            as="h1"
            className="font-rubik text-2xl sm:text-3xl lg:text-4xl font-extrabold "
          >
            {t(titleKey)}
          </Text>

          <Text
            as="p"
            className="font-dmsans"
          >
            {t(messageKey)}
          </Text>

          <Button
            onClick={handleHardRedirect}
            variant="primary"
          >
            {t("errors.backHome")}
          </Button>
        </div>
      </div>
    </section>
  );
}
