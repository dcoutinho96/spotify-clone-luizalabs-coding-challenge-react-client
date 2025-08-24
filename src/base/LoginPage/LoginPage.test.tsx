import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { handleSpotifyCallback } from "~/auth/callback";
import { ROUTES } from "~/config";
import { BrowserRouter } from "react-router-dom";

vi.mock("~/auth/callback", () => ({
  handleSpotifyCallback: vi.fn(),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("~/shared", () => ({
  LoadingSpinner: () => <div data-testid="loading">Loading...</div>,
}));

describe("LoginPage", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    navigateMock.mockClear();
    (handleSpotifyCallback as unknown as Mock).mockReset();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    vi.resetModules();
  });

  it("renders the loading spinner", () => {
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login" },
      writable: true,
      configurable: true,
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("navigates home if code is missing", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login?state=abc" },
      writable: true,
      configurable: true,
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.home);
    });
  });

  it("navigates home if state is missing", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login?code=123" },
      writable: true,
      configurable: true,
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.home);
    });
  });

  it("navigates home if both code and state are missing", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login" },
      writable: true,
      configurable: true,
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.home);
    });
  });

  it("calls handleSpotifyCallback and navigates to dashboard on success", async () => {
    (handleSpotifyCallback as unknown as Mock).mockResolvedValueOnce({ access_token: "token" });
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login?code=123&state=abc" },
      writable: true,
      configurable: true,
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(handleSpotifyCallback).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.dashboard);
    });
  });

  it("navigates home if handleSpotifyCallback throws an error", async () => {
  
  const error = new Error("Failed");
  (handleSpotifyCallback as unknown as Mock).mockImplementationOnce(() => Promise.reject(error));
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  Object.defineProperty(window, "location", {
    value: { href: "https://localhost:5173/login?code=123&state=abc" },
    writable: true,
    configurable: true,
  });

  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(handleSpotifyCallback).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith(ROUTES.home);
  });

  consoleErrorSpy.mockRestore();
});

  it("prevents multiple executions on re-render", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login?code=123&state=abc" },
      writable: true,
      configurable: true,
    });
    (handleSpotifyCallback as unknown as Mock).mockResolvedValueOnce({ access_token: "token" });
    const { rerender } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(handleSpotifyCallback).toHaveBeenCalledTimes(1);
    });
    rerender(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(handleSpotifyCallback).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.dashboard);
    });
  });

  it("does not navigate immediately when both code and state are present", async () => {
    (handleSpotifyCallback as unknown as Mock).mockResolvedValueOnce({ access_token: "token" });
    Object.defineProperty(window, "location", {
      value: { href: "https://localhost:5173/login?code=123&state=abc" },
      writable: true,
      configurable: true,
    });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(navigateMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.dashboard);
    });
  });

  it("exits early if useRef.current is already true", async () => {
    vi.doMock("react", async () => {
      const actual = await vi.importActual<typeof React>("react");
      return {
        ...actual,
        useRef: () => ({ current: true }),
      };
    });
    const { LoginPage: MockedLoginPage } = await import("./LoginPage");
    render(
      <BrowserRouter>
        <MockedLoginPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(handleSpotifyCallback).not.toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
