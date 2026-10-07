"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { registerForEvent } from "@/app/events/actions";
import { Button } from "@/components/ui/button";
import { departments, socialLinks } from "@/lib/content/home";
import {
  branches,
  registrationSchema,
  years,
  type Registration,
} from "@/lib/content/registration";

function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="club-form-field" data-invalid={error ? "" : undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p id={`${id}-message`} className="club-form-error">{error}</p>
      ) : hint ? (
        <p id={`${id}-message`} className="club-form-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function RegistrationForm({ eventId, date }: { eventId: string; date?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Registration>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: "", email: "", rollNumber: "", phone: "", interests: [] },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await registerForEvent(eventId, data).catch(() => ({
      ok: false as const,
      error: "Something went wrong. Please try again.",
    }));
    if (result.ok) setSubmitted(true);
    else setError("root", { message: result.error });
  });

  const describe = (field: keyof Registration) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": `${field}-message`,
  });

  if (submitted) {
    return (
      <div className="club-form-card club-form-done" role="status">
        <CheckCircle2 size={40} strokeWidth={1.6} aria-hidden="true" />
        <h2>You&apos;re registered.</h2>
        <p>
          See you{date ? ` on ${date}` : ""}. Watch the chapter&apos;s{" "}
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>{" "}
          for the venue and time.
        </p>
      </div>
    );
  }

  return (
    <form className="club-form-card" onSubmit={onSubmit} noValidate aria-labelledby="register-title">
      <h2 id="register-title">Register</h2>
      <p className="club-form-intro">Takes a minute. All fields are required.</p>

      <FormField id="name" label="Full name" error={errors.name?.message}>
        <input id="name" autoComplete="name" {...describe("name")} {...register("name")} />
      </FormField>
      <FormField id="email" label="College email" error={errors.email?.message} hint="Your @nitj.ac.in address">
        <input id="email" type="email" inputMode="email" autoComplete="email" {...describe("email")} {...register("email")} />
      </FormField>
      <div className="club-form-row">
        <FormField id="rollNumber" label="Roll number" error={errors.rollNumber?.message}>
          <input id="rollNumber" autoComplete="off" {...describe("rollNumber")} {...register("rollNumber")} />
        </FormField>
        <FormField id="year" label="Year" error={errors.year?.message}>
          <select id="year" defaultValue="" {...describe("year")} {...register("year")}>
            <option value="" disabled>Select</option>
            {years.map((year) => <option key={year}>{year}</option>)}
          </select>
        </FormField>
      </div>
      <FormField id="branch" label="Branch" error={errors.branch?.message}>
        <select id="branch" defaultValue="" {...describe("branch")} {...register("branch")}>
          <option value="" disabled>Select your branch</option>
          {branches.map((branch) => <option key={branch}>{branch}</option>)}
        </select>
      </FormField>
      <FormField id="phone" label="Phone / WhatsApp" error={errors.phone?.message}>
        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" {...describe("phone")} {...register("phone")} />
      </FormField>

      <fieldset
        className="club-form-field"
        data-invalid={errors.interests ? "" : undefined}
        aria-describedby="interests-message"
      >
        <legend>Departments you&apos;re curious about</legend>
        <div className="club-form-chips">
          {departments.map((department) => {
            const Icon = department.icon;
            return (
              <label key={department.id} className="club-form-chip" data-tone={department.color}>
                <input type="checkbox" value={department.id} {...register("interests")} />
                <Icon size={15} aria-hidden="true" />
                {department.title}
              </label>
            );
          })}
        </div>
        <p id="interests-message" className={errors.interests ? "club-form-error" : "club-form-hint"}>
          {errors.interests?.message ?? "Pick as many as you like."}
        </p>
      </fieldset>

      {errors.root && <p className="club-form-alert" role="alert">{errors.root.message}</p>}

      <Button type="submit" className="club-button club-form-submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="club-form-spinner" size={16} aria-hidden="true" /> Registering
          </>
        ) : (
          <>
            Register <ArrowRight className="club-action-arrow" size={16} aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
