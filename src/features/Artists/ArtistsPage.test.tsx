import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ArtistsPage } from "./ArtistsPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

vi.mock("./", () => ({
  useInfiniteMyTopArtists: vi.fn(),
}));

import { useInfiniteMyTopArtists } from "./";

type ArtistNode = {
  id: string;
  name: string;
  images: { url: string }[];
};
type Page = {
  myTopArtists: { edges: { node: ArtistNode }[] };
};
type QueryResult = {
  data?: { pages: Page[] };
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

const makeResult = (
  data?: { pages: Page[] },
  opts: Partial<Omit<QueryResult, "data">> = {}
): QueryResult => ({
  data,
  isLoading: false,
  isFetchingNextPage: false,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
  ...opts,
});

describe("ArtistsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner when loading and no data yet", () => {
    (useInfiniteMyTopArtists as unknown as Mock).mockReturnValue(
      makeResult(undefined, { isLoading: true })
    );

    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders a list of artists when data is loaded", () => {
    (useInfiniteMyTopArtists as unknown as Mock).mockReturnValue(
      makeResult({
        pages: [
          {
            myTopArtists: {
              edges: [
                {
                  node: {
                    id: "1",
                    name: "Radiohead",
                    images: [{ url: "https://example.com/radiohead.jpg" }],
                  },
                },
                {
                  node: {
                    id: "2",
                    name: "Muse",
                    images: [],
                  },
                },
              ],
            },
          },
        ],
      })
    );

    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Radiohead")).toBeInTheDocument();
    expect(screen.getByText("Muse")).toBeInTheDocument();
    
    const radioheadImg = screen.getByRole("img", { name: "Radiohead" });
    expect(radioheadImg).toHaveAttribute(
      "src",
      "https://example.com/radiohead.jpg"
    );
    
    const museImg = screen.getByRole("img", { name: "Muse" });
    expect(museImg).toHaveAttribute("src", "/assets/placeholder-avatar.png");
  });

  it("renders loading spinner at the bottom when fetching next page", () => {
    (useInfiniteMyTopArtists as unknown as Mock).mockReturnValue(
      makeResult(
        {
          pages: [
            {
              myTopArtists: {
                edges: [
                  {
                    node: {
                      id: "3",
                      name: "Coldplay",
                      images: [{ url: "https://example.com/coldplay.jpg" }],
                    },
                  },
                ],
              },
            },
          ],
        },
        { isFetchingNextPage: true }
      )
    );

    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Coldplay")).toBeInTheDocument();
  });
});
