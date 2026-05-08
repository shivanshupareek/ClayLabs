import { render, screen } from "@testing-library/react";
import KilnFiringSection from "../KilnFiringSection";

describe("KilnFiringSection", () => {
  it("renders without errors", () => {
    const { container } = render(<KilnFiringSection />);
    expect(container).toBeTruthy();
  });

  it("renders the section heading", () => {
    render(<KilnFiringSection />);
    expect(screen.getByRole("heading", { name: /kiln firing services/i })).toBeInTheDocument();
  });

  it("renders both firing option bullets", () => {
    render(<KilnFiringSection />);
    expect(screen.getByText(/bisque firing \(cone 06\)/i)).toBeInTheDocument();
    expect(screen.getByText(/glaze firing \(cone 6\)/i)).toBeInTheDocument();
  });

  it("renders the CTA link with correct href", () => {
    render(<KilnFiringSection />);
    const cta = screen.getByRole("link", { name: /book kiln firing/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/?tab=kiln#book");
  });

  it("renders the kiln image", () => {
    const { container } = render(<KilnFiringSection />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it("renders the pricing note", () => {
    render(<KilnFiringSection />);
    expect(screen.getByText(/pricing is based on piece size/i)).toBeInTheDocument();
  });

  it("has no console errors during render", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<KilnFiringSection />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
