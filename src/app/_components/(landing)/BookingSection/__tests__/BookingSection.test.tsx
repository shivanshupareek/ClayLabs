import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingSection from "../BookingSection";

jest.mock("@/app/actions/submitBooking", () => ({
  submitBooking: jest.fn(),
}));

import { submitBooking } from "@/app/actions/submitBooking";
const mockSubmitBooking = submitBooking as jest.MockedFunction<typeof submitBooking>;

// Lucide icons use SVG — mock to avoid jsdom SVG issues
jest.mock("lucide-react", () => ({
  ArrowRight: () => null,
}));

describe("BookingSection", () => {
  beforeEach(() => {
    mockSubmitBooking.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<BookingSection />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders the section heading", () => {
    render(<BookingSection />);
    expect(screen.getByRole("heading", { name: /book your session/i })).toBeInTheDocument();
  });

  it("renders name, email, and phone inputs", () => {
    render(<BookingSection />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("renders Day and Time select dropdowns", () => {
    render(<BookingSection />);
    expect(screen.getByLabelText(/day of the week/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred time slot/i)).toBeInTheDocument();
  });

  it("renders all 7 day options", () => {
    render(<BookingSection />);
    const daySelect = screen.getByLabelText(/day of the week/i);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach((d) => {
      expect(daySelect).toContainElement(screen.getByRole("option", { name: d }));
    });
  });

  it("renders both time slot options", () => {
    render(<BookingSection />);
    expect(screen.getByRole("option", { name: "10:00am – 12:00pm" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "06:00pm – 08:00pm" })).toBeInTheDocument();
  });

  it("renders the additional comments input", () => {
    render(<BookingSection />);
    expect(screen.getByLabelText(/additional comments/i)).toBeInTheDocument();
  });

  it("renders the join now! submit button", () => {
    render(<BookingSection />);
    expect(screen.getByRole("button", { name: /join now!/i })).toBeInTheDocument();
  });

  it("renders the pricing line", () => {
    render(<BookingSection />);
    expect(screen.getByText(/AUD \$300 per person/i)).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  it("shows error when name is empty on submit", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error when email is empty on submit", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error when phone is empty on submit", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByText(/phone number is required/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error for invalid Australian phone number", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "12345678");
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByText(/valid australian phone number/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error when day is not selected", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "0412345678");
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByText(/please select a day/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Happy path — helper to fill all required fields
  // ---------------------------------------------------------------------------

  async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "0412345678");
    await user.selectOptions(screen.getByLabelText(/day of the week/i), "Monday");
    await user.selectOptions(screen.getByLabelText(/preferred time slot/i), "10:00am – 12:00pm");
  }

  it("calls submitBooking with FormData on valid submission", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    await waitFor(() => expect(mockSubmitBooking).toHaveBeenCalledTimes(1));

    const formData = mockSubmitBooking.mock.calls[0][0] as FormData;
    expect(formData.get("name")).toBe("Jane Smith");
    expect(formData.get("email")).toBe("jane@example.com");
    expect(formData.get("phone")).toBe("0412345678");
    expect(formData.get("day")).toBe("Monday");
    expect(formData.get("time")).toBe("10:00am – 12:00pm");
  });

  it("replaces button with 'see you soon!' on success", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/see you soon!/i);
    expect(screen.queryByRole("button", { name: /join now!/i })).not.toBeInTheDocument();
  });

  it("success message has aria-live='polite' for screen readers", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("resets form fields to empty on success", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);

    const nameInput = screen.getByLabelText(/^name$/i);
    const emailInput = screen.getByLabelText(/^email$/i);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    await screen.findByRole("status");

    expect((nameInput as HTMLInputElement).value).toBe("");
    expect((emailInput as HTMLInputElement).value).toBe("");
  });

  // ---------------------------------------------------------------------------
  // Error path
  // ---------------------------------------------------------------------------

  it("shows server error when submitBooking returns an error", async () => {
    mockSubmitBooking.mockResolvedValueOnce({ error: "Something went wrong" });
    const user = userEvent.setup();
    render(<BookingSection />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole("button", { name: /join now!/i })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  it("disables the submit button while loading", async () => {
    let resolve!: (v: { success: true }) => void;
    mockSubmitBooking.mockImplementationOnce(
      () => new Promise((r) => { resolve = r; })
    );

    const user = userEvent.setup();
    render(<BookingSection />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("button", { name: /\.\.\./i })).toBeDisabled();

    resolve({ success: true });
  });

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  it("name input is keyboard reachable", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/^name$/i));
  });

  it("email input is keyboard reachable after name", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/^email$/i));
  });

  it("section has accessible label via aria-labelledby", () => {
    render(<BookingSection />);
    const section = screen.getByRole("region", { name: /book your session/i });
    expect(section).toBeInTheDocument();
  });
});
