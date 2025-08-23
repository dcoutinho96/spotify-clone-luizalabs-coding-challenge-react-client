import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavItem } from "./NavItem";
import { Home } from "lucide-react";

describe("NavItem", () => {
  it("renders label and icon", () => {
    render(
      <MemoryRouter>
        <NavItem to="/home" icon={Home} label="Home" />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("applies inactive classes when not current", () => {
    render(
      <MemoryRouter>
        <NavItem to="/home" icon={Home} label="Home" />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    const icon = link.querySelector("svg");

    
    expect(screen.getByText("Home")).toHaveClass("text-text-secondary");
    expect(screen.getByText("Home")).not.toHaveClass("font-bold");

    
    expect(icon).toHaveClass("text-text-secondary");

    
    expect(link).not.toHaveAttribute("data-current");
  });

  it("applies active classes when current is true", () => {
    render(
      <MemoryRouter>
        <NavItem to="/home" icon={Home} label="Home" current />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    const icon = link.querySelector("svg");

    
    expect(screen.getByText("Home")).toHaveClass("text-text-primary");
    expect(screen.getByText("Home")).toHaveClass("font-bold");

    
    expect(icon).toHaveClass("text-text-primary");

    
    expect(link).toHaveAttribute("data-current", "true");
  });
});
