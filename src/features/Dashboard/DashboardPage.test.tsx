import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardPage } from "./";

describe("DashboardPage (minimal)", () => {
  it("renders the dashboard container", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });
});
