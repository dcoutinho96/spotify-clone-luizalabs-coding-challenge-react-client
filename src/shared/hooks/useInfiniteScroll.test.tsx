import { render, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useInfiniteScroll } from "./useInfiniteScroll";

const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn().mockImplementation((callback, options) => {
      (IntersectionObserver as any)._callback = callback;
      (IntersectionObserver as any)._options = options;
      return { observe, unobserve, disconnect };
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function TestComponent({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}) {
  const ref = useInfiniteScroll<HTMLDivElement>({
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin,
  });
  return <div ref={ref}>sentinel</div>;
}

describe("useInfiniteScroll", () => {
  it("calls onLoadMore when intersecting and hasMore=true, isLoading=false", () => {
    const onLoadMore = vi.fn();
    render(<TestComponent hasMore isLoading={false} onLoadMore={onLoadMore} />);

    act(() => {
      const cb = (IntersectionObserver as any)._callback;
      cb([{ isIntersecting: true }]);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not call onLoadMore when isLoading=true", () => {
    const onLoadMore = vi.fn();
    render(<TestComponent hasMore isLoading onLoadMore={onLoadMore} />);

    act(() => {
      const cb = (IntersectionObserver as any)._callback;
      cb([{ isIntersecting: true }]);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("does not call onLoadMore when hasMore=false", () => {
    const onLoadMore = vi.fn();
    render(<TestComponent hasMore={false} isLoading={false} onLoadMore={onLoadMore} />);

    act(() => {
      const cb = (IntersectionObserver as any)._callback;
      cb([{ isIntersecting: true }]);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const onLoadMore = vi.fn();
    const { unmount } = render(
      <TestComponent hasMore isLoading={false} onLoadMore={onLoadMore} />
    );

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("passes rootMargin into IntersectionObserver options", () => {
    const onLoadMore = vi.fn();
    render(
      <TestComponent
        hasMore
        isLoading={false}
        onLoadMore={onLoadMore}
        rootMargin="500px"
      />
    );

    expect((IntersectionObserver as any)._options.rootMargin).toBe("500px");
  });
});
