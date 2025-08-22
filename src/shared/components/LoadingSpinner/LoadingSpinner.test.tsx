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

  it("renders the SVG with correct attributes", () => {
    render(<LoadingSpinner />);
    const svg = screen.getByTestId("loading").querySelector("svg")!;

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
    expect(svg).toHaveAttribute("viewBox", "0 0 48 48");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders exactly 3 bars", () => {
    render(<LoadingSpinner />);
    const rects = screen.getByTestId("loading").querySelectorAll("rect");
    expect(rects.length).toBe(3);
  });

  it("renders each bar with correct base attributes", () => {
    render(<LoadingSpinner />);
    const rects = screen.getByTestId("loading").querySelectorAll("rect");

    rects.forEach((rect, i) => {
      expect(rect).toHaveAttribute("x", String(i * 10));
      expect(rect).toHaveAttribute("y", "20");
      expect(rect).toHaveAttribute("width", "6");
      expect(rect).toHaveAttribute("height", "12");
      expect(rect).toHaveAttribute("rx", "2");
    });
  });

  it("renders animate tags with correct attributes", () => {
    render(<LoadingSpinner />);
    const rects = screen.getByTestId("loading").querySelectorAll("rect");

    rects.forEach((rect, i) => {
      const animates = rect.querySelectorAll("animate");
      expect(animates.length).toBe(2);

      const [heightAnim, yAnim] = animates;

      expect(heightAnim).toHaveAttribute("attributeName", "height");
      expect(heightAnim).toHaveAttribute("values", "12;36;12");
      expect(heightAnim).toHaveAttribute("dur", "0.9s");
      expect(heightAnim).toHaveAttribute("begin", `${i * 0.15}s`);
      expect(heightAnim).toHaveAttribute("repeatCount", "indefinite");

      expect(yAnim).toHaveAttribute("attributeName", "y");
      expect(yAnim).toHaveAttribute("values", "20;4;20");
      expect(yAnim).toHaveAttribute("dur", "0.9s");
      expect(yAnim).toHaveAttribute("begin", `${i * 0.15}s`);
      expect(yAnim).toHaveAttribute("repeatCount", "indefinite");
    });
  });
});
