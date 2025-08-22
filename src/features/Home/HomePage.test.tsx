// src/features/Home/HomePage.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import { i18n } from "~/i18n";
import { HomePage } from "./HomePage";
import { loginWithSpotify } from "~/auth";

vi.mock("~/auth", () => ({
  loginWithSpotify: vi.fn(),
}));

vi.mock("~/shared", () => {
  return {
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
  };
});

describe("HomePage", () => {
  const renderWithI18n = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>
    );

  it("executes useTranslation with real i18n (covers ESM branch)", () => {
    renderWithI18n();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("executes useTranslation with mocked CJS module (covers CJS branch)", async () => {
    vi.resetModules();
    vi.doMock("react-i18next", () => ({
      __esModule: false,
      useTranslation: () => ({ t: (key: string) => key }),
    }));
    const { HomePage: CjsHomePage } = await import("./HomePage");
    render(<CjsHomePage />);
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
    expect(screen.getByText(/Spotify clicando no botão/i)).toBeInTheDocument();
  });

  it("renders a login button", () => {
    renderWithI18n();
    const button = screen.getByRole("button", { name: /Entrar/i });
    expect(button).toBeInTheDocument();
  });

  it("calls loginWithSpotify when the button is clicked", () => {
    renderWithI18n();
    const button = screen.getByRole("button", { name: /Entrar/i });
    fireEvent.click(button);
    expect(loginWithSpotify).toHaveBeenCalledTimes(1);
  });
});
