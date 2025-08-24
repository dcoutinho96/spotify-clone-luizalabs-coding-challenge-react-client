import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Text } from "~/shared";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  current?: boolean;
}

export function NavItem({ to, icon: Icon, label, current }: NavItemProps) {
  const baseClasses = "flex items-center md:gap-4 rounded-md transition-colors";

  const activeClasses = "text-primary font-bold";
  const inactiveClasses = "text-secondary hover:text-primary";

  const iconColorClass = current
    ? "text-primary"
    : "text-secondary group-hover:text-primary";

  return (
    <NavLink
      to={to}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      data-current={current ? "true" : undefined}
      className={`${baseClasses} group`}
    >
      <Icon
        className={`w-6 h-6 shrink-0 ${iconColorClass}`}
        aria-hidden="true"
        focusable="false"
      />
      <Text
        as="span"
        className={`hidden md:inline font-dmsans text-lg tracking-[-0.06em] ${
          current ? activeClasses : inactiveClasses
        }`}
      >
        {label}
      </Text>
    </NavLink>
  );
}
