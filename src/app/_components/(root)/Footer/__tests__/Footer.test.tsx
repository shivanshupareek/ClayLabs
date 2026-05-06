import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "../Footer";

// next/image renders a regular <img> via the next/jest transformer
// next/link renders a regular <a> in tests

describe("Footer", () => {
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Footer />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders the banner image with descriptive alt text", () => {
    render(<Footer />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("alt")).not.toBe("");
  });

  it("renders the ClayLabs logo link", () => {
    render(<Footer />);
    const logo = screen.getByRole("link", { name: /claylabs — go to homepage/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders the get started CTA", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument();
  });

  it("renders the email contact link", () => {
    render(<Footer />);
    const emailLink = screen.getByRole("link", { name: /hello@claylabs\.com\.au/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:hello@claylabs.com.au");
  });

  it("renders the phone contact link", () => {
    render(<Footer />);
    const phoneLink = screen.getByRole("link", { name: /\+61 123 456 789/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute("href", "tel:+61123456789");
  });

  it("renders the terms link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /^terms$/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/terms");
  });

  it("renders the privacy policy link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /privacy policy/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/privacy");
  });

  it("renders the sitemap link", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /sitemap/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/sitemap");
  });

  it("renders the copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(/©claylabs\. all rights reserved/i)).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  it("renders a contentinfo landmark (footer element)", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("legal nav has an accessible label", () => {
    render(<Footer />);
    expect(screen.getByRole("navigation", { name: /legal navigation/i })).toBeInTheDocument();
  });

  it("logo link is keyboard reachable", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: /claylabs — go to homepage/i })
    );
  });
});
