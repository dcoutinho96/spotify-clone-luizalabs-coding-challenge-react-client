import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "./";

import { useMeQuery, MeQuery } from "~/gql/generated"; // import the types if available

vi.mock("~/gql/generated", () => ({
  useMeQuery: vi.fn(),
}));

type QueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
};

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const makeResult = <T,>(data: T | undefined, isLoading = false): QueryResult<T> => ({
    data,
    isLoading,
    isFetching: isLoading,
    isSuccess: !isLoading,
    isError: false,
  });

  it("renders loading spinner when loading", () => {
    (useMeQuery as Mock).mockReturnValue(makeResult<MeQuery>(undefined, true));

    render(<DashboardPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

it("renders protected text with user displayName", () => {
  (useMeQuery as Mock).mockReturnValue(
    makeResult<MeQuery>({
      me: {
        __typename: "User",
        id: "1",
        displayName: "Alice",
        images: [],
      },
    })
  );

  render(<DashboardPage />);
  expect(screen.getByText("Hello, Alice")).toBeInTheDocument();
});

it("renders fallback text when no data", () => {
  (useMeQuery as Mock).mockReturnValue(
    makeResult<MeQuery>({
      me: {
        __typename: "User",
        id: "0",
        displayName: "Unknown User",
        images: [],
      },
    })
  );

  render(<DashboardPage />);
  expect(screen.getByText("Hello, Unknown User")).toBeInTheDocument();
});

});
