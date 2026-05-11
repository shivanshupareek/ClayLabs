"use server";

import { z } from "zod";

const AU_PHONE_RE = /^(\+?61|0)(4\d{8}|[2-9]\d{8})$/;

const schema = z.object({
  organiserName: z.string().min(1, "Organiser name is required"),
  sessionType: z.string().min(1, "Please select a session type"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => AU_PHONE_RE.test(val.replace(/[\s.\-()]/g, "")),
      "Enter a valid Australian phone number"
    ),
  numberOfPeople: z
    .number({ error: "Number of people is required" })
    .min(1, "At least 1 person required")
    .max(9, "Maximum 9 people per private session"),
  date: z.string().min(1, "Please select a date"),
  slot: z.string().min(1, "Please select a time slot"),
  comments: z.string().optional(),
});

export type SubmitPrivateBookingResult = { success: true } | { error: string };

export async function submitPrivateBooking(
  formData: FormData
): Promise<SubmitPrivateBookingResult> {
  const raw = {
    organiserName: formData.get("organiserName"),
    sessionType: formData.get("sessionType"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    numberOfPeople: Number(formData.get("numberOfPeople")),
    date: formData.get("date"),
    slot: formData.get("slot"),
    comments: formData.get("comments") || undefined,
  };

  const result = schema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid submission" };
  }

  // TODO: wire up Resend email transport here.
  // Recipient: info@clayora.com
  console.log("[submitPrivateBooking] New private booking:", result.data);

  return { success: true };
}
