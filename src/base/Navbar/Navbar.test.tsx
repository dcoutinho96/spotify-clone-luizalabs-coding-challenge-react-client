import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";
import { ROUTES } from "~/config";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Navbar", () => {
  const renderWithPath = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Navbar />
      </MemoryRouter>
    );

  it("renders Spotify logo with translated alt text", () => {
    renderWithPath(ROUTES.dashboard);
    expect(screen.getByAltText("accessibility.spotify-logo")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    renderWithPath(ROUTES.dashboard);

    expect(screen.getByRole("link", { name: "navbar.home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "navbar.artists" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "navbar.playlists" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "navbar.profile" })).toBeInTheDocument();
  });

  it("highlights Home when at dashboard route", () => {
    renderWithPath(ROUTES.dashboard);
    const home = screen.getByRole("link", { name: "navbar.home" });
    expect(home).toHaveClass("active");
  });

  it("highlights Artists when path starts with artists", () => {
    renderWithPath(`${ROUTES.artists}/123`);
    const artists = screen.getByRole("link", { name: "navbar.artists" });
    expect(artists).toHaveClass("active");
  });

  it("highlights Playlists when path starts with playlists", () => {
    renderWithPath(`${ROUTES.playlists}/abc`);
    const playlists = screen.getByRole("link", { name: "navbar.playlists" });
    expect(playlists).toHaveClass("active");
  });

  it("highlights Profile when path starts with profile", () => {
    renderWithPath(`${ROUTES.profile}/me`);
    const profile = screen.getByRole("link", { name: "navbar.profile" });
    expect(profile).toHaveClass("active");
  });
});
