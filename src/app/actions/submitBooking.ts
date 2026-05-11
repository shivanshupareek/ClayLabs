"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().optional(),
  day: z.string().optional(),
  time: z.string().optional(),
  comments: z.string().optional(),
});

export type SubmitBookingResult = { success: true } | { error: string };

export async function submitBooking(
  formData: FormData
): Promise<SubmitBookingResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    day: formData.get("day") || undefined,
    time: formData.get("time") || undefined,
    comments: formData.get("comments") || undefined,
  };

  const result = schema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid submission" };
  }

  // TODO: wire up Resend email transport here.
  // Recipient: info@clayora.com
  console.log("[submitBooking] New booking:", result.data);

  return { success: true };
}
