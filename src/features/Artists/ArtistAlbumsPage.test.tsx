import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: () => ({ artistId: "artist-1" }),
  };
});

vi.mock("~/gql", () => ({
  useArtistByIdQuery: vi.fn(),
}));

vi.mock("./useInfiniteArtistAlbums", () => ({
  useInfiniteArtistAlbums: vi.fn(),
}));

let sentinelAttached = false;
vi.mock("~/shared", () => ({
  BackButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="back-btn">{children}</button>
  ),
  Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
  LoadingSpinner: (props: { "data-testid"?: string }) => (
    <div data-testid={props["data-testid"] ?? "loading"} />
  ),
  Text: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={className}>{children}</span>
  ),
  useInfiniteScroll: vi.fn(() => (node: HTMLDivElement | null) => {
    if (node) sentinelAttached = true;
  }),
}));

import { ArtistAlbumsPage } from "./ArtistAlbumsPage";
import { useArtistByIdQuery } from "~/gql";
import { useInfiniteArtistAlbums } from "./useInfiniteArtistAlbums";

type Artist = {
  id: string;
  name: string;
  images: { url: string }[];
};

type AlbumNode = {
  id: string;
  name: string;
  releaseDate?: string | null;
  images: { url: string }[];
};

type AlbumsPage = {
  artistAlbums: {
    edges: { node: AlbumNode }[];
  };
};

const mockArtistHook = useArtistByIdQuery as unknown as Mock;
const mockInfiniteAlbumsHook = useInfiniteArtistAlbums as unknown as Mock;

const makeArtist = (over: Partial<Artist> = {}): Artist => ({
  id: "artist-1",
  name: "Radiohead",
  images: [{ url: "https://example.com/artist.jpg" }],
  ...over,
});

const makeAlbumsData = (edges: AlbumNode[]) => ({
  pages: [
    {
      artistAlbums: {
        edges: edges.map((node) => ({ node })),
      },
    } as AlbumsPage,
  ],
});

describe("ArtistAlbumsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sentinelAttached = false;
  });

  it("shows loading spinner while artist is loading", () => {
    mockArtistHook.mockReturnValue({ data: undefined, isLoading: true });
    mockInfiniteAlbumsHook.mockReturnValue({
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <MemoryRouter>
        <ArtistAlbumsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders not-found message when artist is missing", () => {
    mockArtistHook.mockReturnValue({ data: { artistById: null }, isLoading: false });
    mockInfiniteAlbumsHook.mockReturnValue({
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <MemoryRouter>
        <ArtistAlbumsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("artist.notFound")).toBeInTheDocument();
  });

  it("renders artist header, avatar and albums and attaches sentinel ref", () => {
    mockArtistHook.mockReturnValue({
      data: { artistById: makeArtist() },
      isLoading: false,
    });

    mockInfiniteAlbumsHook.mockReturnValue({
      data: makeAlbumsData([
        {
          id: "alb-1",
          name: "In Rainbows",
          releaseDate: "2007-10-10",
          images: [{ url: "https://example.com/in-rainbows.jpg" }],
        },
        {
          id: "alb-2",
          name: "OK Computer",
          releaseDate: "1997-05-21",
          images: [],
        },
      ]),
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(
      <MemoryRouter>
        <ArtistAlbumsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("back-btn")).toHaveTextContent("Radiohead");
    const artistImg = screen.getByRole("img", { name: "Radiohead" });
    expect(artistImg).toHaveAttribute("src", "https://example.com/artist.jpg");
    expect(screen.getByText("In Rainbows")).toBeInTheDocument();
    expect(screen.getByText("2007-10-10")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "In Rainbows" })).toHaveAttribute("src", "https://example.com/in-rainbows.jpg");
    expect(screen.getByText("OK Computer")).toBeInTheDocument();
    expect(screen.getByText("1997-05-21")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "OK Computer" })).toHaveAttribute("src", "/assets/placeholder-album.png");
    expect(sentinelAttached).toBe(true);
  });

  it("uses artist placeholder image when artist has no images", () => {
    mockArtistHook.mockReturnValue({
      data: { artistById: makeArtist({ images: [] }) },
      isLoading: false,
    });
    mockInfiniteAlbumsHook.mockReturnValue({
      data: makeAlbumsData([]),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(
      <MemoryRouter>
        <ArtistAlbumsPage />
      </MemoryRouter>
    );

    const fallback = screen.getByRole("img", { name: "Radiohead" });
    expect(fallback).toHaveAttribute("src", "/assets/placeholder-avatar.png");
  });
});
