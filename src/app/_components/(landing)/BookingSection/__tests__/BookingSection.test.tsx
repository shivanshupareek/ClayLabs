import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingSection from "../BookingSection";

// ── Next.js mocks ────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({ get: () => null })),
}));

// ── Server action mocks ──────────────────────────────────────────────────────

jest.mock("@/app/actions/submitBooking", () => ({
  submitBooking: jest.fn(),
}));
jest.mock("@/app/actions/submitPrivateBooking", () => ({
  submitPrivateBooking: jest.fn(),
}));
jest.mock("@/app/actions/submitKidsBooking", () => ({
  submitKidsBooking: jest.fn(),
}));
jest.mock("@/app/actions/submitKilnBooking", () => ({
  submitKilnBooking: jest.fn(),
}));

import { submitBooking } from "@/app/actions/submitBooking";
import { submitKidsBooking } from "@/app/actions/submitKidsBooking";
import { submitKilnBooking } from "@/app/actions/submitKilnBooking";

const mockSubmitBooking = submitBooking as jest.MockedFunction<typeof submitBooking>;
const mockSubmitKidsBooking = submitKidsBooking as jest.MockedFunction<typeof submitKidsBooking>;
const mockSubmitKilnBooking = submitKilnBooking as jest.MockedFunction<typeof submitKilnBooking>;

jest.mock("lucide-react", () => ({
  ArrowRight: () => null,
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fillPotteryFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
  await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
  await user.type(screen.getByLabelText(/phone number/i), "0412345678");
  await user.selectOptions(screen.getByLabelText(/day of the week/i), "Monday");
  await user.selectOptions(screen.getByLabelText(/preferred time slot/i), "10:00am – 12:00pm");
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("BookingSection", () => {
  beforeEach(() => {
    mockSubmitBooking.mockResolvedValue({ success: true });
    mockSubmitKidsBooking.mockResolvedValue({ success: true });
    mockSubmitKilnBooking.mockResolvedValue({ success: true });
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

  it("section has accessible label via aria-labelledby", () => {
    render(<BookingSection />);
    expect(screen.getByRole("region", { name: /book your session/i })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Tab strip
  // ---------------------------------------------------------------------------

  it("renders all 4 tab buttons", () => {
    render(<BookingSection />);
    expect(screen.getByRole("tab", { name: /pottery classes/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /private classes/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /kids classes/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /kiln firing services/i })).toBeInTheDocument();
  });

  it("pottery tab is selected by default", () => {
    render(<BookingSection />);
    expect(screen.getByRole("tab", { name: /pottery classes/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /private classes/i })).toHaveAttribute("aria-selected", "false");
  });

  it("tab strip has correct role and label", () => {
    render(<BookingSection />);
    expect(screen.getByRole("tablist", { name: /booking type/i })).toBeInTheDocument();
  });

  it("tab panel is rendered with correct aria attributes", () => {
    render(<BookingSection />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", "booking-tab-pottery");
  });

  // ---------------------------------------------------------------------------
  // Pottery tab (default) — form fields
  // ---------------------------------------------------------------------------

  it("renders name, email, and phone inputs on pottery tab", () => {
    render(<BookingSection />);
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("renders Day and Time selects on pottery tab", () => {
    render(<BookingSection />);
    expect(screen.getByLabelText(/day of the week/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred time slot/i)).toBeInTheDocument();
  });

  it("renders all 7 day options", () => {
    render(<BookingSection />);
    const daySelect = screen.getByLabelText(/day of the week/i);
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach((d) => {
      expect(daySelect).toContainElement(screen.getByRole("option", { name: d }));
    });
  });

  it("renders the join now! submit button", () => {
    render(<BookingSection />);
    expect(screen.getByRole("button", { name: /join now!/i })).toBeInTheDocument();
  });

  it("renders the pottery pricing line", () => {
    render(<BookingSection />);
    expect(screen.getByText(/AUD \$300 per person/i)).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Tab switching
  // ---------------------------------------------------------------------------

  it("switches to Kids tab and shows organiser name field", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("tab", { name: /kids classes/i }));
    expect(screen.getByLabelText(/organiser name/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /kids classes/i })).toHaveAttribute("aria-selected", "true");
  });

  it("switches to Kiln tab and shows firing type select", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("tab", { name: /kiln firing services/i }));
    expect(screen.getByRole("option", { name: /bisque firing/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /glaze firing/i })).toBeInTheDocument();
  });

  it("switches to Private tab and shows session type select", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("tab", { name: /private classes/i }));
    expect(screen.getByRole("option", { name: /birthday party/i })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Kids — under-6 toggle
  // ---------------------------------------------------------------------------

  it("guardian name field is hidden when toggle is off", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("tab", { name: /kids classes/i }));
    expect(screen.queryByLabelText(/guardian name/i)).not.toBeInTheDocument();
  });

  it("guardian name field appears when under-6 toggle is checked", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("tab", { name: /kids classes/i }));
    await user.click(screen.getByRole("checkbox", { name: /children under 6/i }));
    expect(screen.getByLabelText(/guardian name/i)).toBeInTheDocument();
  });

  it("guardian name field disappears when toggle is unchecked again", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("tab", { name: /kids classes/i }));
    const checkbox = screen.getByRole("checkbox", { name: /children under 6/i });
    await user.click(checkbox);
    await user.click(checkbox);
    expect(screen.queryByLabelText(/guardian name/i)).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Pottery form — validation
  // ---------------------------------------------------------------------------

  it("shows error when name is empty on pottery submit", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error for invalid email on pottery submit", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  it("shows error for invalid AU phone on pottery submit", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.type(screen.getByLabelText(/^name$/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "12345678");
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    expect(await screen.findByText(/valid australian phone number/i)).toBeInTheDocument();
    expect(mockSubmitBooking).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Pottery form — happy path
  // ---------------------------------------------------------------------------

  it("calls submitBooking with FormData on valid pottery submission", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await fillPotteryFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    await waitFor(() => expect(mockSubmitBooking).toHaveBeenCalledTimes(1));
    const formData = mockSubmitBooking.mock.calls[0][0] as FormData;
    expect(formData.get("name")).toBe("Jane Smith");
    expect(formData.get("email")).toBe("jane@example.com");
    expect(formData.get("day")).toBe("Monday");
  });

  it("shows 'see you soon!' on pottery success", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await fillPotteryFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/see you soon!/i);
  });

  it("success message has aria-live='polite'", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await fillPotteryFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    const status = await screen.findByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("shows server error when submitBooking returns an error", async () => {
    mockSubmitBooking.mockResolvedValueOnce({ error: "Something went wrong" });
    const user = userEvent.setup();
    render(<BookingSection />);
    await fillPotteryFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole("button", { name: /join now!/i })).toBeInTheDocument();
  });

  it("disables the submit button while loading", async () => {
    let resolve!: (v: { success: true }) => void;
    mockSubmitBooking.mockImplementationOnce(
      () => new Promise((r) => { resolve = r; })
    );
    const user = userEvent.setup();
    render(<BookingSection />);
    await fillPotteryFields(user);
    await user.click(screen.getByRole("button", { name: /join now!/i }));
    expect(await screen.findByRole("button", { name: /\.\.\./i })).toBeDisabled();
    resolve({ success: true });
  });

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  it("first tab button is keyboard reachable", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /pottery classes/i }));
  });

  it("all tab buttons are keyboard reachable", async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    // Tab through all 4 tab buttons
    for (let i = 0; i < 4; i++) await user.tab();
    // 5th tab lands on the first form field (name input on pottery tab)
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/^name$/i));
  });
});
