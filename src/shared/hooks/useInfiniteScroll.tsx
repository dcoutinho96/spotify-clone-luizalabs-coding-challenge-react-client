import { useEffect, useRef, useCallback } from "react";

type InfiniteScrollOptions = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
};

export function useInfiniteScroll<T extends HTMLElement>({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "200px",
}: InfiniteScrollOptions) {
  const ref = useRef<T | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin,
      threshold: 0.1,
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [observerCallback, rootMargin]);

  return ref;
}
