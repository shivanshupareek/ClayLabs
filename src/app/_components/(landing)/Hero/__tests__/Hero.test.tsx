import { render, screen } from "@testing-library/react";
import Hero from "../Hero";

// next/image renders an <img> in tests with next/jest transformer
// next/link is not used here so no mock needed

describe("Hero", () => {
  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Hero />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders a section with an accessible name", () => {
    render(<Hero />);
    expect(
      screen.getByRole("region", { name: /come shape something with your hands/i })
    ).toBeInTheDocument();
  });

  it("renders a single h1 with the correct title", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Come shape something with your hands");
  });

  it("renders the subtext paragraph", () => {
    render(<Hero />);
    expect(screen.getByText(/slow down, get a little messy/i)).toBeInTheDocument();
  });

  it("renders the hero image with a descriptive alt text", () => {
    render(<Hero />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt");
    expect(img.getAttribute("alt")).not.toBe("");
  });

  it("renders the email form", () => {
    render(<Hero />);
    expect(screen.getByRole("textbox", { name: /email address/i })).toBeInTheDocument();
  });
});
