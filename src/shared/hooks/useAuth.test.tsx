import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { AuthProvider, useAuth, authEvents } from "~/shared";

function TestConsumer() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="token">{auth.token ?? "null"}</div>
      <div data-testid="user">{auth.user?.display_name ?? "null"}</div>
      <div data-testid="isAuth">{auth.isAuth ? "true" : "false"}</div>
      <div data-testid="loading">{auth.loading ? "true" : "false"}</div>
      <button onClick={() => auth.logout()}>logout</button>
      <button onClick={() => auth.refresh()}>refresh</button>
    </div>
  );
}

describe("AuthProvider + useAuth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  it("throws if useAuth is used outside provider", () => {
    const BadConsumer = () => {
      expect(() => useAuth()).toThrow();
      return null;
    };
    render(<BadConsumer />);
  });

  it("starts unauthenticated when no token", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("isAuth").textContent).toBe("false");
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("fetches user when token exists", async () => {
    sessionStorage.setItem("access_token", "abc123");
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", display_name: "Tester" }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Tester")
    );
    expect(screen.getByTestId("isAuth").textContent).toBe("true");
  });

  it("logs out if /me returns 401 and no cached user", async () => {
    sessionStorage.setItem("access_token", "badtoken");
    (global.fetch as any).mockResolvedValue({ ok: false, status: 401 });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("token").textContent).toBe("null")
    );
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("isAuth").textContent).toBe("false");
  });

  it("uses cached user when offline and request fails", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: "c1", display_name: "Cached" })
    );
    sessionStorage.setItem("access_token", "sometoken");
    
    (global.fetch as any).mockRejectedValue(new TypeError("Failed to fetch"));
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Cached")
    );
    expect(screen.getByTestId("token").textContent).toBe("sometoken");
    expect(screen.getByTestId("isAuth").textContent).toBe("true");
  });

  it("updates state on authEvents token emit", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "2", display_name: "EventUser" }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    authEvents.emit("token", "neat-token");

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("EventUser")
    );
  });

  it("clears state on authEvents logout emit", async () => {
    sessionStorage.setItem("access_token", "abc");
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", display_name: "X" }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("X")
    );

    authEvents.emit("logout", undefined);

    await waitFor(() =>
      expect(screen.getByTestId("isAuth").textContent).toBe("false")
    );
  });

  it("logout() calls emit and clears state", async () => {
    sessionStorage.setItem("access_token", "abc");
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", display_name: "Y" }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Y")
    );

    screen.getByText("logout").click();

    await waitFor(() =>
      expect(screen.getByTestId("isAuth").textContent).toBe("false")
    );
  });

  it("refresh() refetches user", async () => {
    sessionStorage.setItem("access_token", "abc");
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1", display_name: "First" }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("First")
    );

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "2", display_name: "Second" }),
    });

    screen.getByText("refresh").click();

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("Second")
    );
  });
});
