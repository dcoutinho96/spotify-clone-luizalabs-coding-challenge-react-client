import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import * as reactRouter from "react-router";

describe("App", () => {
  it("renders BrowserRouter with Layout", () => {
    render(<App />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("uses BrowserRouter from react-router", () => {
    const spy = vi.spyOn(reactRouter, "BrowserRouter");
    render(<App />);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
