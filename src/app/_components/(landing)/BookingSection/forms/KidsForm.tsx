"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { submitKidsBooking } from "@/app/actions/submitKidsBooking";
import styles from "../BookingSection.module.scss";

const SLOTS = ["10:00am – 12:00pm", "12:00pm – 2:00pm", "2:00pm – 4:00pm"];

const AU_PHONE_RE = /^(\+?61|0)(4\d{8}|[2-9]\d{8})$/;

const schema = z
  .object({
    hasUnderSix: z.boolean(),
    guardianName: z.string().optional(),
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
    numberOfPeople: z.string().min(1, "Number of people is required"),
    date: z.string().min(1, "Please select a date"),
    comments: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasUnderSix && !data.guardianName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianName"],
        message: "Guardian name is required when children under 6 are attending",
      });
    }
  });

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";

export default function KidsForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasUnderSix, setHasUnderSix] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: { hasUnderSix: false, slot: "", numberOfPeople: "" },
  });

  const handleUnderSixToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setHasUnderSix(checked);
    setValue("hasUnderSix", checked);
    if (!checked) setValue("guardianName", "");
  };

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setServerError(null);

    const formData = new FormData();
    formData.set("hasUnderSix", String(values.hasUnderSix));
    if (values.guardianName) formData.set("guardianName", values.guardianName);
    formData.set("organiserName", values.organiserName);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("slot", values.slot);
    formData.set("numberOfPeople", values.numberOfPeople);
    formData.set("date", values.date);
    if (values.comments) formData.set("comments", values.comments);

    const result = await submitKidsBooking(formData);

    if ("error" in result) {
      setServerError(result.error);
      setStatus("error");
    } else {
      reset();
      setHasUnderSix(false);
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
      {/* Under-6 iOS toggle */}
      <div className={styles.toggleBlock}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleSrOnly}
            checked={hasUnderSix}
            onChange={handleUnderSixToggle}
            disabled={isLoading}
            aria-describedby={hasUnderSix ? "kids-guardianName-error" : undefined}
          />
          <span className={styles.toggleTrack} aria-hidden="true">
            <span className={styles.toggleThumb} />
          </span>
          <span className={styles.toggleText}>Children under 6 attending?</span>
        </label>

        {hasUnderSix && (
          <div className={`${styles.field} ${styles.guardianField}`}>
            <label htmlFor="kids-guardianName" className={styles.label}>
              Guardian name
            </label>
            <input
              id="kids-guardianName"
              type="text"
              placeholder="guardian's full name"
              autoComplete="name"
              className={styles.input}
              aria-invalid={!!errors.guardianName}
              aria-describedby={errors.guardianName ? "kids-guardianName-error" : undefined}
              disabled={isLoading}
              {...register("guardianName")}
            />
            {errors.guardianName && (
              <p id="kids-guardianName-error" role="alert" className={styles.fieldError}>
                {errors.guardianName.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Row 1: Organiser name · Email · Phone */}
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label htmlFor="kids-organiserName" className={styles.label}>
            Organiser name
          </label>
          <input
            id="kids-organiserName"
            type="text"
            placeholder="full name"
            autoComplete="name"
            className={styles.input}
            aria-invalid={!!errors.organiserName}
            aria-describedby={errors.organiserName ? "kids-organiserName-error" : undefined}
            disabled={isLoading}
            {...register("organiserName")}
          />
          {errors.organiserName && (
            <p id="kids-organiserName-error" role="alert" className={styles.fieldError}>
              {errors.organiserName.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="kids-email" className={styles.label}>
            Email
          </label>
          <input
            id="kids-email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            className={styles.input}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "kids-email-error" : undefined}
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p id="kids-email-error" role="alert" className={styles.fieldError}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="kids-phone" className={styles.label}>
            Phone number
          </label>
          <input
            id="kids-phone"
            type="tel"
            placeholder="+61 412 345 678"
            autoComplete="tel"
            className={styles.input}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "kids-phone-error" : undefined}
            disabled={isLoading}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="kids-phone-error" role="alert" className={styles.fieldError}>
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Preferred slot · Number of people · Date */}
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label htmlFor="kids-slot" className={styles.label}>
            Preferred time slot
          </label>
          <div className={styles.selectWrapperInline}>
            <select
              id="kids-slot"
              className={`${styles.select} ${styles.selectFluid}`}
              disabled={isLoading}
              aria-invalid={!!errors.slot}
              aria-describedby={errors.slot ? "kids-slot-error" : undefined}
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
            <p id="kids-slot-error" role="alert" className={styles.fieldError}>
              {errors.slot.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="kids-numberOfPeople" className={styles.label}>
            Number of people
          </label>
          <div className={styles.selectWrapperInline}>
            <select
              id="kids-numberOfPeople"
              className={`${styles.select} ${styles.selectFluid}`}
              disabled={isLoading}
              aria-invalid={!!errors.numberOfPeople}
              aria-describedby={errors.numberOfPeople ? "kids-numberOfPeople-error" : undefined}
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
            <p id="kids-numberOfPeople-error" role="alert" className={styles.fieldError}>
              {errors.numberOfPeople.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="kids-date" className={styles.label}>
            Date
          </label>
          <input
            id="kids-date"
            type="date"
            min={today}
            className={styles.dateInput}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "kids-date-error" : undefined}
            disabled={isLoading}
            onClick={(e) => {
              try { (e.currentTarget as HTMLInputElement).showPicker(); } catch {}
            }}
            {...register("date")}
          />
          {errors.date && (
            <p id="kids-date-error" role="alert" className={styles.fieldError}>
              {errors.date.message}
            </p>
          )}
        </div>
      </div>

      {/* Additional comments */}
      <div className={styles.commentsGroup}>
        <label htmlFor="kids-comments" className={styles.label}>
          Additional comments
        </label>
        <input
          id="kids-comments"
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
        <p className={styles.pricing}>AUD $70 per person</p>
      </div>
    </form>
  );
}
