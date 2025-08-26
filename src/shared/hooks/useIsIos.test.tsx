import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useIsIos } from "./useIsIos";

function withUserAgent(ua: string, fn: () => void) {
  const original = navigator.userAgent;
  Object.defineProperty(navigator, "userAgent", {
    value: ua,
    configurable: true,
  });
  try {
    fn();
  } finally {
    Object.defineProperty(navigator, "userAgent", {
      value: original,
      configurable: true,
    });
  }
}

describe("useIsIos", () => {
  it("returns true for iPhone userAgent", () => {
    withUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)", () => {
      const { result } = renderHook(() => useIsIos());
      expect(result.current).toBe(true);
    });
  });

  it("returns true for iPad userAgent", () => {
    withUserAgent("Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)", () => {
      const { result } = renderHook(() => useIsIos());
      expect(result.current).toBe(true);
    });
  });

  it("returns false for Android userAgent", () => {
    withUserAgent("Mozilla/5.0 (Linux; Android 13; Pixel 7)", () => {
      const { result } = renderHook(() => useIsIos());
      expect(result.current).toBe(false);
    });
  });

  it("returns false when navigator is undefined (SSR case)", () => {
    const originalNavigator = globalThis.navigator;
    delete (globalThis as any).navigator;

    const { result } = renderHook(() => useIsIos());
    expect(result.current).toBe(false);
    
    (globalThis as any).navigator = originalNavigator;
  });
});
