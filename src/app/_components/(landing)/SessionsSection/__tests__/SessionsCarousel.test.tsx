import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionsCarousel from "../SessionsCarousel";

// ---------------------------------------------------------------------------
// Framer Motion — render children without animation overhead
// ---------------------------------------------------------------------------
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      animate: _a,
      transition: _t,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
      animate?: unknown;
      transition?: unknown;
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

  it("renders 3 accessible card images on initial load (desktop)", () => {
    render(<SessionsCarousel />);
    // Only the active group's images are accessible — inactive groups have aria-hidden
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });

  it("each active card image has a non-empty alt text", () => {
    render(<SessionsCarousel />);
    screen.getAllByRole("img").forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });

  it("renders card titles for the first group as accessible headings", () => {
    render(<SessionsCarousel />);
    // getByRole filters out aria-hidden — only active group headings are found
    expect(screen.getByRole("heading", { level: 3, name: /6-weeks journey/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /made by you, kept by you/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /time that's truly yours/i })).toBeInTheDocument();
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

    // Active group changed — group 2 headings are now accessible
    expect(screen.getByRole("heading", { level: 3, name: /ready for you/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /guidance when needed/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /unhurried learning/i })).toBeInTheDocument();
  });

  it("wraps to the last group when Previous group is clicked from group 0", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SessionsCarousel />);

    await user.click(screen.getByRole("button", { name: /previous group/i }));

    // With 6 cards and 3 per view: last group = group 1 (cards 4-6)
    expect(screen.getByRole("heading", { level: 3, name: /ready for you/i })).toBeInTheDocument();
  });

  it("returns to group 0 after clicking Next from the last group", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SessionsCarousel />);

    await user.click(screen.getByRole("button", { name: /next group/i })); // → group 1
    await user.click(screen.getByRole("button", { name: /next group/i })); // → group 0 (wraps)

    expect(screen.getByRole("heading", { level: 3, name: /6-weeks journey/i })).toBeInTheDocument();
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
