import React from "react";

export type TextProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & React.HTMLAttributes<HTMLElement>;

export function Text({
  children,
  className = "",
  color = "var(--color-text-primary)",
  as = "p",
  ...props
}: TextProps) {
  const Component = as;
  return (
    <Component
      className={`text-[color:${color}] ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
