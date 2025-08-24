import React from "react";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-[2.625rem]",
  md: "h-[3.625rem]",
  lg: "h-[4rem]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-inverse hover:brightness-110",
  secondary: "bg-surface-3 text-primary hover:brightness-125",
  outline: "border border-border text-primary hover:bg-surface-3",
  ghost: "text-secondary hover:bg-surface-3",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "sm",
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "rounded-full transition " +
    "px-10 py-[0.6875rem] " +
    "text-[1rem] leading-[1.25rem] " +
    "font-bold " +
    "cursor-pointer " +
    "tracking-[0.00875rem]";

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  return (
    <button
      type="button"
      className={finalClasses}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </button>
  );
};
