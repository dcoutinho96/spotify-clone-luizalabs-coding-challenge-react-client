import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "./";
import * as gql from "~/gql";

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const makeResult = (data: unknown) =>
    ({
      data,
      status: "success",
      fetchStatus: "idle",
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
      remove: vi.fn(),
      failureCount: 0,
      isPaused: false,
      isPending: false,
      isRefetching: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureReason: null,
    } as unknown as ReturnType<typeof gql.useHelloQuery>);

  it("renders protected text", () => {
    vi.spyOn(gql, "useHelloQuery").mockReturnValue(makeResult({ hello: "world" }));

    render(<DashboardPage />);

    expect(screen.getByText("PROTECTED")).toBeInTheDocument();
    expect(gql.useHelloQuery).toHaveBeenCalled();
  });

  it("still renders even with no data", () => {
    vi.spyOn(gql, "useHelloQuery").mockReturnValue(makeResult(undefined));

    render(<DashboardPage />);

    expect(screen.getByText("PROTECTED")).toBeInTheDocument();
  });
});
