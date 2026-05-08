import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingCtaLink from "../BookingCtaLink";

jest.mock("lucide-react", () => ({ ArrowRight: () => null }));

jest.mock("../../../(root)/SmoothScroll/SmoothScroll", () => ({
  getLenis: jest.fn(() => null),
}));

it("renders without console errors", () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(
    <BookingCtaLink
      tab="kiln"
      label="book kiln firing"
      className="cta"
      labelClassName="ctaLabel"
      arrowClassName="ctaArrow"
    />
  );
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

it("renders the label text", () => {
  render(
    <BookingCtaLink
      tab="kids"
      label="book classes"
      className="cta"
      labelClassName="ctaLabel"
      arrowClassName="ctaArrow"
    />
  );
  expect(screen.getByText("book classes")).toBeInTheDocument();
});

it("renders a link with the correct href", () => {
  render(
    <BookingCtaLink
      tab="kiln"
      label="book kiln firing"
      className="cta"
      labelClassName="ctaLabel"
      arrowClassName="ctaArrow"
    />
  );
  const link = screen.getByRole("link", { name: /book kiln firing/i });
  expect(link).toHaveAttribute("href", "/?tab=kiln#book");
});

it("is keyboard reachable", () => {
  render(
    <BookingCtaLink
      tab="private"
      label="book private session"
      className="cta"
      labelClassName="ctaLabel"
      arrowClassName="ctaArrow"
    />
  );
  expect(screen.getByRole("link", { name: /book private session/i })).toBeVisible();
});

it("calls scrollIntoView on click when Lenis is absent", async () => {
  const user = userEvent.setup();
  const scrollIntoView = jest.fn();
  document.getElementById = jest.fn(() => ({ scrollIntoView } as unknown as HTMLElement));

  render(
    <BookingCtaLink
      tab="kids"
      label="book classes"
      className="cta"
      labelClassName="ctaLabel"
      arrowClassName="ctaArrow"
    />
  );

  await user.click(screen.getByRole("link", { name: /book classes/i }));
  // Wait for the 120ms setTimeout
  await new Promise((r) => setTimeout(r, 150));
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

  // Restore
  jest.restoreAllMocks();
});
