import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns unauthenticated state when no token", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuth).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it("returns authenticated state when token exists", () => {
    sessionStorage.setItem("access_token", "test-token");
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuth).toBe(true);
    expect(result.current.token).toBe("test-token");
  });
});
