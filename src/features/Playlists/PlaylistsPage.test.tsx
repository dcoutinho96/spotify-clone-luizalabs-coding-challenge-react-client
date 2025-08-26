import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlaylistsPage } from "./PlaylistsPage";

let sentinelAttached = false;

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@tanstack/react-query", () => {
  return {
    useInfiniteQuery: vi.fn(),
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

vi.mock("~/gql", () => ({
  fetcher: vi.fn(),
  MyPlaylistsDocument: {},
  useCreatePlaylistMutation: vi.fn(),
}));

vi.mock("~/shared", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
  LoadingSpinner: () => <div data-testid="loading" />,
  Text: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={className}>{children}</span>
  ),
  useInfiniteScroll: vi.fn(() => (node: HTMLDivElement | null) => {
    if (node) sentinelAttached = true;
  }),
}));

vi.mock("~/shared/components/Modal", () => ({
  Modal: ({ isOpen, children, onClose }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <button data-testid="close" onClick={onClose}>
          x
        </button>
        {children}
      </div>
    ) : null,
}));

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCreatePlaylistMutation } from "~/gql";

const mockInfinite = useInfiniteQuery as unknown as Mock;
const mockMutation = useCreatePlaylistMutation as unknown as Mock;

describe("PlaylistsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sentinelAttached = false;
  });

  it("shows loading spinner when isLoading and no edges", () => {
    mockInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders playlist list and attaches sentinel", () => {
    mockInfinite.mockReturnValue({
      data: {
        pages: [
          {
            myPlaylists: {
              edges: [
                {
                  node: {
                    id: "p1",
                    name: "Chill Vibes",
                    images: [{ url: "https://img.com/pl.png" }],
                    owner: { displayName: "Alice" },
                  },
                },
              ],
              pageInfo: { hasNextPage: false },
            },
          },
        ],
      },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Chill Vibes")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Chill Vibes" })).toHaveAttribute(
      "src",
      "https://img.com/pl.png"
    );
    expect(sentinelAttached).toBe(true);
  });

  it("uses placeholder image when playlist has no images", () => {
    mockInfinite.mockReturnValue({
      data: {
        pages: [
          {
            myPlaylists: {
              edges: [
                {
                  node: {
                    id: "p2",
                    name: "No Image Playlist",
                    images: [],
                    owner: { displayName: "Bob" },
                  },
                },
              ],
              pageInfo: { hasNextPage: false },
            },
          },
        ],
      },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: "No Image Playlist" })).toHaveAttribute(
      "src",
      "/assets/placeholder-avatar.png"
    );
  });

  it("opens and closes modal", () => {
    mockInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate: vi.fn(), isPending: false });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("playlists.create-playlist"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("submits new playlist with button click and Enter key", () => {
    const mutate = vi.fn();
    mockInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate, isPending: false });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("playlists.create-playlist"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "My New Playlist" } });
    
    fireEvent.click(screen.getByText("playlists.create"));
    expect(mutate).toHaveBeenCalledWith({ name: "My New Playlist", public: true });
    
    mutate.mockClear();
    fireEvent.submit(input.closest("form")!);
    expect(mutate).toHaveBeenCalledWith({ name: "My New Playlist", public: true });
  });

  it("disables submit when name is empty", () => {
    const mutate = vi.fn();
    mockInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate, isPending: false });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("playlists.create-playlist"));
    const button = screen.getByText("playlists.create");
    expect(button).toBeDisabled();
  });

  it("shows loading state when creating playlist", () => {
    mockInfinite.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    mockMutation.mockReturnValue({ mutate: vi.fn(), isPending: true });

    render(
      <MemoryRouter>
        <PlaylistsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("playlists.create-playlist"));
    expect(screen.getByText("common.loading")).toBeInTheDocument();
  });
});
