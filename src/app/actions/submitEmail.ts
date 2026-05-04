"use server";

import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type SubmitEmailResult =
  | { success: true }
  | { error: string };

export async function submitEmail(
  formData: FormData
): Promise<SubmitEmailResult> {
  const raw = { email: formData.get("email") };
  const result = schema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid email" };
  }

  const { email } = result.data;

  // TODO: wire up email transport (Resend / Nodemailer) here.
  // For now, log the submission and return success.
  console.log(`[submitEmail] New signup: ${email}`);

  return { success: true };
}
