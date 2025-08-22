import React from "react";

export const Container: React.FC<React.ButtonHTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {

  return (
    <div className={`px-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
