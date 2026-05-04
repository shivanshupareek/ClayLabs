import { render, screen } from "@testing-library/react";
import SessionsSection from "../SessionsSection";

// Carousel is a client component with framer-motion — mocked in SessionsCarousel tests
// Here we just verify the server shell and that the carousel mounts

jest.mock("../SessionsCarousel", () => ({
  __esModule: true,
  default: function MockSessionsCarousel() {
    return (
      <>
        <h2 id="sessions-heading">Our pottery sessions</h2>
        <div data-testid="sessions-carousel" />
      </>
    );
  },
}));

describe("SessionsSection", () => {
  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<SessionsSection />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders a section with the correct accessible name", () => {
    render(<SessionsSection />);
    expect(
      screen.getByRole("region", { name: /our pottery sessions/i })
    ).toBeInTheDocument();
  });

  it("renders the SessionsCarousel", () => {
    render(<SessionsSection />);
    expect(screen.getByTestId("sessions-carousel")).toBeInTheDocument();
  });
});
