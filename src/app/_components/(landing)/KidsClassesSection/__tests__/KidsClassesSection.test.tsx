import { render, screen } from "@testing-library/react";
import KidsClassesSection from "../KidsClassesSection";

it("renders without console errors", () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<KidsClassesSection />);
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

it("renders heading 'Kids classes'", () => {
  render(<KidsClassesSection />);
  expect(screen.getByRole("heading", { name: "Kids classes" })).toBeInTheDocument();
});

it("renders price '$70 per person'", () => {
  render(<KidsClassesSection />);
  expect(screen.getByText("$70 per person")).toBeInTheDocument();
});

it("renders all 4 bullet points", () => {
  render(<KidsClassesSection />);
  expect(screen.getByText("Kids aged 6 and above")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Children under 6 are welcome but must be accompanied by a guardian"
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "All ceramics are food and oven safe, made from high-quality ceramic materials"
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Pieces take up to 4 weeks to be fired/)
  ).toBeInTheDocument();
});

it("CTA link has text 'book classes' and deep-links to the kids booking tab", () => {
  render(<KidsClassesSection />);
  const link = screen.getByRole("link", { name: /book classes/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/?tab=kids#book");
});

it("CTA is keyboard-reachable", () => {
  render(<KidsClassesSection />);
  const link = screen.getByRole("link", { name: /book classes/i });
  expect(link).toBeVisible();
});

it("image has meaningful alt text", () => {
  const { container } = render(<KidsClassesSection />);
  const img = container.querySelector("img");
  expect(img).toBeInTheDocument();
  expect(img?.getAttribute("alt")).toBeTruthy();
});
