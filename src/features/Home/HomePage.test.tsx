import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { i18n } from "~/i18n";
import { HomePage } from "./HomePage";
import { loginWithSpotify } from "~/auth";

vi.mock("~/auth", () => ({
  loginWithSpotify: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock useAuth hook
const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("~/shared", () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
  Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
  Text: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} />
  ),
  Container: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} />
  ),
  useAuth: mockUseAuth,
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: unauthenticated user
    mockUseAuth.mockReturnValue({
      isAuth: false,
      loading: false,
    });
  });

  const renderWithI18n = () =>
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage />
        </I18nextProvider>
      </MemoryRouter>
    );

  it("executes useTranslation with real i18n", () => {
    renderWithI18n();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("executes useTranslation mocked", () => {
    vi.doMock("react-i18next", () => ({
      useTranslation: () => ({ t: (key: string) => key }),
    }));
    renderWithI18n();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the Spotify logo with correct alt text", () => {
    renderWithI18n();
    const logo = screen.getByRole("img", { name: /Spotify Logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "assets/Spotify_Logo_RGB_white.png");
  });

  it("renders the login instructions text", () => {
    renderWithI18n();
    // The text will be in English since that's what the i18n is defaulting to
    expect(screen.getByText(/Sign in with your Spotify account/i)).toBeInTheDocument();
  });

  it("renders a login button", () => {
    renderWithI18n();
    // The button text will be in English
    const button = screen.getByRole("button", { name: /Sign In/i });
    expect(button).toBeInTheDocument();
  });

  it("calls loginWithSpotify when the button is clicked", () => {
    renderWithI18n();
    const button = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(button);
    expect(loginWithSpotify).toHaveBeenCalledTimes(1);
  });

  it("redirects to dashboard when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuth: true,
      loading: false,
    });

    renderWithI18n();

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("does not render content when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuth: true,
      loading: false,
    });

    renderWithI18n();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("does not render content while loading", () => {
    mockUseAuth.mockReturnValue({
      isAuth: false,
      loading: true,
    });

    renderWithI18n();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("does not redirect when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuth: false,
      loading: false,
    });

    renderWithI18n();

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});