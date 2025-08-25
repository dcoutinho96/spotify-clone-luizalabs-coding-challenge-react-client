import { ServerCrash } from "lucide-react";
import { ErrorComponent } from "~/shared";

export function Error500() {
  return (
    <ErrorComponent
      icon={ServerCrash}
      iconColor="text-red-500"
      titleKey="errors.500.title"
      messageKey="errors.500.message"
      data-testid='error-500'
    />
  );
}
