import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../not-found";

// ---------------------------------------------------------------------------
// next/navigation — mock useRouter
// ---------------------------------------------------------------------------
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ---------------------------------------------------------------------------
// next/image and next/link — auto-handled by next/jest transformer
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.useFakeTimers();
  mockPush.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("NotFound", () => {
  // --- Render ---

  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<NotFound />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders the 404 code", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the h1 heading", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { level: 1, name: /gone walkabout/i })
    ).toBeInTheDocument();
  });

  it("renders the initial countdown value of 30", () => {
    render(<NotFound />);
    expect(screen.getByText(/30 seconds/i)).toBeInTheDocument();
  });

  it("renders the Home CTA link pointing to /", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /^home$/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders a main landmark with id main-content", () => {
    render(<NotFound />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute("id", "main-content");
  });

  // --- Countdown ---

  it("decrements the countdown by 1 after 1 second", () => {
    render(<NotFound />);
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByText(/29 seconds/i)).toBeInTheDocument();
  });

  it("shows singular 'second' when countdown reaches 1", () => {
    render(<NotFound />);
    // Each tick must be its own act() — cascading setTimeouts re-register per re-render
    for (let i = 0; i < 29; i++) {
      act(() => { jest.advanceTimersByTime(1000); });
    }
    expect(screen.getByText(/1 second/i)).toBeInTheDocument();
  });

  // --- Redirect ---

  it("calls router.push('/') after 30 seconds", () => {
    render(<NotFound />);
    for (let i = 0; i < 30; i++) {
      act(() => { jest.advanceTimersByTime(1000); });
    }
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  // --- Accessibility ---

  it("Home link is keyboard reachable", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<NotFound />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("link", { name: /^home$/i }));
  });

  it("countdown region has aria-live polite", () => {
    render(<NotFound />);
    const liveRegion = screen.getByText(/30 seconds/i).closest("[aria-live]");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
  });
});
