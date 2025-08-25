import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Text, Button } from "~/shared";
import { ROUTES } from "~/config";

interface ErrorComponentProps {
    icon: LucideIcon;
    iconColor?: string;
    titleKey: string;
    messageKey: string;
}

export function ErrorComponent({
    icon: Icon,
    iconColor = "text-[var(--color-brand)]",
    titleKey,
    messageKey
}: ErrorComponentProps) {
    const { t } = useTranslation();

    const handleHardRedirect = () => {
        window.location.href = ROUTES.home;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-[var(--color-surface)] rounded-2xl p-8 shadow-lg flex flex-col items-center">
                <Icon className={`w-20 h-20 ${iconColor} mb-6`} />
                <Text as="h1" className="text-5xl font-bold mb-2 font-rubik">
                    {t(titleKey)}
                </Text>
                <Text
                    as="p"
                    className="text-[var(--color-secondary)] text-lg mb-6 font-dmsans"
                >
                    {t(messageKey)}
                </Text>
                <Button
                    onClick={handleHardRedirect}
                    variant="primary"
                    size="md"
                >
                    {t("errors.backHome")}
                </Button>
            </div>
        </div>
    );
}
