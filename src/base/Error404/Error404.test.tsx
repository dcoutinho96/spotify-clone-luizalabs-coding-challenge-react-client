import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { Error404 } from "./Error404";

vi.mock("~/shared", () => ({
  ErrorComponent: ({ icon: Icon, titleKey, messageKey }: any) => (
    <div data-testid="error-component">
      <Icon data-testid="error-icon" />
      <h1 data-testid="error-title">{titleKey}</h1>
      <p data-testid="error-message">{messageKey}</p>
    </div>
  ),
}));

describe("Error404", () => {
  it("renders ErrorComponent with correct props", () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-component")).toBeInTheDocument();
    expect(screen.getByTestId("error-title")).toHaveTextContent("errors.404.title");
    expect(screen.getByTestId("error-message")).toHaveTextContent("errors.404.message");
  });

  it("passes SearchX icon to ErrorComponent", () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("renders with correct translation keys", () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-title")).toHaveTextContent("errors.404.title");
    expect(screen.getByTestId("error-message")).toHaveTextContent("errors.404.message");
  });
});
