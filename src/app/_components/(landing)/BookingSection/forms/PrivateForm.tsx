"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { submitPrivateBooking } from "@/app/actions/submitPrivateBooking";
import styles from "../BookingSection.module.scss";

const SESSION_TYPES = [
  "Birthday party",
  "Hen's party",
  "Corporate event",
  "Other",
];

const SLOTS = ["10:00am – 12:00pm", "12:00pm – 2:00pm", "2:00pm – 4:00pm"];

const AU_PHONE_RE = /^(\+?61|0)(4\d{8}|[2-9]\d{8})$/;

const schema = z.object({
  organiserName: z.string().min(1, "Organiser name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => AU_PHONE_RE.test(val.replace(/[\s.\-()]/g, "")),
      "Enter a valid Australian phone number"
    ),
  slot: z.string().min(1, "Please select a time slot"),
  sessionType: z.string().min(1, "Please select a session type"),
  numberOfPeople: z.string().min(1, "Number of people is required"),
  date: z.string().min(1, "Please select a date"),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";

export default function PrivateForm() {
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
    defaultValues: { sessionType: "", slot: "", numberOfPeople: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setServerError(null);

    const formData = new FormData();
    formData.set("organiserName", values.organiserName);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("slot", values.slot);
    formData.set("sessionType", values.sessionType);
    formData.set("numberOfPeople", values.numberOfPeople);
    formData.set("date", values.date);
    if (values.comments) formData.set("comments", values.comments);

    const result = await submitPrivateBooking(formData);

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
      {/* Row 1: Organiser name · Email · Phone */}
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label htmlFor="private-organiserName" className={styles.label}>
            Organiser name
          </label>
          <input
            id="private-organiserName"
            type="text"
            placeholder="full name"
            autoComplete="name"
            className={styles.input}
            aria-invalid={!!errors.organiserName}
            aria-describedby={errors.organiserName ? "private-organiserName-error" : undefined}
            disabled={isLoading}
            {...register("organiserName")}
          />
          {errors.organiserName && (
            <p id="private-organiserName-error" role="alert" className={styles.fieldError}>
              {errors.organiserName.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="private-email" className={styles.label}>
            Email
          </label>
          <input
            id="private-email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            className={styles.input}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "private-email-error" : undefined}
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p id="private-email-error" role="alert" className={styles.fieldError}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="private-phone" className={styles.label}>
            Phone number
          </label>
          <input
            id="private-phone"
            type="tel"
            placeholder="+61 412 345 678"
            autoComplete="tel"
            className={styles.input}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "private-phone-error" : undefined}
            disabled={isLoading}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="private-phone-error" role="alert" className={styles.fieldError}>
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Preferred slot · Session for · Number of people · Date */}
      <div className={styles.fieldsRow4Col}>
        <div className={styles.field}>
          <label htmlFor="private-slot" className={styles.label}>
            Preferred time slot
          </label>
          <div className={styles.selectWrapperInline}>
            <select
              id="private-slot"
              className={`${styles.select} ${styles.selectFluid}`}
              disabled={isLoading}
              aria-invalid={!!errors.slot}
              aria-describedby={errors.slot ? "private-slot-error" : undefined}
              {...register("slot")}
            >
              <option value="" disabled>
                Select slot
              </option>
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {errors.slot && (
            <p id="private-slot-error" role="alert" className={styles.fieldError}>
              {errors.slot.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="private-sessionType" className={styles.label}>
            Session for
          </label>
          <div className={styles.selectWrapperInline}>
            <select
              id="private-sessionType"
              className={`${styles.select} ${styles.selectFluid}`}
              disabled={isLoading}
              aria-invalid={!!errors.sessionType}
              aria-describedby={errors.sessionType ? "private-sessionType-error" : undefined}
              {...register("sessionType")}
            >
              <option value="" disabled>
                Select occasion
              </option>
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {errors.sessionType && (
            <p id="private-sessionType-error" role="alert" className={styles.fieldError}>
              {errors.sessionType.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="private-numberOfPeople" className={styles.label}>
            Number of people
          </label>
          <div className={styles.selectWrapperInline}>
            <select
              id="private-numberOfPeople"
              className={`${styles.select} ${styles.selectFluid}`}
              disabled={isLoading}
              aria-invalid={!!errors.numberOfPeople}
              aria-describedby={errors.numberOfPeople ? "private-numberOfPeople-error" : undefined}
              {...register("numberOfPeople")}
            >
              <option value="" disabled>
                Select
              </option>
              {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          {errors.numberOfPeople && (
            <p id="private-numberOfPeople-error" role="alert" className={styles.fieldError}>
              {errors.numberOfPeople.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="private-date" className={styles.label}>
            Date
          </label>
          <input
            id="private-date"
            type="date"
            min={today}
            className={styles.dateInput}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "private-date-error" : undefined}
            disabled={isLoading}
            onClick={(e) => {
              try { (e.currentTarget as HTMLInputElement).showPicker(); } catch {}
            }}
            {...register("date")}
          />
          {errors.date && (
            <p id="private-date-error" role="alert" className={styles.fieldError}>
              {errors.date.message}
            </p>
          )}
        </div>
      </div>

      {/* Additional comments */}
      <div className={styles.commentsGroup}>
        <label htmlFor="private-comments" className={styles.label}>
          Additional comments
        </label>
        <input
          id="private-comments"
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
            see you soon!
          </p>
        ) : (
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            <span className={styles.btnLabel}>
              {isLoading ? "..." : "book now!"}
            </span>
            {!isLoading && (
              <span className={styles.btnArrow} aria-hidden="true">
                <ArrowRight size={14} focusable={false} />
              </span>
            )}
          </button>
        )}
        <p className={styles.pricing}>AUD $90 per person</p>
      </div>
    </form>
  );
}
