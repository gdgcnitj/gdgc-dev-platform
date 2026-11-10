"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { submitInductionApplication } from "@/app/events/[id]/apply/actions";
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
  type DepartmentAnswers,
  type InductionCycle,
  type InductionDepartment,
} from "@/lib/inductions/schema";
import { QuestionInput } from "./question-input";
import { Expectations } from "./expectations";
import { DepartmentIcon } from "./department-icon";
import { useInductionFlow } from "./flow-provider";

const labels = commonQuestionLabels;
const ordinal = ["First", "Second", "Third", "Fourth"];
const progressLabels = ["About you", "Departments", "Questions", "Review"];

type Step =
  | { kind: "about" }
  | { kind: "choose" }
  | { kind: "questions"; department: InductionDepartment; index: number }
  | { kind: "review" };

const fieldTypes: Partial<
  Record<keyof CommonDraft, { type: string; autoComplete?: string; max: number }>
> = {
  name: { type: "text", autoComplete: "name", max: 80 },
  email: { type: "email", autoComplete: "email", max: 254 },
  rollNumber: { type: "text", autoComplete: "off", max: 12 },
  phone: { type: "tel", autoComplete: "tel", max: 18 },
  linkedinUrl: { type: "url", autoComplete: "url", max: 200 },
  githubUrl: { type: "url", autoComplete: "url", max: 200 },
  orcidUrl: { type: "text", autoComplete: "off", max: 200 },
};

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

function draftAnswers(
  department: InductionDepartment,
  saved: DepartmentAnswers | undefined,
): DepartmentAnswers {
  return Object.fromEntries(
    department.questions.map((question) => [
      question.id,
      saved?.[question.id] ??
        (question.type === "ranking"
          ? question.options.map((option) => option.id)
          : ""),
    ]),
  );
}

export function ApplicationFlow({
  eventId,
  eventSlug,
  eventTitle,
  cycle,
  open,
  status,
  initialDepartment,
}: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  cycle: InductionCycle;
  open: boolean;
  status: string;
  initialDepartment?: string;
}) {
  const flow = useInductionFlow();
  const [focusVersion, setFocusVersion] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{
    status: "created" | "duplicate";
    departments: string[];
    remaining: number;
  }>();
  const [leaveBlank, setLeaveBlank] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const max = cycle.maxDepartments;
  const selectable = Math.max(0, max - flow.received.length);
  const selected = flow.selected
    .map((id) => cycle.departments.find((item) => item.id === id))
    .filter((item) => item !== undefined);
  const steps: Step[] = [
    { kind: "about" },
    { kind: "choose" },
    ...selected.map((department, index) => ({
      kind: "questions" as const,
      department,
      index,
    })),
    { kind: "review" },
  ];
  // A restored step past the choices needs at least one department.
  const stepIndex = Math.min(flow.step, selected.length ? steps.length - 1 : 1);
  const step = steps[stepIndex];
  const progress =
    step.kind === "about"
      ? 0
      : step.kind === "choose"
        ? 1
        : step.kind === "questions"
          ? 2
          : 3;

  // A department link preselects that choice once, after any saved draft loads.
  const preselected = useRef(false);
  useEffect(() => {
    if (!flow.restored || preselected.current) return;
    preselected.current = true;
    if (
      initialDepartment &&
      !flow.selected.length &&
      !flow.received.includes(initialDepartment) &&
      cycle.departments.some((item) => item.id === initialDepartment)
    )
      flow.setSelected([initialDepartment]);
  }, [flow, initialDepartment, cycle.departments]);

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
    flow.setStep(next);
    setFocusVersion((value) => value + 1);
  }

  function showErrors(
    prefix: string,
    issues: { path: PropertyKey[]; message: string }[],
  ) {
    const next: Record<string, string> = {};
    for (const issue of issues) next[String(issue.path[0])] ??= issue.message;
    setErrors(next);
    requestAnimationFrame(() =>
      document.getElementById(`${prefix}-${Object.keys(next)[0]}`)?.focus(),
    );
  }

  function answersFor(department: InductionDepartment) {
    return visibleAnswers(
      department,
      draftAnswers(department, flow.answers[department.id]),
    );
  }

  function validateQuestions(department: InductionDepartment, index: number) {
    const parsed = departmentAnswersSchema(department).safeParse(
      answersFor(department),
    );
    if (parsed.success) return parsed.data;
    goTo(2 + index);
    showErrors(`interest-${department.id}`, parsed.error.issues);
  }

  function next() {
    if (step.kind === "about") {
      const parsed = commonDetailsSchema.safeParse(flow.common);
      if (!parsed.success) return showErrors("common", parsed.error.issues);
      // Show applicants the canonical links that will be saved.
      flow.setCommon(parsed.data);
      return goTo(1);
    }
    if (step.kind === "choose") {
      if (!selected.length) {
        setErrors({ departments: "Choose at least one department" });
        return;
      }
      return goTo(2);
    }
    if (step.kind === "questions") {
      const parsed = validateQuestions(step.department, step.index);
      if (!parsed) return;
      flow.saveAnswers(step.department.id, parsed);
      return goTo(stepIndex + 1);
    }
    void submit();
  }

  async function submit() {
    if (busy) return;
    // Recheck every stage in case a saved draft is out of date.
    const common = commonDetailsSchema.safeParse(flow.common);
    if (!common.success) {
      goTo(0);
      showErrors("common", common.error.issues);
      return;
    }
    const applications = [];
    for (const [index, department] of selected.entries()) {
      const answers = validateQuestions(department, index);
      if (!answers) return;
      applications.push({ departmentId: department.id, answers });
    }
    setBusy(true);
    setAlert("");
    const result = await submitInductionApplication(eventId, {
      version: cycle.version,
      common: common.data,
      applications,
      leaveBlank,
    }).catch(() => ({
      ok: false as const,
      error:
        "We couldn’t save your application. Your answers are still here; please try again.",
    }));
    setBusy(false);
    if (!result.ok) {
      setAlert(result.error);
      return;
    }
    flow.markReceived(result.departments, common.data.email);
    flow.setStep(1);
    setReceipt(result);
    setFocusVersion((value) => value + 1);
  }

  function toggle(id: string) {
    setErrors({});
    flow.setSelected(
      flow.selected.includes(id)
        ? flow.selected.filter((item) => item !== id)
        : [...flow.selected, id].slice(0, selectable),
    );
  }

  function commonField(key: keyof CommonDraft, hint?: string) {
    const id = `common-${key}`;
    const props = {
      id,
      name: key,
      value: flow.common[key],
      required: key !== "orcidUrl",
      "aria-invalid": errors[key] ? (true as const) : undefined,
      "aria-describedby": errors[key] || hint ? `${id}-message` : undefined,
      onChange: (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => flow.setCommon({ ...flow.common, [key]: event.target.value }),
    };
    const input = fieldTypes[key];
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
        ) : !input ? (
          <textarea
            {...props}
            rows={key === "whyGdgc" ? 4 : 2}
            maxLength={key === "whyGdgc" ? 2000 : 1000}
          />
        ) : (
          <input
            {...props}
            type={input.type}
            autoComplete={input.autoComplete}
            maxLength={input.max}
            spellCheck={key === "name"}
            autoCapitalize={key === "name" ? "words" : "off"}
            inputMode={key === "phone" ? "tel" : undefined}
          />
        )}
      </Field>
    );
  }

  function reviewHeading(title: ReactNode, target: number) {
    return (
      <div className="induction-review-heading">
        <h3>{title}</h3>
        <button
          type="button"
          className="club-text-link"
          onClick={() => goTo(target)}
        >
          Edit
        </button>
      </div>
    );
  }

  if (!open)
    return (
      <div className="induction-flow">
        <div className="induction-form-surface induction-form-receipt">
          <h2>
            {status === "upcoming"
              ? "Applications open soon"
              : status === "waitlist"
                ? "Applications are on a waitlist"
                : "Applications are closed"}
          </h2>
          <p>Check the induction event page for the latest updates.</p>
          <Button asChild className="club-button">
            <Link href={`/events/${eventSlug}`}>
              Back to the event <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    );

  if (receipt) {
    const names = receipt.departments
      .map((id) => getDepartment(id)?.inductionTitle ?? id)
      .join(" and ");
    return (
      <div className="induction-flow">
        <div className="induction-form-surface induction-form-receipt" role="status">
          <CheckCircle2 size={40} strokeWidth={1.5} aria-hidden="true" />
          <h2 ref={heading} tabIndex={-1}>
            {receipt.status === "created"
              ? "Application submitted."
              : "Already on file."}
          </h2>
          <p>
            {receipt.status === "created"
              ? `Your application for ${names} has been sent to the induction team. Thanks for telling us about yourself.`
              : `An application for ${names} with this email or roll number was already received. This attempt did not change it.`}
          </p>
          <p>
            Shortlisting and an offline round follow. Submitting does not
            confirm selection.
          </p>
          <div className="induction-receipt-actions">
            {receipt.remaining > 0 && (
              <Button
                className="club-button"
                type="button"
                onClick={() => {
                  setReceipt(undefined);
                  goTo(1);
                }}
              >
                Apply to {receipt.remaining} more department
                {receipt.remaining === 1 ? "" : "s"}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            )}
            <Button
              asChild
              className={receipt.remaining > 0 ? "club-button-secondary" : "club-button"}
            >
              <Link href={`/events/${eventSlug}`}>Back to {eventTitle}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const intro = {
    about: {
      eyebrow: "Step 1 of 4",
      title: "Tell us about you",
      text: `We use these details for every department you choose. Everything except ORCID iD is required.`,
    },
    choose: {
      eyebrow: "Step 2 of 4",
      title: "Choose your departments",
      text:
        selectable < max
          ? `You already applied to ${max - selectable} department this session, so you can choose ${selectable} more.`
          : `Pick up to ${max === 2 ? "two" : max}. The first one you pick is your first preference.`,
    },
    questions:
      step.kind === "questions"
        ? {
            eyebrow: `Step 3 of 4 · Department ${step.index + 1} of ${selected.length}`,
            title: getDepartment(step.department.id)!.inductionTitle,
            text: "A short answer in your own words is all you need.",
          }
        : undefined,
    review: {
      eyebrow: "Step 4 of 4",
      title: "Review your application",
      text: "Check everything once. Your application goes to the induction team for each department you chose.",
    },
  }[step.kind]!;

  return (
    <div className="induction-flow">
      <div className="induction-application-heading">
        <p className="club-eyebrow">{eventTitle} · Application</p>
        <h1>
          Where do you want
          <br />
          to contribute?
        </h1>
      </div>
      <div className="induction-form-surface">
        <ol className="induction-progress" aria-label="Application progress">
          {progressLabels.map((label, index) => (
            <li
              key={label}
              data-active={progress === index ? "" : undefined}
              data-done={progress > index ? "" : undefined}
              aria-current={progress === index ? "step" : undefined}
            >
              <span>
                {progress > index ? (
                  <CheckCircle2 size={16} aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              {label}
            </li>
          ))}
        </ol>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            next();
          }}
        >
          <div
            key={`${step.kind}-${step.kind === "questions" ? step.department.id : ""}`}
            className="induction-step-content"
          >
            <div className="induction-form-intro">
              <p className="club-eyebrow">{intro.eyebrow}</p>
              {step.kind === "questions" ? (
                <div className="induction-question-heading">
                  <span
                    className="induction-department-icon"
                    data-tone={getDepartment(step.department.id)!.color}
                  >
                    <DepartmentIcon id={step.department.id} />
                  </span>
                  <h2 ref={heading} tabIndex={-1}>
                    {intro.title}
                  </h2>
                </div>
              ) : (
                <h2 ref={heading} tabIndex={-1}>
                  {intro.title}
                </h2>
              )}
              <p>{intro.text}</p>
              {step.kind === "questions" && (
                <Expectations department={step.department} />
              )}
            </div>
            <fieldset disabled={busy} className="induction-form-fields">
              <legend className="sr-only">{intro.title}</legend>
              <input
                type="hidden"
                name="leaveBlank"
                value={leaveBlank}
                onChange={(event) => setLeaveBlank(event.target.value)}
              />
              {step.kind === "about" && (
                <>
                  {commonField("name")}
                  <div className="club-form-row">
                    {commonField("email", "Use your @nitj.ac.in address.")}
                    {commonField("rollNumber")}
                  </div>
                  <div className="club-form-row">
                    {commonField("phone")}
                    {commonField("branch")}
                  </div>
                  <div className="club-form-row">
                    {commonField("linkedinUrl", "linkedin.com/in/your-name")}
                    {commonField("githubUrl", "github.com/your-username")}
                  </div>
                  {commonField(
                    "orcidUrl",
                    "Only if you have one, like 0000-0002-1825-0097.",
                  )}
                  {commonField(
                    "otherClubs",
                    "Write None if you are not part of another club.",
                  )}
                  {commonField("whyGdgc")}
                </>
              )}
              {step.kind === "choose" && (
                <div
                  role="group"
                  aria-labelledby="departments-count"
                  aria-describedby={
                    errors.departments ? "departments-message" : undefined
                  }
                >
                  <p
                    id="departments-count"
                    className="induction-choice-count"
                    aria-live="polite"
                  >
                    {selected.length} of {selectable} selected
                  </p>
                  <ul className="induction-pick-grid">
                    {cycle.departments.map((department) => {
                      const identity = getDepartment(department.id)!;
                      const position = flow.selected.indexOf(department.id);
                      const received = flow.received.includes(department.id);
                      const full =
                        position < 0 && selected.length >= selectable;
                      return (
                        <li
                          key={department.id}
                          className="induction-pick"
                          data-tone={identity.color}
                          data-selected={position >= 0 ? "" : undefined}
                          data-disabled={received || full ? "" : undefined}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={position >= 0 || received}
                              disabled={received || full}
                              onChange={() => toggle(department.id)}
                            />
                            <span className="induction-department-icon">
                              <DepartmentIcon id={department.id} />
                            </span>
                            <span className="induction-pick-text">
                              <strong>{identity.inductionTitle}</strong>
                              <span>{department.preview}</span>
                            </span>
                            <span className="induction-pick-mark" aria-hidden="true">
                              {position >= 0 ? (
                                position + 1
                              ) : received ? (
                                <Check size={14} />
                              ) : null}
                            </span>
                          </label>
                          <div className="induction-pick-footer">
                            {position >= 0 ? (
                              <span className="induction-pick-badge">
                                {ordinal[position]} choice
                              </span>
                            ) : received ? (
                              <span className="induction-received">
                                <CheckCircle2 size={15} aria-hidden="true" />{" "}
                                Submitted
                              </span>
                            ) : null}
                            <Expectations department={department} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {selected.length === 2 && (
                    <button
                      type="button"
                      className="club-text-link induction-swap"
                      onClick={() =>
                        flow.setSelected([...flow.selected].reverse())
                      }
                    >
                      Swap first and second choice
                    </button>
                  )}
                  {errors.departments && (
                    <p id="departments-message" className="club-form-error">
                      {errors.departments}
                    </p>
                  )}
                </div>
              )}
              {step.kind === "questions" &&
                (() => {
                  const department = step.department;
                  const values = draftAnswers(
                    department,
                    flow.answers[department.id],
                  );
                  return department.questions
                    .filter((question) => isQuestionVisible(question, values))
                    .map((question) => (
                      <QuestionInput
                        key={question.id}
                        id={`interest-${department.id}-${question.id}`}
                        question={question}
                        value={values[question.id]}
                        error={errors[question.id]}
                        onChange={(value) =>
                          flow.saveAnswers(department.id, {
                            ...values,
                            [question.id]: value,
                          })
                        }
                      />
                    ));
                })()}
              {step.kind === "review" && (
                <>
                  {reviewHeading("About you", 0)}
                  <dl className="induction-review-details">
                    {(Object.keys(labels) as (keyof CommonDraft)[]).map(
                      (key) => (
                        <div key={key}>
                          <dt>{labels[key].replace(" (optional)", "")}</dt>
                          <dd>{flow.common[key] || "Not provided"}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                  {selected.map((department, index) => {
                    const answers = answersFor(department);
                    return (
                      <section
                        key={department.id}
                        className="induction-review-department"
                      >
                        {reviewHeading(
                          <>
                            <span className="induction-pick-badge">
                              {ordinal[index]} choice
                            </span>
                            {getDepartment(department.id)!.inductionTitle}
                          </>,
                          2 + index,
                        )}
                        {department.questions
                          .filter((question) =>
                            isQuestionVisible(question, answers),
                          )
                          .map((question) => (
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
                      </section>
                    );
                  })}
                  <p className="induction-context-note">
                    This is an expression of interest. Shortlisting and an
                    offline round follow before selection. You can apply to at
                    most {max} departments in this cycle.
                  </p>
                </>
              )}
            </fieldset>
          </div>
          {alert && (
            <p className="club-form-alert" role="alert">
              {alert}
            </p>
          )}
          <div className="induction-form-actions">
            {stepIndex > 0 && (
              <button
                className="club-text-link"
                type="button"
                disabled={busy}
                onClick={() => goTo(stepIndex - 1)}
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
                  {step.kind === "review"
                    ? `Submit application`
                    : step.kind === "questions" &&
                        step.index === selected.length - 1
                      ? "Review application"
                      : "Continue"}
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
