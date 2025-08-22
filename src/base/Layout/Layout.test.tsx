// src/base/Layout/Layout.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ROUTES } from "~/config";

let mockAuthState = {
  loading: false,
  isAuth: false,
  token: null as string | null,
};

vi.mock("~/features", () => ({
  HomePage: () => <div>HOME PAGE</div>,
  DashboardPage: () => <div>MOCK DASHBOARD PAGE</div>,
}));

vi.mock("~/shared", () => ({
  LoadingSpinner: () => <div data-testid="spinner">MOCK SPINNER</div>,
  useAuth: () => mockAuthState,
}));

vi.mock("~/base", () => {
  return {
    LoginPage: () => <div>LOGIN PAGE</div>,
    PrivateRoute: () => {
      if (mockAuthState.loading) return <div data-testid="spinner">MOCK SPINNER</div>;
      if (mockAuthState.isAuth) return <div>MOCK DASHBOARD PAGE</div>;
      return <div data-testid="blocked">BLOCKED</div>;
    },
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react");
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    lazy: (factory: () => Promise<{ default: React.ComponentType }>) => {
      const promise = factory();
      return (props: Record<string, unknown>) => {
        const [Comp, setComp] = actual.useState<React.ComponentType | null>(null);
        actual.useEffect(() => {
          let mounted = true;
          promise.then((mod) => mounted && setComp(() => mod.default));
          return () => {
            mounted = false;
          };
        }, []);
        return Comp ? <Comp {...props} /> : null;
      };
    },
  };
});

const { Layout } = await import("./Layout");

describe("Layout routing", () => {
  beforeEach(() => {
    mockAuthState = { loading: false, isAuth: false, token: null };
  });

  const renderAt = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Layout />
      </MemoryRouter>
    );

  it("renders the wrapper", () => {
    renderAt(ROUTES.home);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("renders HomePage at '/'", async () => {
    renderAt(ROUTES.home);
    expect(await screen.findByText("HOME PAGE")).toBeInTheDocument();
  });

  it("renders LoginPage at '/login'", async () => {
    renderAt(ROUTES.login);
    expect(await screen.findByText("LOGIN PAGE")).toBeInTheDocument();
  });

  it("shows spinner at '/dashboard' while auth is loading", async () => {
    mockAuthState.loading = true;
    renderAt(ROUTES.dashboard);
    expect(await screen.findByTestId("spinner")).toBeInTheDocument();
  });

  it("redirects unauthenticated users from '/dashboard'", async () => {
    mockAuthState.isAuth = false;
    renderAt(ROUTES.dashboard);
    expect(await screen.findByTestId("blocked")).toBeInTheDocument();
  });

  it("renders DashboardPage at '/dashboard' when authenticated", async () => {
    mockAuthState.isAuth = true;
    mockAuthState.token = "mock-token";
    renderAt(ROUTES.dashboard);
    expect(await screen.findByText("MOCK DASHBOARD PAGE")).toBeInTheDocument();
  });
});
