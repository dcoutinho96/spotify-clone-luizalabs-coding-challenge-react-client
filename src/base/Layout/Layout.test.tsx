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

// Simple mocks
vi.mock("~/features", () => ({
  HomePage: () => <div>HOME PAGE</div>,
  DashboardPage: () => <div>MOCK DASHBOARD PAGE</div>,
}));

// Type-safe shared mock
vi.mock("~/shared", async () => {
  const actual: typeof import("~/shared") = await vi.importActual<typeof import("~/shared")>("~/shared");
  return {
    ...actual,
    LoadingSpinner: () => <div data-testid="spinner">MOCK SPINNER</div>,
    useAuth: () => mockAuthState,
    NavItem: ({ label }: { label: string }) => <div>{label}</div>,
  };
});

// Type-safe base mock
vi.mock("~/base", async () => {
  const actual: typeof import("~/base") = await vi.importActual<typeof import("~/base")>("~/base");
  return {
    ...actual,
    LoginPage: () => <div>LOGIN PAGE</div>,
    PrivateRoute: () => {
      if (mockAuthState.loading) return <div data-testid="spinner">MOCK SPINNER</div>;
      if (mockAuthState.isAuth) return <div>MOCK DASHBOARD PAGE</div>;
      return <div data-testid="blocked">BLOCKED</div>;
    },
    Navbar: () => <nav data-testid="navbar">MOCK NAVBAR</nav>,
  };
});

// Type-safe React mock
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

describe("Layout routing with isAuth", () => {
  beforeEach(() => {
    mockAuthState = { loading: false, isAuth: false, token: null };
  });

  const renderAt = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Layout />
      </MemoryRouter>
    );

  it("renders the layout wrapper", () => {
    renderAt(ROUTES.home);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("does NOT render Navbar when not authenticated", () => {
    renderAt(ROUTES.home);
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("renders Navbar when authenticated", () => {
    mockAuthState.isAuth = true;
    renderAt(ROUTES.home);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
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

  it("renders nothing (empty) for unknown routes", async () => {
    renderAt("/unknown");
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.queryByText("HOME PAGE")).not.toBeInTheDocument();
    expect(screen.queryByText("LOGIN PAGE")).not.toBeInTheDocument();
    expect(screen.queryByText("MOCK DASHBOARD PAGE")).not.toBeInTheDocument();
  });
});
