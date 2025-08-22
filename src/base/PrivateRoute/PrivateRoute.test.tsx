import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import * as shared from "~/shared";
import { PrivateRoute } from "./PrivateRoute";

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRoutes = () =>
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/login" element={<div>LOGIN</div>} />
          <Route element={<PrivateRoute redirectTo="/login" />}>
            <Route path="/private" element={<div>PROTECTED</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

  it("shows LoadingSpinner while auth is loading", () => {
    (vi.spyOn(shared, "useAuth") as unknown as Mock).mockReturnValue({
      loading: true,
      isAuth: false,
    });

    renderWithRoutes();

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByText("PROTECTED")).not.toBeInTheDocument();
    expect(screen.queryByText("LOGIN")).not.toBeInTheDocument();
  });

  it("renders Outlet when authenticated", () => {
    (vi.spyOn(shared, "useAuth") as unknown as Mock).mockReturnValue({
      loading: false,
      isAuth: true,
    });

    renderWithRoutes();

    expect(screen.getByText("PROTECTED")).toBeInTheDocument();
    expect(screen.queryByText("LOGIN")).not.toBeInTheDocument();
  });

  it("redirects when unauthenticated", () => {
    (vi.spyOn(shared, "useAuth") as unknown as Mock).mockReturnValue({
      loading: false,
      isAuth: false,
    });

    renderWithRoutes();

    expect(screen.getByText("LOGIN")).toBeInTheDocument();
    expect(screen.queryByText("PROTECTED")).not.toBeInTheDocument();
  });
});
