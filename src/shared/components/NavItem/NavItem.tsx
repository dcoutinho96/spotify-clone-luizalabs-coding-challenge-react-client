import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Text } from "../Text";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  current?: boolean;
}

export function NavItem({ to, icon: Icon, label, current }: NavItemProps) {
  const baseClasses =
    "flex items-center gap-4 rounded-md transition-colors";

  const activeClasses = "text-white font-semibold";
  const inactiveClasses = "text-gray-400 hover:text-white";

  const colorClass = current ? "text-white" : "text-gray-400 hover:text-white";

  return (
    <NavLink
      to={to}
      aria-label={label}
      aria-current={current ? "page" : undefined} 
      data-current={current ? "true" : undefined}
      className={baseClasses}
    >
      <Icon
        className={`w-6 h-6 shrink-0 ${colorClass}`} 
        aria-hidden="true"
        focusable="false"
      />
      <Text
        as="span"
        className={`font-dmsans font-bold text-lg sm:text-xl tracking-[-0.06em] ${
          current ? activeClasses : inactiveClasses
        }`}
      >
        {label}
      </Text>
    </NavLink>
  );
}
