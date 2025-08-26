import { useMemo } from "react";

export function useIsIos(): boolean {
  return useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);
}
