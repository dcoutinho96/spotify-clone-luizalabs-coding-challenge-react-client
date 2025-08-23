import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders the container with correct accessibility attributes", () => {
    render(<LoadingSpinner />);
    const container = screen.getByTestId("loading");

    expect(container.tagName.toLowerCase()).toBe("output");
    expect(container).toHaveAttribute("aria-label", "Loading");
  });

  it("renders exactly 3 animated bars", () => {
    render(<LoadingSpinner />);
    const bars = screen.getByTestId("loading").querySelectorAll("div");
    expect(bars.length).toBe(3);
  });
it("renders each bar with correct base styles", () => {
  render(<LoadingSpinner />);
  const bars = screen.getByTestId("loading").querySelectorAll("div");

  bars.forEach((bar, i) => {
    
    expect(bar).toHaveStyle({ width: "6px" });
    
    const bg = bar.style.backgroundColor;
    expect(bg === "currentColor" || bg === "currentcolor").toBe(true);
    
    expect(bar.style.borderRadius).toBe("2px");
    
    if (i > 0) {
      expect(bar).toHaveStyle({ marginLeft: "4px" }); 
    }
  });
});

});
