import { describe, test, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TEST_ENDPOINT = "http://test-api/graphql";
process.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL = TEST_ENDPOINT;

import App from "./App";

function renderWithRQ(ui: React.ReactElement) {
  const qc = new QueryClient();
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("App", () => {
  test("renders hello from GraphQL", async () => {
    renderWithRQ(<App />);

    // shows loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Message:/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Hello from mock/i)).toBeInTheDocument();
  });
});
