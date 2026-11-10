"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { submitInductionInterest } from "@/app/events/[id]/apply/actions";
import { getDepartment } from "@/lib/content/departments";
import { branches } from "@/lib/content/registration";
import {
  commonQuestionLabels,
  commonDetailsSchema,
  departmentAnswersSchema,
  visibleAnswers,
  isQuestionVisible,
  formatDepartmentAnswer,
  type CommonDraft,
  type InductionCycle,
  type InductionDepartment,
} from "@/lib/inductions/schema";
import { QuestionInput } from "./question-input";
import { Expectations } from "./expectations";
import { DepartmentIcon } from "./department-choices";
import { useInductionFlow } from "./flow-provider";

const labels = commonQuestionLabels;
const stepTitles = [
  "Tell us about you",
  "A little about your interest",
  "Review your answers",
];

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="club-form-field" data-invalid={error ? "" : undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {(hint || error) && (
        <p
          id={`${id}-message`}
          className={error ? "club-form-error" : "club-form-hint"}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function InterestForm({
  eventId,
  eventSlug,
  eventTitle,
  cycle,
  department,
  open,
  status,
}: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  cycle: InductionCycle;
  department: InductionDepartment;
  open: boolean;
  status: string;
}) {
  const identity = getDepartment(department.id)!;
  const flow = useInductionFlow();
  const [step, setStep] = useState(flow.commonReady ? 1 : 0);
  const [focusVersion, setFocusVersion] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<"created" | "duplicate">();
  const [leaveBlank, setLeaveBlank] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const draftAnswers = Object.fromEntries(
    department.questions.map((question) => [
      question.id,
      flow.drafts[department.id]?.[question.id] ??
        (question.type === "ranking"
          ? question.options.map((option) => option.id)
          : ""),
    ]),
  );
  const answers = visibleAnswers(department, draftAnswers);
  const questions = department.questions.filter((question) =>
    isQuestionVisible(question, draftAnswers),
  );
  const submitted =
    receipt === "created" || flow.received.includes(department.id);
  const hasReceipt = submitted || receipt === "duplicate";
  const prefix = `interest-${department.id}`;

  useEffect(() => {
    if (!focusVersion) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [focusVersion]);

  function goTo(next: number) {
    setErrors({});
    setAlert("");
    setStep(next);
    setFocusVersion((value) => value + 1);
  }

  function showErrors(issues: { path: PropertyKey[]; message: string }[]) {
    const next: Record<string, string> = {};
    for (const issue of issues) next[String(issue.path[0])] ??= issue.message;
    setErrors(next);
    requestAnimationFrame(() =>
      document.getElementById(`${prefix}-${Object.keys(next)[0]}`)?.focus(),
    );
  }

  function continueCommon() {
    const parsed = commonDetailsSchema.safeParse(flow.common);
    if (!parsed.success) return showErrors(parsed.error.issues);
    flow.setCommon(parsed.data);
    flow.setCommonReady(true);
    goTo(1);
  }

  function continueQuestions() {
    const parsed = departmentAnswersSchema(department).safeParse(answers);
    if (!parsed.success) return showErrors(parsed.error.issues);
    flow.saveDraft(department.id, parsed.data);
    goTo(2);
  }

  async function submit() {
    if (busy) return;
    // Recheck both stages in case shared details changed on another department page.
    const common = commonDetailsSchema.safeParse(flow.common);
    if (!common.success) {
      goTo(0);
      showErrors(common.error.issues);
      return;
    }
    const parsedAnswers =
      departmentAnswersSchema(department).safeParse(answers);
    if (!parsedAnswers.success) {
      goTo(1);
      showErrors(parsedAnswers.error.issues);
      return;
    }
    setBusy(true);
    setAlert("");
    const result = await submitInductionInterest(eventId, department.id, {
      version: cycle.version,
      common: common.data,
      answers: parsedAnswers.data,
      leaveBlank,
    }).catch(() => ({
      ok: false as const,
      error:
        "We couldn’t save your form. Your answers are still here; please try again.",
    }));
    setBusy(false);
    if (!result.ok) {
      setAlert(result.error);
      return;
    }
    if (result.status === "created")
      flow.markReceived(department.id, common.data.email);
    setReceipt(result.status);
    setFocusVersion((value) => value + 1);
  }

  function commonField(key: keyof CommonDraft, hint?: string) {
    const id = `${prefix}-${key}`;
    const props = {
      id,
      name: key,
      value: flow.common[key],
      required: true,
      "aria-invalid": errors[key] ? (true as const) : undefined,
      "aria-describedby": errors[key] || hint ? `${id}-message` : undefined,
      onChange: (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => {
        flow.setCommon({ ...flow.common, [key]: event.target.value });
      },
    };
    return (
      <Field
        key={key}
        id={id}
        label={labels[key]}
        hint={hint}
        error={errors[key]}
      >
        {key === "branch" ? (
          <select {...props}>
            <option value="" disabled>
              Select your branch
            </option>
            {branches.map((branch) => (
              <option key={branch}>{branch}</option>
            ))}
          </select>
        ) : key === "otherClubs" || key === "whyGdgc" ? (
          <textarea
            {...props}
            rows={key === "whyGdgc" ? 4 : 2}
            maxLength={key === "whyGdgc" ? 2000 : 1000}
          />
        ) : (
          <input
            {...props}
            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
            autoComplete={key === "phone" ? "tel" : key}
            maxLength={key === "name" ? 80 : key === "email" ? 254 : 18}
          />
        )}
      </Field>
    );
  }

  return (
    <div className="induction-form-page" data-tone={identity.color}>
      <header className="induction-application-heading">
        <Link href={`/events/${eventSlug}/apply`} className="club-text-link">
          <ArrowLeft size={16} aria-hidden="true" /> All departments
        </Link>
        <p className="club-eyebrow">{eventTitle} · Interest form</p>
        <h1>{identity.inductionTitle}</h1>
        <p>{department.preview}</p>
      </header>
      <div className="induction-form-layout">
        <aside
          className="induction-form-context"
          aria-label="Department expectations"
        >
          <span className="induction-department-icon">
            <DepartmentIcon id={department.id} size={32} />
          </span>
          <h2>Before you start</h2>
          <p>
            Take a look at the topics for this department, then tell us what
            interests you.
          </p>
          <Expectations department={department} headingLevel={3} />
          <p className="induction-context-note">
            The offline round’s date, time, and venue will be announced.
          </p>
        </aside>
        <div className="induction-form-surface">
          {!open ? (
            <div className="induction-form-receipt">
              <h2>
                {status === "upcoming"
                  ? "Forms open soon"
                  : status === "waitlist"
                    ? "Forms are on a waitlist"
                    : "Forms are closed"}
              </h2>
              <p>Check the induction event page for the latest updates.</p>
              <Button asChild className="club-button">
                <Link href={`/events/${eventSlug}`}>
                  Back to the event <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : hasReceipt ? (
            <div className="induction-form-receipt" role="status">
              <CheckCircle2 size={40} strokeWidth={1.5} aria-hidden="true" />
              <h2 ref={heading} tabIndex={-1}>
                {submitted
                  ? "Interest submitted."
                  : "A form is already on file."}
              </h2>
              <p>
                {submitted
                  ? `Your interest has been submitted to ${identity.inductionTitle}. Thanks for telling us about yourself.`
                  : `A form with this email has already been received for ${identity.inductionTitle}. This attempt did not change it.`}
              </p>
              <p>
                Shortlisting and an offline round follow. Submitting a form does
                not confirm selection.
              </p>
              <Button asChild className="club-button">
                <Link href={`/events/${eventSlug}/apply`}>
                  Apply to another department{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <ol
                className="induction-progress"
                aria-label="Application progress"
              >
                {["About you", "Your interest", "Review"].map(
                  (label, index) => (
                    <li
                      key={label}
                      data-active={step === index ? "" : undefined}
                      data-done={step > index ? "" : undefined}
                      aria-current={step === index ? "step" : undefined}
                    >
                      <span>
                        {step > index ? (
                          <CheckCircle2 size={16} aria-hidden="true" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      {label}
                    </li>
                  ),
                )}
              </ol>
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  if (step === 0) continueCommon();
                  else if (step === 1) continueQuestions();
                  else void submit();
                }}
              >
                <div className="induction-form-intro">
                  <p className="club-eyebrow">Step {step + 1} of 3</p>
                  <h2 ref={heading} tabIndex={-1}>
                    {stepTitles[step]}
                  </h2>
                  <p>
                    {step === 0
                      ? "These details carry over when you apply to another department in this flow. All fields are required."
                      : step === 1
                        ? "A short answer in your own words is all you need."
                        : "Check the details below. This form goes to the GDGC induction team for this department."}
                  </p>
                </div>
                <fieldset disabled={busy} className="induction-form-fields">
                  <legend className="sr-only">{stepTitles[step]}</legend>
                  <input
                    type="hidden"
                    name="leaveBlank"
                    value={leaveBlank}
                    onChange={(event) => setLeaveBlank(event.target.value)}
                  />
                  {step === 0 && (
                    <>
                      {commonField("name")}
                      <div className="club-form-row">
                        {commonField("email", "Use your @nitj.ac.in address.")}
                        {commonField("phone")}
                      </div>
                      {commonField("branch")}
                      {commonField(
                        "otherClubs",
                        "Write None if you are not part of another club.",
                      )}
                      {commonField("whyGdgc")}
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <div className="induction-details-summary">
                        <div>
                          <strong>{flow.common.name}</strong>
                          <span>{flow.common.email}</span>
                        </div>
                        <button
                          className="club-text-link"
                          type="button"
                          onClick={() => goTo(0)}
                        >
                          Edit details
                        </button>
                      </div>
                      {questions.map((question) => (
                        <QuestionInput
                          key={question.id}
                          id={`${prefix}-${question.id}`}
                          question={question}
                          value={draftAnswers[question.id]}
                          error={errors[question.id]}
                          onChange={(value) =>
                            flow.saveDraft(department.id, {
                              ...draftAnswers,
                              [question.id]: value,
                            })
                          }
                        />
                      ))}
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div className="induction-review-heading">
                        <h3>About you</h3>
                        <button
                          type="button"
                          className="club-text-link"
                          onClick={() => goTo(0)}
                        >
                          Edit details
                        </button>
                      </div>
                      <dl className="induction-review-details">
                        {(Object.keys(labels) as (keyof CommonDraft)[]).map(
                          (key) => (
                            <div key={key}>
                              <dt>{labels[key]}</dt>
                              <dd>{flow.common[key] || "None"}</dd>
                            </div>
                          ),
                        )}
                      </dl>
                      <div className="induction-review-heading">
                        <h3>Your interest</h3>
                        <button
                          type="button"
                          className="club-text-link"
                          onClick={() => goTo(1)}
                        >
                          Edit answer
                        </button>
                      </div>
                      {questions.map((question) => (
                        <div
                          className="induction-review-answer"
                          key={question.id}
                        >
                          <h4>{question.label}</h4>
                          <p>
                            {formatDepartmentAnswer(
                              answers[question.id],
                              question,
                            ) || "No answer provided"}
                          </p>
                        </div>
                      ))}
                      <p className="induction-context-note">
                        This is an expression of interest. Shortlisting and an
                        offline round follow before selection.
                      </p>
                    </>
                  )}
                </fieldset>
                {alert && (
                  <p className="club-form-alert" role="alert">
                    {alert}
                  </p>
                )}
                <div className="induction-form-actions">
                  {step > 0 && (
                    <button
                      className="club-text-link"
                      type="button"
                      disabled={busy}
                      onClick={() => goTo(step - 1)}
                    >
                      <ArrowLeft size={16} aria-hidden="true" /> Back
                    </button>
                  )}
                  <Button className="club-button" type="submit" disabled={busy}>
                    {busy ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="club-form-spinner"
                          aria-hidden="true"
                        />{" "}
                        Submitting
                      </>
                    ) : (
                      <>
                        {step === 0
                          ? "Continue"
                          : step === 1
                            ? "Review answers"
                            : `Submit to ${identity.inductionTitle}`}
                        <ArrowRight size={16} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
