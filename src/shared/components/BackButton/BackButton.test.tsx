import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BackButton } from "./BackButton";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("BackButton", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders children text", () => {
    render(
      <MemoryRouter>
        <BackButton>Go Back</BackButton>
      </MemoryRouter>
    );

    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("calls navigate(-1) when clicked", async () => {
    render(
      <MemoryRouter>
        <BackButton>Go Back</BackButton>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button"));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("supports keyboard activation (Enter + Space)", async () => {
    render(
      <MemoryRouter>
        <BackButton>Keyboard Back</BackButton>
      </MemoryRouter>
    );

    const btn = screen.getByRole("button");
    btn.focus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    expect(mockedNavigate).toHaveBeenCalledTimes(2);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("applies additional className", () => {
    render(
      <MemoryRouter>
        <BackButton className="extra-class">With Class</BackButton>
      </MemoryRouter>
    );

    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });

  it("renders the icon and text", () => {
    render(
      <MemoryRouter>
        <BackButton>Icon Check</BackButton>
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    
    const svg = button.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.tagName.toLowerCase()).toBe("svg");

    expect(screen.getByText("Icon Check")).toBeInTheDocument();
  });

  it("works without children (just the icon)", () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeTruthy();
  });
});
