"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { submitAppDevResponse } from "@/app/forms/mobile26/actions";
import { Button } from "@/components/ui/button";
import { appDevPrompt, appDevSchema, type AppDevResponse } from "@/lib/content/app-dev";
import { branches } from "@/lib/content/registration";

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="club-form-field" data-invalid={error ? "" : undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p id={`${id}-message`} className="club-form-error">{error}</p> : null}
    </div>
  );
}

export function AppDevResponseForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AppDevResponse>({
    resolver: zodResolver(appDevSchema),
    defaultValues: { name: "", answer: "", leaveBlank: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await submitAppDevResponse(data).catch(() => ({
      ok: false as const,
      error: "Something went wrong. Please try again.",
    }));
    if (result.ok) setSubmitted(true);
    else setError("root", { message: result.error });
  });

  const describe = (field: keyof AppDevResponse) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-message` : undefined,
  });

  if (submitted) {
    return (
      <div className="club-form-card club-form-done" role="status">
        <CheckCircle2 size={40} strokeWidth={1.6} aria-hidden="true" />
        <h2>Got it.</h2>
        <p>Thanks for sharing. That answer is with the team.</p>
      </div>
    );
  }

  return (
    <form className="club-form-card" onSubmit={onSubmit} noValidate aria-labelledby="app-dev-thanks">
      <div className="club-form-trap" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          {...register("leaveBlank")}
          type="hidden"
        />
      </div>
      <FormField id="name" label="Name" error={errors.name?.message}>
        <input id="name" autoComplete="name" {...describe("name")} {...register("name")} />
      </FormField>
      <FormField id="branch" label="Branch" error={errors.branch?.message}>
        <select id="branch" defaultValue="" {...describe("branch")} {...register("branch")}>
          <option value="" disabled>Select your branch</option>
          {branches.map((branch) => <option key={branch}>{branch}</option>)}
        </select>
      </FormField>
      <FormField id="answer" label={appDevPrompt} error={errors.answer?.message}>
        <textarea id="answer" rows={5} {...describe("answer")} {...register("answer")} />
      </FormField>

      {errors.root && <p className="club-form-alert" role="alert">{errors.root.message}</p>}

      <Button type="submit" className="club-button club-form-submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="club-form-spinner" size={16} aria-hidden="true" /> Sending
          </>
        ) : (
          <>
            Submit <ArrowRight className="club-action-arrow" size={16} aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
