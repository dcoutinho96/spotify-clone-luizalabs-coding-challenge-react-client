import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

vi.mock("~/base", async () => {
  const actual: typeof import("~/base") = await vi.importActual<typeof import("~/base")>("~/base");
  return {
    ...actual,
    Navbar: () => <div data-testid="navbar">MOCK NAVBAR</div>,
  };
});

describe("App", () => {
  it("renders Layout inside BrowserRouter", () => {
    render(<App />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

});
