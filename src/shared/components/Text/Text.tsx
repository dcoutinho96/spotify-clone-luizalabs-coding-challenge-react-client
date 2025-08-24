import React from "react";

export type TextProps = {
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "muted" | "inverse";
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & React.HTMLAttributes<HTMLElement>;

const colorClassMap: Record<
  NonNullable<TextProps["color"]>,
  string
> = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted",
  inverse: "text-inverse",
};

export function Text({
  children,
  className = "",
  color = "primary",
  as = "p",
  ...props
}: TextProps) {
  const Component = as;
  const colorClass = colorClassMap[color];

  return (
    <Component className={`${colorClass} ${className}`} {...props}>
      {children}
    </Component>
  );
}
