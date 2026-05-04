import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionsCarousel from "../SessionsCarousel";

// ---------------------------------------------------------------------------
// Framer Motion — render children without animation overhead
// ---------------------------------------------------------------------------
jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      // Strip animation props so they don't land on a real DOM element
      variants: _v,
      initial: _i,
      animate: _a,
      exit: _e,
      custom: _c,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
      variants?: unknown;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      custom?: unknown;
    }) => <div {...rest}>{children}</div>,
  },
}));

// ---------------------------------------------------------------------------
// window.matchMedia — default to desktop (3 items per view)
// ---------------------------------------------------------------------------
function mockMatchMedia(minWidth1024 = true, minWidth480 = true) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn((query: string) => ({
      matches:
        (query.includes("1024px") && minWidth1024) ||
        (query.includes("480px") && minWidth480 && !minWidth1024),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

beforeEach(() => {
  mockMatchMedia();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe("SessionsCarousel", () => {
  // --- Render ---

  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<SessionsCarousel />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders the section heading", () => {
    render(<SessionsCarousel />);
    expect(
      screen.getByRole("heading", { level: 2, name: /our pottery sessions/i })
    ).toBeInTheDocument();
  });

  it("renders 3 cards on initial load (desktop)", () => {
    render(<SessionsCarousel />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });

  it("each card image has a non-empty alt text", () => {
    render(<SessionsCarousel />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });

  it("renders card titles and subtext for the first group", () => {
    render(<SessionsCarousel />);
    expect(screen.getByText("6-weeks journey")).toBeInTheDocument();
    expect(screen.getByText("Made by you, kept by you")).toBeInTheDocument();
    expect(screen.getByText("Time that's truly yours")).toBeInTheDocument();
  });

  // --- Controls ---

  it("renders Previous group and Next group buttons", () => {
    render(<SessionsCarousel />);
    expect(screen.getByRole("button", { name: /previous group/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next group/i })).toBeInTheDocument();
  });

  // --- Navigation ---

  it("advances to group 2 when Next group is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SessionsCarousel />);

    await user.click(screen.getByRole("button", { name: /next group/i }));

    expect(screen.getByText("Ready for you")).toBeInTheDocument();
    expect(screen.getByText("Guidance when needed")).toBeInTheDocument();
    expect(screen.getByText("Unhurried learning")).toBeInTheDocument();
  });

  it("wraps to the last group when Previous group is clicked from group 0", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SessionsCarousel />);

    await user.click(screen.getByRole("button", { name: /previous group/i }));

    // With 6 cards and 3 per view: last group = group 1 (cards 4-6)
    expect(screen.getByText("Ready for you")).toBeInTheDocument();
  });

  it("returns to group 0 after clicking Next from the last group", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SessionsCarousel />);

    await user.click(screen.getByRole("button", { name: /next group/i })); // → group 1
    await user.click(screen.getByRole("button", { name: /next group/i })); // → group 0 (wraps)

    expect(screen.getByText("6-weeks journey")).toBeInTheDocument();
  });

  // --- Accessibility ---

  it("Next group button is keyboard reachable", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SessionsCarousel />);

    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /next group/i })
    );
  });
});
