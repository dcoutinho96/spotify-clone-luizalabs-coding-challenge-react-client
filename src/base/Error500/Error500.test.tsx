import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { Error500 } from "./Error500";

// Mock the ErrorComponent
vi.mock("~/shared", () => ({
  ErrorComponent: ({ icon: Icon, iconColor, titleKey, messageKey }: any) => (
    <div data-testid="error-component">
      <Icon data-testid="error-icon" className={iconColor} />
      <h1 data-testid="error-title">{titleKey}</h1>
      <p data-testid="error-message">{messageKey}</p>
    </div>
  ),
}));

describe("Error500", () => {
  it("renders ErrorComponent with correct props", () => {
    render(
      <MemoryRouter>
        <Error500 />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-component")).toBeInTheDocument();
    expect(screen.getByTestId("error-title")).toHaveTextContent("errors.500.title");
    expect(screen.getByTestId("error-message")).toHaveTextContent("errors.500.message");
  });

  it("passes ServerCrash icon to ErrorComponent", () => {
    render(
      <MemoryRouter>
        <Error500 />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("passes custom icon color to ErrorComponent", () => {
    render(
      <MemoryRouter>
        <Error500 />
      </MemoryRouter>
    );

    const icon = screen.getByTestId("error-icon");
    expect(icon).toHaveClass("text-red-500");
  });

  it("renders with correct translation keys", () => {
    render(
      <MemoryRouter>
        <Error500 />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-title")).toHaveTextContent("errors.500.title");
    expect(screen.getByTestId("error-message")).toHaveTextContent("errors.500.message");
  });
});
