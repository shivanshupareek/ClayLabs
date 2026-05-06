"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { submitBooking } from "@/app/actions/submitBooking";
import styles from "./BookingSection.module.scss";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIMES = ["10:00am – 12:00pm", "06:00pm – 08:00pm"];

const AU_PHONE_RE = /^(\+?61|0)(4\d{8}|[2-9]\d{8})$/;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => AU_PHONE_RE.test(val.replace(/[\s.\-()]/g, "")),
      "Enter a valid Australian phone number"
    ),
  day: z.string().min(1, "Please select a day"),
  time: z.string().min(1, "Please select a time"),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";

export default function BookingSection() {
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
    defaultValues: { day: "", time: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setServerError(null);

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("day", values.day);
    formData.set("time", values.time);
    if (values.comments) formData.set("comments", values.comments);

    const result = await submitBooking(formData);

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

  return (
    <section id="book" className={styles.section} aria-labelledby="booking-heading">
      <div className={styles.container}>
        <h2 id="booking-heading" className={styles.heading}>
          Book your session
        </h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={isLoading}
        >
          {/* Row 1: Name · Email · Phone */}
          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <label htmlFor="booking-name" className={styles.label}>
                Name
              </label>
              <input
                id="booking-name"
                type="text"
                placeholder="full name"
                autoComplete="name"
                className={styles.input}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "booking-name-error" : undefined}
                disabled={isLoading}
                {...register("name")}
              />
              {errors.name && (
                <p id="booking-name-error" role="alert" className={styles.fieldError}>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-email" className={styles.label}>
                Email
              </label>
              <input
                id="booking-email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                className={styles.input}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "booking-email-error" : undefined}
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p id="booking-email-error" role="alert" className={styles.fieldError}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="booking-phone" className={styles.label}>
                Phone number
              </label>
              <input
                id="booking-phone"
                type="tel"
                placeholder="+61 412 345 678"
                autoComplete="tel"
                className={styles.input}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "booking-phone-error" : undefined}
                disabled={isLoading}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="booking-phone-error" role="alert" className={styles.fieldError}>
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Preferred schedule · Additional comments */}
          <div className={styles.scheduleRow}>
            <fieldset className={styles.scheduleGroup}>
              <legend className={styles.label}>Preferred schedule</legend>
              <div className={styles.dropdowns}>
                <div className={styles.selectWrapper}>
                  <select
                    id="booking-day"
                    className={styles.select}
                    disabled={isLoading}
                    aria-label="Day of the week"
                    aria-invalid={!!errors.day}
                    aria-describedby={errors.day ? "booking-day-error" : undefined}
                    {...register("day")}
                  >
                    <option value="" disabled>
                      Day
                    </option>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.selectWrapper}>
                  <select
                    id="booking-time"
                    className={styles.select}
                    disabled={isLoading}
                    aria-label="Preferred time slot"
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? "booking-time-error" : undefined}
                    {...register("time")}
                  >
                    <option value="" disabled>
                      Time
                    </option>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {(errors.day || errors.time) && (
                <p
                  id={errors.day ? "booking-day-error" : "booking-time-error"}
                  role="alert"
                  className={styles.fieldError}
                >
                  {errors.day?.message ?? errors.time?.message}
                </p>
              )}
            </fieldset>

            <div className={styles.commentsGroup}>
              <label htmlFor="booking-comments" className={styles.label}>
                Additional comments
              </label>
              <input
                id="booking-comments"
                type="text"
                placeholder="write your comments"
                className={styles.input}
                disabled={isLoading}
                {...register("comments")}
              />
            </div>
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
                  {isLoading ? "..." : "join now!"}
                </span>
                {!isLoading && (
                  <span className={styles.btnArrow} aria-hidden="true">
                    <ArrowRight size={14} focusable={false} />
                  </span>
                )}
              </button>
            )}
            <p className={styles.pricing}>AUD $300 per person — the complete 6-week journey</p>
          </div>
        </form>
      </div>
    </section>
  );
}
