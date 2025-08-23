import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button (accessible)", () => {
  it("renders with default props", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button", { name: "Default" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("h-[2.625rem]");
    expect(btn).toHaveClass("bg-brand");
  });

  it("applies size variants correctly", () => {
    render(
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>
    );
    expect(screen.getByRole("button", { name: "Small" })).toHaveClass("h-[2.625rem]");
    expect(screen.getByRole("button", { name: "Medium" })).toHaveClass("h-[3.625rem]");
    expect(screen.getByRole("button", { name: "Large" })).toHaveClass("h-[4rem]");
  });

  it("applies variant styles correctly", () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </>
    );
    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass("bg-brand");
    expect(screen.getByRole("button", { name: "Secondary" })).toHaveClass("bg-surface-3");
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border");
    expect(screen.getByRole("button", { name: "Ghost" })).toHaveClass("text-text-secondary");
  });

  it("handles disabled state with aria-disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: "Disabled" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).toHaveClass("opacity-50");
  });

  it("accepts custom className", () => {
    render(<Button className="extra">Custom</Button>);
    const btn = screen.getByRole("button", { name: "Custom" });
    expect(btn).toHaveClass("extra");
  });

  it("fires onClick when enabled", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
