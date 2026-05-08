"use server";

import { z } from "zod";

const AU_PHONE_RE = /^(\+?61|0)(4\d{8}|[2-9]\d{8})$/;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => AU_PHONE_RE.test(val.replace(/[\s.\-()]/g, "")),
      "Enter a valid Australian phone number"
    ),
  firingType: z.string().min(1, "Please select a firing type"),
  date: z.string().min(1, "Please select a date"),
  slot: z.string().min(1, "Please select a time slot"),
  comments: z.string().optional(),
});

export type SubmitKilnBookingResult = { success: true } | { error: string };

export async function submitKilnBooking(
  formData: FormData
): Promise<SubmitKilnBookingResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    firingType: formData.get("firingType"),
    date: formData.get("date"),
    slot: formData.get("slot"),
    comments: formData.get("comments") || undefined,
  };

  const result = schema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid submission" };
  }

  // TODO: wire up Resend email transport here.
  // Recipient: info@claylabs.com.au
  console.log("[submitKilnBooking] New kiln booking:", result.data);

  return { success: true };
}
