import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailForm from "../EmailForm";

// Mock the Server Action — tests control what it returns
jest.mock("@/app/actions/submitEmail", () => ({
  submitEmail: jest.fn(),
}));

import { submitEmail } from "@/app/actions/submitEmail";
const mockSubmitEmail = submitEmail as jest.MockedFunction<typeof submitEmail>;

describe("EmailForm", () => {
  beforeEach(() => {
    mockSubmitEmail.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Render ---

  it("renders without errors", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<EmailForm />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders email input with accessible label", () => {
    render(<EmailForm />);
    expect(screen.getByRole("textbox", { name: /email address/i })).toBeInTheDocument();
  });

  it("renders join now! submit button", () => {
    render(<EmailForm />);
    expect(screen.getByRole("button", { name: /join now!/i })).toBeInTheDocument();
  });

  // --- Validation ---

  it("shows error when form is submitted empty", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);

    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(mockSubmitEmail).not.toHaveBeenCalled();
  });

  it("shows error for an invalid email format", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);

    await user.type(screen.getByRole("textbox", { name: /email address/i }), "notanemail");
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i);
    expect(mockSubmitEmail).not.toHaveBeenCalled();
  });

  // --- Happy path ---

  it("calls Server Action with FormData when a valid email is submitted", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "hello@claylabs.com.au"
    );
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    await waitFor(() => expect(mockSubmitEmail).toHaveBeenCalledTimes(1));
    const formData = mockSubmitEmail.mock.calls[0][0] as FormData;
    expect(formData.get("email")).toBe("hello@claylabs.com.au");
  });

  it("replaces the form with 'see you soon!' on success", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "hello@claylabs.com.au"
    );
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/see you soon!/i);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("success message uses role='status' for screen reader announcement", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "hello@claylabs.com.au"
    );
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  // --- Error path ---

  it("shows server error message when Server Action returns an error", async () => {
    mockSubmitEmail.mockResolvedValueOnce({ error: "Something went wrong" });
    const user = userEvent.setup();
    render(<EmailForm />);

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "hello@claylabs.com.au"
    );
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
    // Form stays visible so user can retry
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // --- Loading state ---

  it("disables the button while loading", async () => {
    // Keep the promise pending so we can inspect the loading state
    let resolve!: (v: { success: true }) => void;
    mockSubmitEmail.mockImplementationOnce(
      () => new Promise((r) => { resolve = r; })
    );

    const user = userEvent.setup();
    render(<EmailForm />);

    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "hello@claylabs.com.au"
    );
    await user.click(screen.getByRole("button", { name: /join now!/i }));

    // Button should be disabled while pending
    expect(await screen.findByRole("button", { name: /\.\.\./i })).toBeDisabled();

    // Clean up — resolve the promise
    resolve({ success: true });
  });

  // --- Accessibility ---

  it("input is keyboard reachable", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: /email address/i })
    );
  });

  it("submit button is keyboard reachable after input", async () => {
    const user = userEvent.setup();
    render(<EmailForm />);
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /join now!/i })
    );
  });
});
