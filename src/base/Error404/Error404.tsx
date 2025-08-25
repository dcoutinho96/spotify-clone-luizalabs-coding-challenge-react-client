import { SearchX } from "lucide-react";
import { ErrorComponent } from "~/shared";

export function Error404() {
  return (
    <ErrorComponent
      icon={SearchX}
      titleKey="errors.404.title"
      messageKey="errors.404.message"
    />
  );
}
