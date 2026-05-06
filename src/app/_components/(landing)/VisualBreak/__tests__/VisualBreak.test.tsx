import { render } from "@testing-library/react";
import VisualBreak from "../VisualBreak";

it("renders without errors", () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<VisualBreak />);
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

it("renders an image with empty alt (decorative)", () => {
  const { container } = render(<VisualBreak />);
  const img = container.querySelector("img");
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute("alt", "");
});

it("wrapper has aria-hidden to exclude from accessibility tree", () => {
  const { container } = render(<VisualBreak />);
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
});
