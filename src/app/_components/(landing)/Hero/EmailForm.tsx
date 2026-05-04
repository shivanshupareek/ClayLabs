"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitEmail } from "@/app/actions/submitEmail";
import styles from "./Hero.module.scss";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "loading" | "success" | "error";

export default function EmailForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setServerError(null);

    const formData = new FormData();
    formData.set("email", values.email);

    const result = await submitEmail(formData);

    if ("error" in result) {
      setServerError(result.error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <p role="status" aria-live="polite" className={styles.successText}>
        see you soon!
      </p>
    );
  }

  const isLoading = status === "loading";
  const validationError = errors.email?.message;
  const displayError = validationError ?? serverError;

  return (
    <div className={styles.formWrapper}>
      <form
        className={styles.pill}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isLoading}
      >
        {/* Visually-hidden label satisfies WCAG 1.3.1 */}
        <label htmlFor="hero-email" className={styles.visuallyHidden}>
          Email address
        </label>

        <input
          id="hero-email"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          className={styles.emailInput}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? "hero-email-error" : undefined}
          disabled={isLoading}
          {...register("email")}
        />

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? "..." : "join now!"}
        </button>
      </form>

      {displayError && (
        <p
          id="hero-email-error"
          role="alert"
          className={styles.errorText}
        >
          {displayError}
        </p>
      )}
    </div>
  );
}
