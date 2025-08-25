import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("~/base/Error500", () => ({
  Error500: () => (
    <div data-testid="error-500">
      <h1>errors.500.title</h1>
      <p>errors.500.message</p>
      <button>errors.backHome</button>
    </div>
  ),
}));

vi.mock("~/base/Error404", () => ({
  Error404: () => (
    <div data-testid="error-404">
      <h1>errors.404.title</h1>
      <p>errors.404.message</p>
      <button>errors.backHome</button>
    </div>
  ),
}));

const Boom = () => {
  throw new Error("Boom");
};

describe("ErrorBoundary", () => {
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    spy = vi.spyOn(console, "error").mockImplementation(() => { });
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Safe</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Safe");
  });

  it("renders default fallback when child throws", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId("error-500")).toBeInTheDocument();
    expect(screen.getByText("errors.500.title")).toBeInTheDocument();
    expect(screen.getByText("errors.500.message")).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    const [, error] = spy.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Boom");
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Custom</div>}>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("fallback")).toHaveTextContent("Custom");
  });

  it("resets state when remounted", () => {
    const { unmount } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId("error-500")).toBeInTheDocument();
    unmount();
    render(
      <ErrorBoundary>
        <div data-testid="fresh">Safe</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId("fresh")).toHaveTextContent("Safe");
  });

  it("renders Error404 for Not Found errors", () => {
    const NotFoundError = () => {
      throw new Error("Not Found");
    };

    render(
      <ErrorBoundary>
        <NotFoundError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("error-404")).toBeInTheDocument();
    expect(screen.getByText("errors.404.title")).toBeInTheDocument();
    expect(screen.getByText("errors.404.message")).toBeInTheDocument();
  });
});
