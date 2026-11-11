import {
  formatDepartmentAnswer,
  type DepartmentAnswers,
  type QuestionSnapshot,
} from "./schema";

// Quoting protects CSV structure; the prefix protects spreadsheet execution.
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s\uFEFF]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text))
    text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function inductionCsv(
  rows: {
    id: string;
    eventId: string;
    cycleId: string;
    departmentId: string;
    name: string;
    email: string;
    rollNumber: string;
    phone: string;
    branch: string;
    linkedinUrl: string;
    githubUrl: string;
    orcidUrl: string | null;
    portfolioUrl: string | null;
    otherClubs: string;
    whyGdgc: string;
    preference: number;
    answers: DepartmentAnswers;
    formVersion: number;
    questionSnapshot: QuestionSnapshot[];
    createdAt: string;
  }[],
) {
  const headers = [
    "Submission ID",
    "Event",
    "Cycle",
    "Domain",
    "Preference",
    "Submitted at",
    "Name",
    "Institute email",
    "Roll number",
    "Phone",
    "Branch",
    "LinkedIn",
    "GitHub",
    "ORCID",
    "Portfolio",
    "Other clubs",
    "Why GDGC",
    "Form version",
    "Domain questions and answers",
  ];
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.eventId,
        row.cycleId,
        row.departmentId,
        row.preference,
        row.createdAt,
        row.name,
        row.email,
        row.rollNumber,
        row.phone,
        row.branch,
        row.linkedinUrl,
        row.githubUrl,
        row.orcidUrl,
        row.portfolioUrl,
        row.otherClubs,
        row.whyGdgc,
        row.formVersion,
        row.questionSnapshot
          .filter((question) => question.type !== "common")
          .map(
            (question) =>
              `${question.label}\n${formatDepartmentAnswer(row.answers[question.id], question)}`,
          )
          .join("\n\n"),
      ]
        .map(csvCell)
        .join(","),
    ),
  ];
  return `${lines.join("\r\n")}\r\n`;
}
