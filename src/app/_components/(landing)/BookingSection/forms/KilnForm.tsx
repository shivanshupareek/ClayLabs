"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { submitKilnBooking } from "@/app/actions/submitKilnBooking";
import styles from "../BookingSection.module.scss";

const FIRING_TYPES = ["Bisque firing (cone 06)", "Glaze firing (cone 6)"];

const SLOTS = ["10:00am – 12:00pm", "12:00pm – 2:00pm", "2:00pm – 4:00pm"];

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

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";

export default function KilnForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: { firingType: "", slot: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setServerError(null);

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("firingType", values.firingType);
    formData.set("date", values.date);
    formData.set("slot", values.slot);
    if (values.comments) formData.set("comments", values.comments);

    const result = await submitKilnBooking(formData);

    if ("error" in result) {
      setServerError(result.error);
      setStatus("error");
    } else {
      reset();
      setStatus("success");
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isLoading}
    >
      {/* Row 1: Name · Email · Phone */}
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label htmlFor="kiln-name" className={styles.label}>
            Name
          </label>
          <input
            id="kiln-name"
            type="text"
            placeholder="full name"
            autoComplete="name"
            className={styles.input}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "kiln-name-error" : undefined}
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && (
            <p id="kiln-name-error" role="alert" className={styles.fieldError}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="kiln-email" className={styles.label}>
            Email
          </label>
          <input
            id="kiln-email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            className={styles.input}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "kiln-email-error" : undefined}
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p id="kiln-email-error" role="alert" className={styles.fieldError}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="kiln-phone" className={styles.label}>
            Phone number
          </label>
          <input
            id="kiln-phone"
            type="tel"
            placeholder="+61 412 345 678"
            autoComplete="tel"
            className={styles.input}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "kiln-phone-error" : undefined}
            disabled={isLoading}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="kiln-phone-error" role="alert" className={styles.fieldError}>
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Firing type · Date · Slot */}
      <div className={styles.scheduleRow}>
        <fieldset className={styles.scheduleGroup}>
          <legend className={styles.label}>Preferred schedule</legend>
          <div className={styles.dropdowns}>
            <div className={styles.selectWrapper}>
              <select
                id="kiln-firingType"
                className={`${styles.select} ${styles.selectWide}`}
                disabled={isLoading}
                aria-label="Firing type"
                aria-invalid={!!errors.firingType}
                aria-describedby={errors.firingType ? "kiln-firingType-error" : undefined}
                {...register("firingType")}
              >
                <option value="" disabled>
                  Firing type
                </option>
                {FIRING_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <select
                id="kiln-slot"
                className={styles.select}
                disabled={isLoading}
                aria-label="Preferred time slot"
                aria-invalid={!!errors.slot}
                aria-describedby={errors.slot ? "kiln-slot-error" : undefined}
                {...register("slot")}
              >
                <option value="" disabled>
                  Slot
                </option>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(errors.firingType || errors.slot) && (
            <p
              id={errors.firingType ? "kiln-firingType-error" : "kiln-slot-error"}
              role="alert"
              className={styles.fieldError}
            >
              {errors.firingType?.message ?? errors.slot?.message}
            </p>
          )}
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="kiln-date" className={styles.label}>
            Date
          </label>
          <input
            id="kiln-date"
            type="date"
            min={today}
            className={styles.dateInput}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "kiln-date-error" : undefined}
            disabled={isLoading}
            onClick={(e) => {
              try { (e.currentTarget as HTMLInputElement).showPicker(); } catch {}
            }}
            {...register("date")}
          />
          {errors.date && (
            <p id="kiln-date-error" role="alert" className={styles.fieldError}>
              {errors.date.message}
            </p>
          )}
        </div>
      </div>

      {/* Additional comments — full width */}
      <div className={styles.commentsGroup}>
        <label htmlFor="kiln-comments" className={styles.label}>
          Additional comments
        </label>
        <input
          id="kiln-comments"
          type="text"
          placeholder="write your comments"
          className={styles.input}
          disabled={isLoading}
          {...register("comments")}
        />
      </div>

      {/* Submit row */}
      <div className={styles.submitRow}>
        {serverError && (
          <p role="alert" className={styles.serverError}>
            {serverError}
          </p>
        )}
        {isSuccess ? (
          <p role="status" aria-live="polite" className={styles.successText}>
            we&apos;ll be in touch soon!
          </p>
        ) : (
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            <span className={styles.btnLabel}>
              {isLoading ? "..." : "submit enquiry"}
            </span>
            {!isLoading && (
              <span className={styles.btnArrow} aria-hidden="true">
                <ArrowRight size={14} focusable={false} />
              </span>
            )}
          </button>
        )}
        <p className={styles.pricing}>Pricing depends on piece size — we&apos;ll confirm before firing</p>
      </div>
    </form>
  );
}
