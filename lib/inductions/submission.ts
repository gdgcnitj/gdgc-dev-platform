import type { ClubEvent } from "@/lib/events/schema";
import { canRegister } from "@/lib/events/helpers";
import {
  commonQuestionLabels,
  isQuestionVisible,
  submissionSchema,
  type InductionCycle,
  type QuestionSnapshot,
} from "./schema";

export function prepareInductionSubmission(
  event: ClubEvent,
  cycle: InductionCycle,
  departmentId: string,
  input: unknown,
  now = Date.now(),
) {
  const registration = event.registration;
  if (
    event.visibility !== "published" ||
    registration.mode !== "internal" ||
    registration.form !== "department-interest" ||
    registration.cycleId !== cycle.id ||
    cycle.eventId !== event.id ||
    !canRegister(event, now)
  )
    return {
      ok: false as const,
      code: "closed" as const,
      error: "Interest forms are not open right now.",
    };
  const department = cycle.departments.find((item) => item.id === departmentId);
  if (!department)
    return {
      ok: false as const,
      code: "invalid" as const,
      error: "Choose a department from this induction cycle.",
    };
  if (
    input &&
    typeof input === "object" &&
    "version" in input &&
    Number.isInteger(input.version) &&
    input.version !== cycle.version
  )
    return {
      ok: false as const,
      code: "stale" as const,
      error:
        "This form has changed. Reload the page and review the current questions before submitting.",
    };
  const parsed = submissionSchema(department).safeParse(input);
  if (!parsed.success || parsed.data.leaveBlank?.trim())
    return {
      ok: false as const,
      code: "invalid" as const,
      error: "Check your answers and try again.",
    };
  const { common, answers } = parsed.data;
  const questionSnapshot: QuestionSnapshot[] = [
    ...Object.entries(commonQuestionLabels).map(([id, label]) => ({
      id,
      label,
      type: "common",
    })),
    ...department.questions
      .filter((question) => isQuestionVisible(question, answers))
      .map((question) => ({
        id: question.id,
        label: question.label,
        type: question.type,
        ...("options" in question
          ? { options: question.options.map((option) => ({ ...option })) }
          : {}),
      })),
  ];
  return {
    ok: true as const,
    data: {
      eventId: event.id,
      cycleId: cycle.id,
      departmentId: department.id,
      ...common,
      phone: common.phone.replace(/\D/g, "").slice(-10),
      answers,
      formVersion: cycle.version,
      questionSnapshot,
    },
  };
}

export type PreparedSubmission = Extract<
  ReturnType<typeof prepareInductionSubmission>,
  { ok: true }
>["data"];
