import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchX, ServerCrash } from "lucide-react";
import { ErrorComponent } from "./ErrorComponent";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ErrorComponent", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders title, message, and button", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("errors.404.title")).toBeInTheDocument();
    expect(screen.getByText("errors.404.message")).toBeInTheDocument();
    expect(screen.getByText("errors.backHome")).toBeInTheDocument();
  });

  it("renders icon with default brand color when iconColor is not provided", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    const icon = document.querySelector("svg");
    expect(icon).toHaveClass("text-[var(--color-brand)]");
  });

  it("renders icon with custom color when iconColor is provided", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={ServerCrash}
          iconColor="text-red-500"
          titleKey="errors.500.title"
          messageKey="errors.500.message"
        />
      </MemoryRouter>
    );

    const icon = document.querySelector("svg");
    expect(icon).toHaveClass("text-red-500");
  });

  it("has a clickable button (navigation handled via hard redirect)", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "errors.backHome" });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("renders with correct panel and inner container classes", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    const title = screen.getByText("errors.404.title");
    const inner = title.closest("div") as HTMLElement; 
    const panel = inner.parentElement as HTMLElement;  
    
    expect(panel).toHaveClass(
      "bg-[var(--color-surface)]",
      "rounded-2xl",
      "shadow-lg"
    );
    
    expect(inner).toHaveClass("flex", "flex-col", "items-center", "gap-6");
    expect(inner).toHaveClass("p-6", "sm:p-8", "lg:p-10");
  });

  it("renders title with current responsive typography classes", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    const title = screen.getByText("errors.404.title");
    expect(title).toHaveClass(
      "font-rubik",
      "font-extrabold",
      "text-2xl",
      "sm:text-3xl",
      "lg:text-4xl"
    );
  });

  it("renders message with current typography classes", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    const message = screen.getByText("errors.404.message");
    expect(message).toHaveClass("font-dmsans");
    
    expect(message).toHaveClass("text-primary");
  });

  it("renders button with expected base styling classes", () => {
    render(
      <MemoryRouter>
        <ErrorComponent
          icon={SearchX}
          titleKey="errors.404.title"
          messageKey="errors.404.message"
        />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "errors.backHome" });
    
    expect(button).toHaveClass(
      "rounded-full",
      "transition",
      "px-10",
      "py-[0.6875rem]",
      "text-[1rem]",
      "leading-[1.25rem]",
      "font-bold",
      "cursor-pointer",
      "tracking-[0.00875rem]",
      "bg-brand",
      "text-inverse",
      "hover:brightness-110"
    );
  });
});
