import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Image } from "./Image";

describe("Image", () => {
  it("renders with alt text", () => {
    render(<Image alt="test alt" src="test.png" />);
    const img = screen.getByRole("img", { name: "test alt" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test.png");
    expect(img).toHaveAttribute("alt", "test alt");
  });

  it("applies className", () => {
    render(<Image alt="class test" src="c.png" className="rounded" />);
    const img = screen.getByRole("img", { name: "class test" });
    expect(img).toHaveClass("rounded");
  });

  it("trims className", () => {
    render(<Image alt="trim test" src="t.png" className="  spaced " />);
    const img = screen.getByRole("img", { name: "trim test" });
    expect(img).toHaveClass("spaced");
  });

  it("spreads extra props", () => {
    render(<Image alt="extra test" src="e.png" data-testid="img-extra" />);
    const img = screen.getByTestId("img-extra");
    expect(img).toHaveAttribute("src", "e.png");
    expect(img).toHaveAttribute("alt", "extra test");
  });

  it("renders without alt text", () => {
    render(<Image src="no-alt.png" data-testid="no-alt" />);
    const img = screen.getByTestId("no-alt");
    expect(img).toHaveAttribute("alt", "");
  });
});
