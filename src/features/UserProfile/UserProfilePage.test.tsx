import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProfilePage } from "./UserProfilePage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        "profile.alt-profile-picture": "Profile picture",
        "profile.sign-out-button": "Sign out",
      };
      return dict[key] ?? key;
    },
  }),
}));

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("~/shared", async () => {
  const actual = await vi.importActual("~/shared");
  return {
    ...actual,
    useAuth: () => ({
      logout: mockLogout,
    }),
  };
});

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

type MeImage = { url: string };
type Me = {
  __typename: "User";
  id: string;
  displayName: string;
  images: MeImage[];
};
type MeQuery = { me: Me };

vi.mock("~/gql", () => ({
  useMeQuery: vi.fn(),
}));

import { useMeQuery } from "~/gql";

type QueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const makeResult = <T,>(data: T | undefined, isLoading = false): QueryResult<T> => ({
  data,
  isLoading,
  isFetching: isLoading,
  isSuccess: !isLoading && !!data,
  isError: false,
});

describe("UserProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner when isLoading is true", () => {
    (useMeQuery as unknown as Mock).mockReturnValue(makeResult<MeQuery>(undefined, true));

    render(
      <MemoryRouter>
        <UserProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
  });

  it("renders profile once data is loaded", () => {
    (useMeQuery as unknown as Mock).mockReturnValue(
      makeResult<MeQuery>({
        me: {
          __typename: "User",
          id: "1",
          displayName: "Alice Cooper",
          images: [{ url: "https://example.com/alice.jpg" }],
        },
      })
    );

    render(
      <MemoryRouter>
        <UserProfilePage />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Alice Cooper")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    
    const img = screen.getByRole("img", { name: "Profile picture" }) as HTMLImageElement;
    
    expect(img).toHaveAttribute("src", "https://example.com/alice.jpg");
    
    expect(img).toHaveClass("w-32");
    expect(img).toHaveClass("aspect-square");
    expect(img).toHaveClass("rounded-full");
    expect(img).toHaveClass("object-cover");
  });

  it("falls back to placeholder when there is no image", () => {
    (useMeQuery as unknown as Mock).mockReturnValue(
      makeResult<MeQuery>({
        me: {
          __typename: "User",
          id: "2",
          displayName: "No Pic",
          images: [],
        },
      })
    );

    render(
      <MemoryRouter>
        <UserProfilePage />
      </MemoryRouter>
    );

    const img = screen.getByRole("img", { name: "Profile picture" }) as HTMLImageElement;
    expect(img).toHaveAttribute("src", "/assets/placeholder-avatar.png");
    expect(screen.getByText("No Pic")).toBeInTheDocument();
  });

  it("calls logout and navigates to home when sign out button is clicked", () => {
    (useMeQuery as unknown as Mock).mockReturnValue(
      makeResult<MeQuery>({
        me: {
          __typename: "User",
          id: "1",
          displayName: "Alice Cooper",
          images: [{ url: "https://example.com/alice.jpg" }],
        },
      })
    );

    render(
      <MemoryRouter>
        <UserProfilePage />
      </MemoryRouter>
    );

    const signOutButton = screen.getByRole("button", { name: "Sign out" });
    fireEvent.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
