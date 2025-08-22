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

    expect(screen.getByText("Home")).toHaveClass("text-gray-400");
    expect(screen.getByText("Home")).not.toHaveClass("font-semibold");
    expect(icon).toHaveClass("text-gray-400");
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

    expect(screen.getByText("Home")).toHaveClass("text-white");
    expect(screen.getByText("Home")).toHaveClass("font-semibold");
    expect(icon).toHaveClass("text-white");
    expect(link).toHaveAttribute("data-current", "true");
  });
});
