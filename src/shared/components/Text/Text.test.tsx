import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Text } from "./Text";

describe("Text (accessible)", () => {
  it("renders as a paragraph by default", () => {
    render(<Text>Default text</Text>);
    const el = screen.getByText("Default text");
    expect(el.tagName.toLowerCase()).toBe("p");
    expect(el).toHaveClass("text-[color:var(--color-text-primary)]");
  });

  it("renders with custom semantic elements", () => {
    render(
      <>
        <Text as="span">Inline</Text>
        <Text as="h1">Heading</Text>
      </>
    );
    expect(screen.getByText("Inline").tagName.toLowerCase()).toBe("span");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Heading");
  });

  it("applies custom color and className", () => {
    render(<Text color="red" className="extra">Styled</Text>);
    const el = screen.getByText("Styled");
    expect(el).toHaveClass("text-[color:red]");
    expect(el).toHaveClass("extra");
  });

  it("trims whitespace in className", () => {
    render(<Text className="  spaced  ">Trimmed</Text>);
    const el = screen.getByText("Trimmed");
    expect(el.className.includes("spaced")).toBe(true);
  });

  it("supports aria-label for accessibility", () => {
    render(<Text aria-label="custom label">Hidden text</Text>);
    const el = screen.getByLabelText("custom label");
    expect(el).toBeInTheDocument();
  });

  it("supports role override", () => {
    render(<Text role="note">Note text</Text>);
    const el = screen.getByRole("note");
    expect(el).toHaveTextContent("Note text");
  });
});
