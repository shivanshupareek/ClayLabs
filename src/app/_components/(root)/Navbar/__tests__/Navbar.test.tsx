import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../Navbar";

// next/link renders an <a> in tests — mock it minimally
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    className,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    "aria-label"?: string;
  }) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  };
});

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  // --- Render ---

  it("renders without errors and without console errors", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<Navbar />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders a <header> landmark", () => {
    render(<Navbar />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a named navigation landmark", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeInTheDocument();
  });

  // --- Logo ---

  it("renders Clayora logo text", () => {
    render(<Navbar />);
    expect(screen.getByText("Clayora")).toBeInTheDocument();
  });

  it("logo links to the homepage", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /clayora/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  // --- CTA ---

  it("renders the get started CTA linking to the booking section", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toHaveAttribute("href", "#book");
  });

  // --- Theme toggle: default light (no data-theme set) ---

  it("shows 'switch to dark mode' label when no theme is stored", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  // --- Theme toggle: reads data-theme from DOM on init ---

  it("shows 'switch to light mode' when data-theme=dark is already on <html>", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  // --- Theme toggle: interaction ---

  it("clicking toggle switches to dark and sets data-theme + localStorage", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("cl-theme")).toBe("dark");
  });

  it("clicking toggle twice returns to light", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("cl-theme")).toBe("light");
  });

  it("starts in dark mode when data-theme=dark is pre-set (simulates init script)", async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute("data-theme", "dark");
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("cl-theme")).toBe("light");
  });

  // --- Accessibility / keyboard ---

  it("logo is the first keyboard-reachable element", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: /clayora/i })
    );
  });

  it("get started CTA is reachable by keyboard after logo", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: /get started/i })
    );
  });

  it("theme toggle is reachable by keyboard after CTA", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.tab();
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
  });

  it("theme toggle is operable with Enter key", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(localStorage.getItem("cl-theme")).toBe("dark");
  });
});
